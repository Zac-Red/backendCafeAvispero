import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitmeasureDto } from './dto/create-unitmeasure.dto';
import { UpdateUnitmeasureDto } from './dto/update-unitmeasure.dto';
import { HandleDBErrors } from 'src/common/adapters';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unitmeasure } from './entities/unitmeasure.entity';
import { createRegister } from 'src/common/helpers/create.helper';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { QueryParamsUnitmeasureDto } from './dto/query-params-unitmeasure.dto';

@Injectable()
export class UnitmeasureService {
  constructor(
    @InjectRepository(Unitmeasure)
    private readonly unitMeasureRepository: Repository<Unitmeasure>,
    private readonly DBErrors: HandleDBErrors,
  ){}
  
  async create(createUnitmeasureDto: CreateUnitmeasureDto) {
    try {  
      return await createRegister(this.unitMeasureRepository, {...createUnitmeasureDto});
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamsunitmeasureDto:QueryParamsUnitmeasureDto) {
    const {deleted=false, name, limit=10, page=1} = queryparamsunitmeasureDto;
    const qb = this.unitMeasureRepository.createQueryBuilder('unitmeasure');

    qb.where('unitmeasure.deleted = :deleted', { deleted: deleted });
    
    if (name) {
      qb.andWhere(`LOWER(unitmeasure.name) LIKE :name`, { name: `%${name.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit});    
  }

  async findOne(term: string) {
    let unitmeasure: Unitmeasure;
    let query = Number(term)    
    if (!Number.isNaN(query)) {
      unitmeasure = await this.unitMeasureRepository.findOneBy({ id: query });
    } else {
      const queryBuilder = this.unitMeasureRepository.createQueryBuilder('unitmeasure')
      unitmeasure = await queryBuilder.where("LOWER(name) = LOWER(:name)", {name: term}).getOne();      
    }
    if (!unitmeasure) throw new BadRequestException(`Usuario con ${term} no existe`);
    return unitmeasure;
  }

  async update(id: number, updateUnitmeasureDto: UpdateUnitmeasureDto) {
    const unitmeasure = await this.unitMeasureRepository.preload({ id,...updateUnitmeasureDto });
    if(!unitmeasure) throw new NotFoundException(`Unidad de medida con id: ${id} no existe`);
    try {
      await this.unitMeasureRepository.save({...unitmeasure});
      let idUnitMeasure = String(id);
      return this.findOne(idUnitMeasure)
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async remove(id: string) {
    const unitmeasure = await this.findOne(id);    
    await this.unitMeasureRepository.save({...unitmeasure, deleted: true})
    return {
      message: "Unidad de medida eliminada"
    }
  }
}
