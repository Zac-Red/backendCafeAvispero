import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShoppingdetailDto } from './dto/create-shoppingdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingDetail } from './entities/shoppingdetail.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { createRegisterForTransaction } from 'src/common/helpers/create.helper';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ShoppingdetailService {
  constructor(
    @InjectRepository(ShoppingDetail)
    private readonly shoppingdetailRepository: Repository<ShoppingDetail>,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter, 
  ){}

  async create(createShoppingdetailDto: CreateShoppingdetailDto, manager?: EntityManager) {
    try {
      return await createRegisterForTransaction({...createShoppingdetailDto}, manager, ShoppingDetail);
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findOne(term: string) {
    let shoppingdetails: ShoppingDetail[];
    if(this.uuidAdapter.IsUUID(term)){
      const queryBuilder = this.shoppingdetailRepository.createQueryBuilder('shoppingdetail')
      .leftJoinAndSelect("shoppingdetail.shoppingId", "shopping")
      .leftJoinAndSelect("shoppingdetail.rawmaterialId", "rawmaterial")
      .leftJoinAndSelect("rawmaterial.unitmeasureId", "unitmeasure")
      shoppingdetails = await queryBuilder.where("shopping.id =:shoppingId", {shoppingId: term}).getMany();    
    }
    if (!shoppingdetails) throw new BadRequestException(`No existe detalles con el ID de compra  ${term}`);
    return {shoppingdetails};
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingdetail`;
  }
}
