import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Shopping } from './entities/shopping.entity';
import { DataSource, Repository } from 'typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { RawmaterialService } from 'src/rawmaterial/rawmaterial.service';
import { ShoppingdetailService } from 'src/shoppingdetail/shoppingdetail.service';
import { InventoryrawmaterialService } from 'src/inventoryrawmaterial/inventoryrawmaterial.service';
import { QueryParamsShoppingDto } from './dto/query-params-shopping.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { ShoppingDetail } from 'src/shoppingdetail/entities/shoppingdetail.entity';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(Shopping)
    private readonly shoppingRepository: Repository<Shopping>,
    private readonly shoppingdetailservice: ShoppingdetailService,
    private readonly supplierservices: SuppliersService,
    private readonly rawmaterialservices: RawmaterialService,
    private readonly inventoryrawmaterialservice: InventoryrawmaterialService,
    @InjectDataSource() 
    private readonly dataSource: DataSource,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter, 
  ){}

  
  async create(createShoppingDto: CreateShoppingDto) {
    const { shoppingdetail, supplierId, ...restDataShopping } = createShoppingDto;
    let shoppingComplet;
    await this.dataSource.transaction(async (manager) => {
      try {
        const supplier = await this.supplierservices.findOne(supplierId);        
        const shopping = manager.create(Shopping, {...restDataShopping, supplierId: supplier});
        shoppingComplet = await manager.save(shopping);
      } catch (error) {
        this.DBErrors.exceptionsDB(error);
      }

      if (shoppingdetail.length === 0) 
        throw new BadRequestException(`No se recibieron los detalles de la compra`);

      for (const detail of shoppingdetail) {
        const { rawmaterialId, amount, price, subtotal } = detail;
        const rawmaterial = await this.rawmaterialservices.findOne(rawmaterialId);

        await this.shoppingdetailservice.create(
          { rawmaterialId, amount, price, subtotal, unitmeasureId: rawmaterial.unitmeasureId.id, shoppingId: shoppingComplet.id }, 
          manager 
        );
        
        const { stock,...restDatarawmaterial} = rawmaterial;
        await this.rawmaterialservices.update(
          restDatarawmaterial.id, 
          { ...restDatarawmaterial, 
            supplierId: restDatarawmaterial.supplierId.id, 
            unitmeasureId: Number(restDatarawmaterial.unitmeasureId.id), 
            stock: stock + amount }, 
          manager
        );

        await this.inventoryrawmaterialservice.inventoryAdjustment(
          { amount, inventorymoveId: 2, rawmaterialId, unitmeasureId: rawmaterial.unitmeasureId.id }, 
          manager
        );
      }
    });
    return{
      shoppingComplet
    }
  }

  async findAll(queryparamsshoppingDto :QueryParamsShoppingDto) {
    const { suppliername, total, commercialdocument, limit = 10, page = 1 } = queryparamsshoppingDto;

    const qb = this.shoppingRepository.createQueryBuilder('shopings')
    .leftJoinAndSelect("shopings.supplierId", "supplier")
    .orderBy("shopings.createdAt", "DESC")
    
    if (suppliername) {
      qb.andWhere(`LOWER(supplier.namecontact) LIKE :name`, { name: `%${suppliername.toLowerCase()}%` });
    }
    if (commercialdocument) {
      qb.andWhere(`shopings.commercialdocument LIKE :commercialdocument`, { commercialdocument: `${commercialdocument}` });
    }
    if (total) {
      qb.andWhere(`shopings.total =:total`, { total });
    }
    return await getAllPaginated(qb, { page, take: limit });
  }

  async findOne(term: string) {
    let shopping: Shopping;
    if(this.uuidAdapter.IsUUID(term)){
      shopping = await this.shoppingRepository.findOneBy({ id: term });
    }
    if (!shopping) throw new BadRequestException(`La compra con id ${term} no existe`);
    return shopping;
  }

  async revertShopping(shoppingId: string) {
    await this.dataSource.transaction(async (manager) => {
      // 1. Obtener la compra y sus detalles
      const shopping = await manager.findOne(Shopping, { where: { id: shoppingId }});
      if (!shopping) throw new NotFoundException(`Compra con ID ${shoppingId} no encontrada`);
      
      const { shoppingdetails } = await this.shoppingdetailservice.findOne(shopping.id)
      // 2. Revertir los detalles de materias primas
      for (const detail of shoppingdetails) {
        const { rawmaterialId, amount } = detail;
        const rawmaterial = await this.rawmaterialservices.findOne(rawmaterialId.id);
  
        // Reducir el stock revertido
        const newStock = rawmaterial.stock - amount;
        await this.rawmaterialservices.update(
          rawmaterialId.id,
          {
            ...rawmaterial,
            supplierId: rawmaterial.supplierId.id,
            unitmeasureId: Number(rawmaterial.unitmeasureId.id),
            stock: newStock
          },
          manager
        );
  
        // Registrar ajuste de inventario negativo
        await this.inventoryrawmaterialservice.inventoryAdjustment(
          { amount: amount, inventorymoveId: 1, rawmaterialId: rawmaterialId.id, unitmeasureId: rawmaterial.unitmeasureId.id },
          manager
        );
      }
  
      // 3. Eliminar detalles de la compra
      await manager.delete(ShoppingDetail, { shoppingId: shopping.id });
  
      // 4. Eliminar el registro de compra
      await manager.delete(Shopping, { id: shoppingId });
    });
  }
}
