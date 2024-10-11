import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateSalesdetailDto } from './dto/create-salesdetail.dto';
import { UpdateSalesdetailDto } from './dto/update-salesdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Salesdetail } from './entities/salesdetail.entity';
import { EntityManager, Repository } from 'typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { createRegisterForTransaction } from 'src/common/helpers/create.helper';
import { SalesService } from 'src/sales/sales.service';
import { Sale } from 'src/sales/entities/sale.entity';

@Injectable()
export class SalesdetailService {
  constructor(
    @InjectRepository(Salesdetail)
    private readonly salesdetailRepository: Repository<Salesdetail>,
    @Inject(forwardRef(() => SalesService))
    private readonly saleservice: SalesService,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter, 
  ){}

  async create(createSalesdetailDto: CreateSalesdetailDto, manager?: EntityManager) {
    try {
      return await createRegisterForTransaction({...createSalesdetailDto}, manager, Salesdetail);
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findOne(id: string) {
    let salesdetails: Salesdetail[];
    let sale: Sale;
    if(this.uuidAdapter.IsUUID(id)){
      sale = await this.saleservice.findOne(id);
      const queryBuilder = this.salesdetailRepository.createQueryBuilder('salesdetail')
      .leftJoinAndSelect("salesdetail.productId", "product")
      .leftJoinAndSelect("product.unitmeasureId", "unitmeasure")
      salesdetails = await queryBuilder.where("salesdetail.saleId =:saleId", {saleId: id}).getMany();    
    }
    if (!salesdetails) throw new BadRequestException(`No existe detalles con el ID de venta  ${id}`);
    return {sale, salesdetails};
  }

  update(id: number, updateSalesdetailDto: UpdateSalesdetailDto) {
    return `This action updates a #${id} salesdetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesdetail`;
  }
}
