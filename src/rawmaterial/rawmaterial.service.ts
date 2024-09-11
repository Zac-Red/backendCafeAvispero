import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRawmaterialDto } from './dto/create-rawmaterial.dto';
import { UpdateRawmaterialDto } from './dto/update-rawmaterial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rawmaterial } from './entities/rawmaterial.entity';
import { UuidAdapter } from 'src/common/adapters/uui.adapter';
import { HandleDBErrors } from 'src/common/adapters';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { getPaginatedItems } from 'src/common/helpers/find.helpers';
import { QueryParamsRawMaterials } from './dto/query-params.dto';
import { createRegister } from 'src/common/helpers/create.helper';

@Injectable()
export class RawmaterialService {
  constructor(
    @InjectRepository(Rawmaterial)
    private readonly rawMaterialRepository: Repository<Rawmaterial>,

    @InjectRepository(Supplier)
    private readonly SupplierRepository: Repository<Supplier>,

    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter,
  ){}

  async create(createRawmaterialDto: CreateRawmaterialDto) {
    const { supplierId } = createRawmaterialDto;
    const supplier = await this.SupplierRepository.findOneBy({id: supplierId, deleted: false});
    if (!supplier) throw new BadRequestException(`Suplier with ${supplierId} not found`);
    try {  
      return await createRegister(this.rawMaterialRepository, {...createRawmaterialDto, supplierId:supplier});
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamsrawmaterial: QueryParamsRawMaterials) {
    const { name, price, stock, unitMeasure, 
            deleted = false, limit = 10, page = 1} = queryparamsrawmaterial;
    let where = {deleted};
    
    if (name) {
      where['name'] = name;
    }
    if (price) {
      where['price'] = price;
    } 
    if (stock) {
      where['stock'] = stock;
    }
    if (unitMeasure) {
      where['unitMeasure'] = unitMeasure;
    }
    
    return await getPaginatedItems(this.rawMaterialRepository, {limit, page}, where )
  }

  findOne(id: string) {
    return `This action returns a #${id} rawmaterial`;
  }

  update(id: string, updateRawmaterialDto: UpdateRawmaterialDto) {
    return `This action updates a #${id} rawmaterial`;
  }

  async remove(id: string) {
    return `This action removes a #${id} rawmaterial`;
  }
}
