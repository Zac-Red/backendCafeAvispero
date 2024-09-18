import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';

import { QueryParamsSupplierDto } from './dto/query-params.dto';
import { UuidAdapter } from 'src/common/adapters/uui.adapter';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { HandleDBErrors } from 'src/common/adapters';
import { createRegister } from 'src/common/helpers/create.helper';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    private readonly uuidAdapter: UuidAdapter,
    private readonly DBErrors: HandleDBErrors,
  ){}

  async create(createSupplierDto: CreateSupplierDto) {
    try {
      return await createRegister(this.suppliersRepository, createSupplierDto);
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async findAll(queryparamssupplierDto: QueryParamsSupplierDto ) {
    const {namecontact, personeria, deleted = false, limit=10, page=1} = queryparamssupplierDto;
    
    const qb = this.suppliersRepository.createQueryBuilder('supplier');

    qb.where('supplier.deleted = :deleted', { deleted: deleted });
    if (namecontact) {
      qb.andWhere(`LOWER(supplier.namecontact) LIKE :namecontact`, { namecontact: `%${namecontact.toLowerCase()}%` });
    }
    if (personeria) {
      qb.andWhere(`LOWER(supplier.personeria) LIKE :personeria`, { personeria: `%${personeria.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit}); 
  }

  async findOne(term: string) {
    let supplier: Supplier;
    if(this.uuidAdapter.IsUUID(term)){
      supplier = await this.suppliersRepository.findOneBy({ id: term, deleted: false });
    } else {
      const queryBuilder = this.suppliersRepository.createQueryBuilder('supl')
      supplier = await queryBuilder
      .where("LOWER(personeria) = LOWER(:personeria) and deleted =:deleted or LOWER(namecontact) = LOWER(:namecontact) and deleted =:deleted", {
        personeria: term,
        namecontact: term,
        deleted: false
      })
      .getOne();      
    }
    if (!supplier) throw new BadRequestException(`El proveedor con ${term} no encontrado`);
    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.suppliersRepository.preload({ id, ...updateSupplierDto });
    if(!supplier) throw new NotFoundException(`El proveedor con el id: ${id} no encontrado`);
    try {
      await this.suppliersRepository.save({...supplier});
      return this.findOne(id)
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async remove(id: string) {
    const supplier = await this.findOne(id);
    await this.suppliersRepository.save({...supplier, deleted: true})
    return{
      message: "Proveedor eliminado"
    };
  }
}
