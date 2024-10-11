import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateShoppingdetailDto } from './dto/create-shoppingdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingDetail } from './entities/shoppingdetail.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { createRegisterForTransaction } from 'src/common/helpers/create.helper';
import { EntityManager, Repository } from 'typeorm';
import { ShoppingService } from 'src/shopping/shopping.service';
import { Shopping } from 'src/shopping/entities/shopping.entity';

@Injectable()
export class ShoppingdetailService {
  constructor(
    @InjectRepository(ShoppingDetail)
    private readonly shoppingdetailRepository: Repository<ShoppingDetail>,
    @Inject(forwardRef(() => ShoppingService))
    private readonly shoppingservice: ShoppingService,
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
    let shopping: Shopping;
    if(this.uuidAdapter.IsUUID(term)){
      shopping = await this.shoppingservice.findOne(term);
      const queryBuilder = this.shoppingdetailRepository.createQueryBuilder('shoppingdetail')
      .leftJoinAndSelect("shoppingdetail.rawmaterialId", "rawmaterial")
      .leftJoinAndSelect("rawmaterial.unitmeasureId", "unitmeasure")
      shoppingdetails = await queryBuilder.where("shoppingdetail.shoppingId =:shoppingId", {shoppingId: term}).getMany();    
    }
    if (!shoppingdetails) throw new BadRequestException(`No existe detalles con el ID de compra  ${term}`);
    return {shopping, shoppingdetails};
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingdetail`;
  }
}
