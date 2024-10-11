import { Injectable } from '@nestjs/common';
import { CreateInventoryproductDto } from './dto/create-inventoryproduct.dto';
import { UpdateInventoryproductDto } from './dto/update-inventoryproduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Inventoryproduct } from './entities/inventoryproduct.entity';
import { InventorymovesService } from 'src/inventorymoves/inventorymoves.service';
import { HandleDBErrors } from 'src/common/adapters';
import { createRegisterForTransaction } from 'src/common/helpers/create.helper';

@Injectable()
export class InventoryproductService {
  constructor(
    @InjectRepository(Inventoryproduct)
    private readonly inventoryproductRepository: Repository<Inventoryproduct>,
    private readonly inventorymoveservices: InventorymovesService,
    private readonly DBErrors: HandleDBErrors,
    // private readonly uuidAdapter: UuidAdapter, 
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

  findAll() {
    return `This action returns all inventoryproduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryproduct`;
  }

  update(id: number, updateInventoryproductDto: UpdateInventoryproductDto) {
    return `This action updates a #${id} inventoryproduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryproduct`;
  }
}
