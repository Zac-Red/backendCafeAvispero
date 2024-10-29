import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateDetailproductionDto } from './dto/create-detailproduction.dto';
import { UpdateDetailproductionDto } from './dto/update-detailproduction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Detailproduction } from './entities/detailproduction.entity';
import { RecipproductionService } from 'src/recipproduction/recipproduction.service';
import { createRegisterForTransaction } from 'src/common/helpers/create.helper';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { Recipproduction } from 'src/recipproduction/entities/recipproduction.entity';

@Injectable()
export class DetailproductionService {
  constructor(
    @InjectRepository(Detailproduction)
    private readonly detailproductionRepository: Repository<Detailproduction>,
    @Inject(forwardRef(() => RecipproductionService))
    private readonly recipproductionservice: RecipproductionService,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter,
  ){}

  async create(createDetailproductionDto: CreateDetailproductionDto, manager?: EntityManager) {
    try {
      return await createRegisterForTransaction({...createDetailproductionDto}, manager, Detailproduction);
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findOne(term: string) {
    let detailsproduction: Detailproduction[];
    let recipproduction: Recipproduction;

    if(this.uuidAdapter.IsUUID(term)){
      recipproduction = await this.recipproductionservice.findOne(term);
      const queryBuilder = this.detailproductionRepository.createQueryBuilder('productiondetail')
      .leftJoinAndSelect("productiondetail.unitmeasureId", "unitmeasureproduction")
      .leftJoinAndSelect("productiondetail.rawmaterialId", "rawmaterial")
      .leftJoinAndSelect("rawmaterial.unitmeasureId", "unitmeasureraw")
      detailsproduction = await queryBuilder.where("productiondetail.recipproductionId =:recipproductionId", {recipproductionId: term}).getMany();  
    } else {
      recipproduction = await this.recipproductionservice.findOne(term);
      const queryBuilderdetails = this.detailproductionRepository.createQueryBuilder('productiondetail')
      .leftJoinAndSelect("productiondetail.recipproductionId", "recipproduction")
      .leftJoinAndSelect("productiondetail.unitmeasureId", "unitmeasureproduction")
      .leftJoinAndSelect("productiondetail.rawmaterialId", "rawmaterial")
      .leftJoinAndSelect("rawmaterial.unitmeasureId", "unitmeasureraw")
      
      detailsproduction = await queryBuilderdetails.where("recipproduction.name =:recipproduction", {recipproduction: term}).getMany();  
    }
    if (!recipproduction) throw new BadRequestException(`Detalles de la recta ${term} no existe`);
    return {
      recipproduction,
      detailsproduction,
    };
  }
}
