import { Injectable } from '@nestjs/common';
import { CreateInventoryproductDto } from './dto/create-inventoryproduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Inventoryproduct } from './entities/inventoryproduct.entity';
import { InventorymovesService } from 'src/inventorymoves/inventorymoves.service';
import { HandleDBErrors } from 'src/common/adapters';
import { createRegisterForTransaction } from 'src/common/helpers/create.helper';
import { QueryParamsInventoryProductDto } from './dto/query-params-inventoryproducts.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';

@Injectable()
export class InventoryproductService {
  constructor(
    @InjectRepository(Inventoryproduct)
    private readonly inventoryproductRepository: Repository<Inventoryproduct>,
    private readonly inventorymoveservices: InventorymovesService,
    private readonly DBErrors: HandleDBErrors,
  ){}

  async inventoryAdjustment(createInventoryproductDto: CreateInventoryproductDto, manager?: EntityManager) {
    const { inventorymoveId, ...restDataInventorymove } = createInventoryproductDto;
    const inventorymove = await this.inventorymoveservices.findOne(String(inventorymoveId));
    try {
      return await createRegisterForTransaction({...restDataInventorymove, inventorymoveId: inventorymove}, manager, Inventoryproduct);
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamsinventoryproductDto: QueryParamsInventoryProductDto) {
    const {amount, limit=10, page=1, product, tipomovimiento, unitmeasure} = queryparamsinventoryproductDto;

    const qb = this.inventoryproductRepository.createQueryBuilder('invetoryproduct')
    .leftJoinAndSelect("invetoryproduct.unitmeasureId", "unitmeasure")
    .leftJoinAndSelect("invetoryproduct.productId", "product")
    .leftJoinAndSelect("invetoryproduct.inventorymoveId", "inventorymove")
    .orderBy("invetoryproduct.createdAt", "DESC")
    
    if (product) {
      qb.andWhere(`LOWER(product.name) LIKE :name`, { name: `%${product.toLowerCase()}%` });
    }
    if (amount) {
      qb.andWhere(`invetoryproduct.amount =:amount`, { amount });
    }
    if (unitmeasure) {
      qb.andWhere(`LOWER(unitmeasure.name) LIKE :unitmeasure`, { unitmeasure: `%${unitmeasure.toLowerCase()}%` });
    }
    if (tipomovimiento) {
      qb.andWhere(`LOWER(inventorymove.name) LIKE :tipomovimiento`, { tipomovimiento: `%${tipomovimiento.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit}); 
  }

}
