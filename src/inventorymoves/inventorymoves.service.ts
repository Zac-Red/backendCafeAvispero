import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventorymoveDto } from './dto/create-inventorymove.dto';
import { UpdateInventorymoveDto } from './dto/update-inventorymove.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventorymove } from './entities/inventorymove.entity';
import { Repository } from 'typeorm';
import { HandleDBErrors } from 'src/common/adapters';
import { createRegister } from 'src/common/helpers/create.helper';
import { QueryParamsInventoryMoveDto } from './dto/query-params-inventorymove.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';

@Injectable()
export class InventorymovesService {
  constructor(
    @InjectRepository(Inventorymove)
    private readonly inventoryMoveRepository: Repository<Inventorymove>,
    private readonly DBErrors: HandleDBErrors,
  ){}

  async create(createInventorymoveDto: CreateInventorymoveDto) {
    try {  
      return await createRegister(this.inventoryMoveRepository, {...createInventorymoveDto});
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamsinventorymoveDto: QueryParamsInventoryMoveDto) {
    const { name, limit=10, page=1, deleted = false } = queryparamsinventorymoveDto;
    const qb = this.inventoryMoveRepository.createQueryBuilder('inventorymove');
    qb.where('inventorymove.deleted = :deleted', { deleted: deleted });
    if (name) {
      qb.andWhere(`LOWER(inventorymove.name) LIKE :name`, { name: `%${name.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit}); 
  }

  async findOne(term: string) {
    let inventorymove: Inventorymove;
    let query = Number(term)
    if (!Number.isNaN(query)) {
      inventorymove = await this.inventoryMoveRepository.findOneBy({ id: query });
    } else {
      const queryBuilder = this.inventoryMoveRepository.createQueryBuilder('inventorymove')
      inventorymove = await queryBuilder.where(`LOWER(inventorymove.name) LIKE :name`, { name: `%${term.toLowerCase()}%` }).getOne();      
    }
    if (!inventorymove) throw new BadRequestException(`movimiento con ${term} no existe`);
    return inventorymove;
  }

  async update(id: number, updateInventorymoveDto: UpdateInventorymoveDto) {
    const inventorymove = await this.inventoryMoveRepository.preload({ id,...updateInventorymoveDto });
    if(!inventorymove) throw new NotFoundException(`movimiento de inventario con id: ${id} no existe`);
    try {
      await this.inventoryMoveRepository.save({...inventorymove});
      let idInventoryMove = String(id);
      return this.findOne(idInventoryMove)
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async remove(id: string) {
    const inventorymove = await this.findOne(id);
    await this.inventoryMoveRepository.save({...inventorymove, deleted: true})
    return {
      message: "movimiento de inventario eliminado"
    }
  }
}
