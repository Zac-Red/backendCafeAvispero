import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { createRegister } from 'src/common/helpers/create.helper';
import { QueryParamsCustomers } from './dto/query-params-customers.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly uuidAdapter: UuidAdapter, 
    private readonly DBErrors: HandleDBErrors,
  ){}

  async create(createCustomerDto: CreateCustomerDto) {
    try {  
      return await createRegister(this.customerRepository, createCustomerDto);
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamscustomers: QueryParamsCustomers) {
    const {limit = 10, page = 1, deleted = false, name, nit, phone} = queryparamscustomers;
    
    const qb = this.customerRepository.createQueryBuilder('customers')
    
    qb.where('customers.deleted = :deleted', { deleted: deleted });
    if (name) {
      qb.andWhere(`LOWER(customers.name) LIKE :name`, { name: `%${name.toLowerCase()}%` });
    }
    if (nit) {
      qb.andWhere(`customers.nit LIKE :nit`, { nit });
    }
    if (phone) {
      qb.andWhere(`customers.phone =:phone`, { phone: phone });
    }
    return await getAllPaginated(qb, {page, take: limit});  
  }

  async findOne(term: string) {
    let customer: Customer;
    if (this.uuidAdapter.IsUUID(term)) {
      customer = await this.customerRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.customerRepository.createQueryBuilder('costumers');
      customer = await queryBuilder
      .where("nit = :nit or LOWER(name) = LOWER(:name)",{
        nit: term,
        name: term
      }).getOne();
    }
    if (!customer) throw new BadRequestException(`Cliente con ${term} no encontrado`);
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.preload({ id,...updateCustomerDto });
    if(!customer) throw new NotFoundException(`Customer con id ${id} no encontrado`);
    try {
      await this.customerRepository.save({...customer});
      return this.findOne(id)
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await this.customerRepository.save({...customer, deleted: true})
    return {
      message: "Cliente eliminado"
    }
  }
}
