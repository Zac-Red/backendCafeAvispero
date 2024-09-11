import { Departament } from './entities/departament.entity';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { UpdateDepartamentDto } from './dto/update-departament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as IsUUID } from 'uuid';

@Injectable()
export class DepartamentsService {
  constructor(
    @InjectRepository(Departament)
    private readonly departamentRepository: Repository<Departament>, 
  ){}

  async create(createDepartamentDto: CreateDepartamentDto) {
    try {
      const { name } = createDepartamentDto;
      const departament = this.departamentRepository.create({name});
      await this.departamentRepository.save(departament);
      return { name };
    } catch (error) {
      throw new BadRequestException(error);  
    }
  }

  async findAll() {
    const departamentos = await this.departamentRepository.find({
      where:{ deleted: false }});
    return departamentos;
  }

  async findOne(term:string) {
    let departament: Departament;
    if( IsUUID(term) ){
      departament = await this.departamentRepository.findOneBy({id: term, deleted: false});
    } else {
      const queryBuilder = this.departamentRepository.createQueryBuilder('departament')
      departament = await queryBuilder
        .where("LOWER(name) = LOWER(:name) and deleted = :deleted", {name: term, deleted: false})
        .getOne()
    }
    if(!departament)
      throw new NotFoundException(`Departament with ${term} not found`);
    return departament;
  }

  async update(id: string, updateDepartamentDto: UpdateDepartamentDto) {
    const { name } = updateDepartamentDto;
    const departament = await this.findOne(id);    
    try {
      await this.departamentRepository.save({...departament, name});
      return this.findOne(id)
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    const departament = await this.findOne(id);    
    await this.departamentRepository.save({...departament, deleted: true})
    return;
  }
}
