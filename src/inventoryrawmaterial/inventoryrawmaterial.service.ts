import { Injectable } from '@nestjs/common';
import { CreateInventoryrawmaterialDto } from './dto/create-inventoryrawmaterial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Inventoryrawmaterial } from './entities/inventoryrawmaterial.entity';
import { InventorymovesService } from 'src/inventorymoves/inventorymoves.service';
import { createRegisterForTransaction } from 'src/common/helpers/create.helper';
import { HandleDBErrors } from 'src/common/adapters';
import { QueryParamsInventoryRawMaterialDto } from './dto/query-params-inventoryrawmaterial.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';

@Injectable()
export class InventoryrawmaterialService {
  constructor(
    @InjectRepository(Inventoryrawmaterial)
    private readonly inventoryrawmaterialRepository: Repository<Inventoryrawmaterial>,
    private readonly inventorymoveservices: InventorymovesService,
    private readonly DBErrors: HandleDBErrors,
  ){}

  async inventoryAdjustment(createinventoryrawmaterialDto: CreateInventoryrawmaterialDto, manager?: EntityManager) {
    const { inventorymoveId, ...restDataInventorymove } = createinventoryrawmaterialDto;
    const inventorymove = await this.inventorymoveservices.findOne(String(inventorymoveId));
    try {
      return await createRegisterForTransaction({...restDataInventorymove, inventorymoveId: inventorymove}, manager, Inventoryrawmaterial);
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamsinventoryrawmaterialDto: QueryParamsInventoryRawMaterialDto) {
    const { amount, moveinventory, rawmaterial, unitmeasure, limit=10, page=1} = queryparamsinventoryrawmaterialDto;
    
    const qb = this.inventoryrawmaterialRepository.createQueryBuilder('inventoryrawmaterial')
      .leftJoinAndSelect("inventoryrawmaterial.unitmeasureId", "unitmeasure")
      .leftJoinAndSelect("inventoryrawmaterial.rawmaterialId", "rawmaterial")
      .leftJoinAndSelect("inventoryrawmaterial.inventorymoveId", "inventorymove")
      .orderBy("inventoryrawmaterial.createdAt", "DESC")
    
    if (amount) {
      qb.andWhere(`inventoryrawmaterial.amount =:amount`, { amount });
    }
    if (unitmeasure) {
      qb.andWhere(`LOWER(unitmeasure.name) LIKE :unitmeasure`, { unitmeasure: `%${unitmeasure.toLowerCase()}%` });
    }
    if (moveinventory) {
      qb.andWhere(`LOWER(inventorymove.name) LIKE :moveinventory`, { moveinventory: `%${moveinventory.toLowerCase()}%` });
    }
    if (rawmaterial) {      
      qb.andWhere(`LOWER(rawmaterial.name) LIKE :rawmaterial`, { rawmaterial: `%${rawmaterial.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit}); 
  }

}
