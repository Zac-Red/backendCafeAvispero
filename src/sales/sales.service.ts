import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { DataSource, Repository } from 'typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { SalesdetailService } from 'src/salesdetail/salesdetail.service';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { InventoryproductService } from 'src/inventoryproduct/inventoryproduct.service';
import { QueryParamsReportTopClientesSaleDto, QueryParamsSaleDto } from './dto/query-params-sales.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { Customer } from 'src/customers/entities/customer.entity';
import { Salesdetail } from 'src/salesdetail/entities/salesdetail.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly salesdetailservice: SalesdetailService,
    private readonly customersservice: CustomersService,
    private readonly productsservice: ProductsService,
    private readonly inventoryproductservice: InventoryproductService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter,
  ) { }

  async create(createSaleDto: CreateSaleDto) {
    const { salesdetail, customerId, ...restDataSale } = createSaleDto;
    let saleComplet;
    await this.dataSource.transaction(async (manager) => {
      const customer = await this.customersservice.findOne(customerId);
      try {
        const sale = manager.create(Sale, { ...restDataSale, customerId: customer });
        saleComplet = await manager.save(sale);
      } catch (error) {
        this.DBErrors.exceptionsDB(error);
      }

      if (salesdetail.length === 0)
        throw new BadRequestException(`No se recibieron los detalles de la venta`);

      for (const detail of salesdetail) {
        const { productId, amount, price, subtotal } = detail;
        const product = await this.productsservice.findOne(productId);

        await this.salesdetailservice.create(
          { productId, amount, price, subtotal, unitmeasureId: product.unitmeasureId.id, saleId: saleComplet.id },
          manager
        );

        const { stock, ...restDataproduct } = product;
        if (stock < amount) {
          throw new BadRequestException(`El stock del producto ${restDataproduct.name} no es suficiente`);
        }
        await this.productsservice.update(
          restDataproduct.id,
          {
            ...restDataproduct,
            unitmeasureId: Number(restDataproduct.unitmeasureId.id),
            stock: stock - amount
          },
          manager
        );

        await this.inventoryproductservice.inventoryAdjustment(
          { amount, inventorymoveId: 1, productId, unitmeasureId: product.unitmeasureId.id },
          manager
        );
      }
    });
    return {
      saleComplet
    };
  }

  async findAll(queryparamssaleDto: QueryParamsSaleDto) {
    const { clientname, total, limit = 10, page = 1 } = queryparamssaleDto;

    const qb = this.saleRepository.createQueryBuilder('sales')
      .leftJoinAndSelect("sales.customerId", "customer")
      .orderBy("sales.createdAt", "DESC")

    if (clientname) {
      qb.andWhere(`LOWER(customer.name) LIKE :name`, { name: `%${clientname.toLowerCase()}%` });
    }
    if (total) {
      qb.andWhere(`sales.total =: total`, { total });
    }
    return await getAllPaginated(qb, { page, take: limit });
  }

  async findOne(id: string) {
    let sale: Sale;
    if (this.uuidAdapter.IsUUID(id)) {
      sale = await this.saleRepository.findOneBy({ id });
    }
    if (!sale) throw new BadRequestException(`La venta con id ${id} no existe`);
    return sale;
  }

  async findCustomersTop(queryparamsreporttopclientessaleDto: QueryParamsReportTopClientesSaleDto) {
    const { startOfCurrentMonth, endOfCurrentMonth } = queryparamsreporttopclientessaleDto;
    const topCustomers = await this.dataSource
      .getRepository(Sale)
      .createQueryBuilder('sale')
      .select('sale.customerId', 'customerId')
      .addSelect('SUM(sale.total)', 'total_spent')
      .addSelect('COUNT(sale.id)', 'purchase_count')
      .addSelect('customer.name', 'customer_name') 
      .addSelect('customer.nit', 'nit') 
      .leftJoin(Customer, 'customer', 'customer.id = sale.customerId')
      .where('DATE(sale.createdAt) BETWEEN :startOfCurrentMonth AND :endOfCurrentMonth', {
        startOfCurrentMonth,
        endOfCurrentMonth,
      })
      .groupBy('sale.customerId, customer.name, customer.nit')
      .orderBy('total_spent', 'DESC')
      .limit(5)
      .getRawMany();
    return topCustomers;
  }

  async revertSale(saleId: string) {
    await this.dataSource.transaction(async (manager) => {
      // 1. Obtener la venta y sus detalles
      const sale = await manager.findOne(Sale, { where: { id: saleId } });
      if (!sale) throw new NotFoundException(`Venta con ID ${saleId} no encontrada`);
      
      const { salesdetails } = await this.salesdetailservice.findOne(sale.id);

      // 2. Revertir los detalles de productos
      for (const detail of salesdetails) {
        const { productId, amount } = detail;
        const product = await this.productsservice.findOne(productId.id);
  
        // Incrementar stock revertido
        const newStock = product.stock + amount;
        await this.productsservice.update(
          productId.id,
          {
            ...product,
            unitmeasureId: Number(product.unitmeasureId.id),
            stock: newStock
          },
          manager
        );
  
        // Registrar ajuste de inventario negativo
        await this.inventoryproductservice.inventoryAdjustment(
          { amount: amount, inventorymoveId: 3, productId: productId.id, unitmeasureId: product.unitmeasureId.id },
          manager
        );
      }
  
      // 3. Eliminar detalles de la venta
      await manager.delete(Salesdetail, { saleId: sale.id });
  
      // 4. Eliminar el registro de venta
      await manager.delete(Sale, { id: saleId });
    });
  }
}
