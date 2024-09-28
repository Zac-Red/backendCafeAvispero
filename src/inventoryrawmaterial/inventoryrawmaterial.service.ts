import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryrawmaterialDto } from './dto/create-inventoryrawmaterial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Inventoryrawmaterial } from './entities/inventoryrawmaterial.entity';
import { InventorymovesService } from 'src/inventorymoves/inventorymoves.service';
import { createRegister, createRegisterForTransaction } from 'src/common/helpers/create.helper';
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
    // private readonly uuidAdapter: UuidAdapter, 
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
    const { amaount, moveinventory, rawmaterial, unitmeasure, deleted = false, 
      limit=10, page=1} = queryparamsinventoryrawmaterialDto;
    
    const qb = this.inventoryrawmaterialRepository.createQueryBuilder('inventoryrawmaterial')
      .leftJoinAndSelect("inventoryrawmaterial.unitmeasureId", "unitmeasure")
      .leftJoinAndSelect("inventoryrawmaterial.rawmaterialId", "rawmaterial")
      .leftJoinAndSelect("inventoryrawmaterial.inventorymoveId", "inventorymove")

    qb.where('product.deleted = :deleted', { deleted: deleted });
    if (rawmaterial) {
      qb.andWhere(`LOWER(unitmeasure.name) LIKE :rawmaterial`, { rawmaterial: `%${rawmaterial.toLowerCase()}%` });
    }
    if (moveinventory) {
      qb.andWhere(`LOWER(inventorymove.name) LIKE :moveinventory`, { moveinventory: `%${moveinventory.toLowerCase()}%` });
    }
    if (amaount) {
      qb.andWhere(`inventoryrawmaterial.amaount =:amaount`, { amaount: amaount });
    }
    if (unitmeasure) {
      qb.andWhere(`LOWER(unitmeasure.name) LIKE :unitmeasure`, { unitmeasure: `%${unitmeasure.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit}); 
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryrawmaterial`;
  }

  // update(id: number, updateInventoryrawmaterialDto: UpdateInventoryrawmaterialDto) {
  //   return `This action updates a #${id} inventoryrawmaterial`;
  // }
}
