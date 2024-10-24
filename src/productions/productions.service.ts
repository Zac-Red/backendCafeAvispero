import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';
import { Production } from './entities/production.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { ProductsService } from 'src/products/products.service';
import { RawmaterialService } from 'src/rawmaterial/rawmaterial.service';
import { DetailproductionService } from 'src/detailproduction/detailproduction.service';
import { InventoryproductService } from 'src/inventoryproduct/inventoryproduct.service';
import { InventoryrawmaterialService } from 'src/inventoryrawmaterial/inventoryrawmaterial.service';
import { QueryParamsProductionsDto, QueryParamsReportTopProductsProductionsDto } from './dto/query-params-productions.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';

@Injectable()
export class ProductionsService {
  constructor(
    @InjectRepository(Production)
    private readonly productionRepository: Repository<Production>,
    private readonly productsservices: ProductsService,
    private readonly rawmaterialservice: RawmaterialService,
    private readonly detailproductionservice: DetailproductionService,
    private readonly inventoryproductservice: InventoryproductService,
    private readonly inventoryrawmaterialservice: InventoryrawmaterialService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter,
  ) { }

  async create(createProductionDto: CreateProductionDto) {
    const { amount, recipproductionId } = createProductionDto;
    let productionComplet;
    await this.dataSource.transaction(async (manager) => {
      const { detailsproduction, recipproduction } = await this.detailproductionservice.findOne(recipproductionId);
      try {
        const production = manager.create(Production, { amount, recipproductionId: recipproduction });
        productionComplet = await manager.save(production);
      } catch (error) {
        this.DBErrors.exceptionsDB(error);
      }

      if (detailsproduction.length === 0)
        throw new BadRequestException(`No se recibieron los detalles de la receta`);

      for (const detail of detailsproduction) {
        const { rawmaterialId, amount, unitmeasureId } = detail;
        const rawmaterial = await this.rawmaterialservice.findOne(rawmaterialId.id);
        if (rawmaterial.stock === 0)
          throw new BadRequestException(`${rawmaterial.name} no tiene stock suficiente`);

        let rawstockconversion = rawmaterial.stock * rawmaterial.unitmeasureId.conversionfactor;
        let quantityconversion = amount * productionComplet.amount * unitmeasureId.conversionfactor;
        if (rawstockconversion < quantityconversion)
          throw new BadRequestException(`${rawmaterial.name} no tiene stock suficiente`);

        let rawmastock = rawstockconversion - quantityconversion;
        let rawrealstock = rawmastock / rawmaterial.unitmeasureId.conversionfactor;
        let quantityreal = quantityconversion / rawmaterial.unitmeasureId.conversionfactor;
        await this.rawmaterialservice.update(rawmaterialId.id, {
          stock: rawrealstock,
          supplierId: rawmaterial.supplierId.id,
          unitmeasureId: rawmaterial.unitmeasureId.id
        },
          manager
        );

        await this.inventoryrawmaterialservice.inventoryAdjustment(
          { amount: quantityconversion, inventorymoveId: 1, rawmaterialId: rawmaterial.id, unitmeasureId: unitmeasureId.id },
          manager
        );

      }
      await this.productsservices.update(
        recipproduction.productId.id,
        {
          unitmeasureId: Number(recipproduction.productId.unitmeasureId.id),
          stock: recipproduction.productId.stock + amount
        },
        manager
      );
      await this.inventoryproductservice.inventoryAdjustment(
        { amount, inventorymoveId: 2, productId: recipproduction.productId.id, unitmeasureId: recipproduction.productId.unitmeasureId.id },
        manager
      )
    });
    return {
      productionComplet
    };
  }

  async findAll(queryparamsproductionsDto: QueryParamsProductionsDto) {
    const { name, product, limit = 10, page = 1 } = queryparamsproductionsDto;

    const qb = this.productionRepository.createQueryBuilder('production')
      .leftJoinAndSelect("production.recipproductionId", "recipproduction")
      .leftJoinAndSelect("recipproduction.productId", "productrecip")
      .orderBy("production.createdAt", "DESC")
    
    if (name) {
      qb.andWhere(`LOWER(recipproduction.name) LIKE :name`, { name: `%${name.toLowerCase()}%` });
    }
    if (product) {
      qb.andWhere(`LOWER(productrecip.name) LIKE :product`, { product: `%${product.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, { page, take: limit });
  }

  async findTopProductProduction(queryparamsreporttopproductsproductionsDto: QueryParamsReportTopProductsProductionsDto) {
    const { startOfCurrentMonth, endOfCurrentMonth } = queryparamsreporttopproductsproductionsDto;

    const topProducts = await this.dataSource
      .getRepository(Production)
      .createQueryBuilder('production')
      .leftJoinAndSelect('production.recipproductionId', 'recipproduction')
      .leftJoinAndSelect('recipproduction.productId', 'product')
      .select('product.id', 'productId')
      .addSelect('recipproduction.name', 'recipproduction_name') 
      .addSelect('product.name', 'product_name') 
      .addSelect('product.url', 'url') 
      .addSelect('SUM(production.amount)', 'total_amount')
      .where('DATE(production.createdAt) BETWEEN :start AND :end', { start: startOfCurrentMonth, end: endOfCurrentMonth })
      .groupBy('product.id, recipproduction.name, product.name, product.url')
      .orderBy('total_amount', 'DESC')
      .limit(5)
      .getRawMany();
    return topProducts;
  }

  findOne(id: number) {
    return `This action returns a #${id} production`;
  }

  update(id: number, updateProductionDto: UpdateProductionDto) {
    return `This action updates a #${id} production`;
  }

  remove(id: number) {
    return `This action removes a #${id} production`;
  }
}
