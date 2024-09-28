import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRawmaterialDto } from './dto/create-rawmaterial.dto';
import { UpdateRawmaterialDto } from './dto/update-rawmaterial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Rawmaterial } from './entities/rawmaterial.entity';
import { UuidAdapter } from 'src/common/adapters/uui.adapter';
import { HandleDBErrors } from 'src/common/adapters';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { QueryParamsRawMaterials } from './dto/query-params.dto';
import { createRegister } from 'src/common/helpers/create.helper';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { UnitmeasureService } from 'src/unitmeasure/unitmeasure.service';

@Injectable()
export class RawmaterialService {
  constructor(
    @InjectRepository(Rawmaterial)
    private readonly rawMaterialRepository: Repository<Rawmaterial>,
    private readonly supplierservices: SuppliersService,
    private readonly unitmeasureservices: UnitmeasureService,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter,
  ) { }

  async create(createRawmaterialDto: CreateRawmaterialDto) {
    const { supplierId, unitmeasureId } = createRawmaterialDto;
    const supplier = await this.supplierservices.findOne(supplierId);
    const unitmeasure = await this.unitmeasureservices.findOne(unitmeasureId);
    try {
      return await createRegister(this.rawMaterialRepository, { ...createRawmaterialDto, supplierId: supplier, unitMeasureId: unitmeasure});
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamsrawmaterial: QueryParamsRawMaterials) {
    const { name, price, stock, unitmeasure, supplier,
      deleted = false, limit = 10, page = 1 } = queryparamsrawmaterial;

    const qb = this.rawMaterialRepository.createQueryBuilder('rawmaterial')
    .leftJoinAndSelect("rawmaterial.unitmeasureId", "unitmeasure")
    .leftJoinAndSelect("rawmaterial.supplierId", "supplier")

    qb.where('rawmaterial.deleted = :deleted', { deleted: deleted });
    
    if (name) {
      qb.andWhere(`LOWER(user.name) LIKE :name`, { name: `%${name.toLowerCase()}%` });
    }
    if (unitmeasure) {
      qb.andWhere(`LOWER(unitmeasure.name) LIKE :name`, { name: `%${unitmeasure.toLowerCase()}%` });
    }

    if (supplier) {
      qb.andWhere(`LOWER(supplier.namecontact) LIKE :name`, { name: `%${supplier.toLowerCase()}%` });
    }

    return await getAllPaginated(qb, { page, take: limit });
  }

  async findOne(term: string) {
    let rawmaterial: Rawmaterial;
    if (this.uuidAdapter.IsUUID(term)) {
      rawmaterial = await this.rawMaterialRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.rawMaterialRepository.createQueryBuilder('rawmaetrial')
      rawmaterial = await queryBuilder.where("LOWER(name) = LOWER(:name)", { name: term }).getOne();
    }
    if (!rawmaterial) throw new BadRequestException(`Materia prima con termino ${term} no existe`);
    return rawmaterial;
  }

  async update(id: string, updateRawmaterialDto: UpdateRawmaterialDto, manager?: EntityManager) {
    const { supplierId, unitmeasureId, ...restDataRawmaterial } = updateRawmaterialDto;
    const supplier = await this.supplierservices.findOne(supplierId);
    const unitmeasure = await this.unitmeasureservices.findOne(unitmeasureId);

    const rawmaterial = await this.rawMaterialRepository.preload({ id, 
      supplierId: supplier, unitmeasureId: unitmeasure,  ...restDataRawmaterial });
    if(!rawmaterial) throw new NotFoundException(`Materia prima con id: ${id} no existe`);
    
    const repo = manager ? manager.getRepository(Rawmaterial) : this.rawMaterialRepository;
    try {
      return repo.save({...rawmaterial});
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async remove(id: string) {
    const rawmaterial = await this.findOne(id);    
    await this.rawMaterialRepository.save({...rawmaterial, deleted: true})
    return {
      message: "Materia prima eliminada"
    }
  }
}
