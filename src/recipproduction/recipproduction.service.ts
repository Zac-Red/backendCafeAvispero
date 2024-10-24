import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateRecipproductionDto } from './dto/create-recipproduction.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Recipproduction } from './entities/recipproduction.entity';
import { DataSource, Repository } from 'typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { ProductsService } from 'src/products/products.service';
import { RawmaterialService } from 'src/rawmaterial/rawmaterial.service';
import { UnitmeasureService } from 'src/unitmeasure/unitmeasure.service';
import { DetailproductionService } from 'src/detailproduction/detailproduction.service';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { QueryParamsRecipProductionDto } from './dto/query-params-recipproduction.dto';

@Injectable()
export class RecipproductionService {
  constructor(
    @InjectRepository(Recipproduction)
    private readonly recipproductionRepository: Repository<Recipproduction>,
    private readonly productsservice: ProductsService,
    private readonly rawmaterialservice: RawmaterialService,
    private readonly unitmeasureservice: UnitmeasureService,
    @Inject(forwardRef(() => DetailproductionService))
    private readonly detailproductionservice: DetailproductionService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter,
  ){}

  async create(createRecipproductionDto: CreateRecipproductionDto) {
    const { productId, productiondetail, ...restdata } = createRecipproductionDto
    let recipproductioncomplet;
    await this.dataSource.transaction(async (manager) => {
      const product = await this.productsservice.findOne(productId);
      try {
        const recipproduction = manager.create(Recipproduction, { ...restdata, productId: product });
        recipproductioncomplet = await manager.save(recipproduction);
      } catch (error) {
        this.DBErrors.exceptionsDB(error);
      }

      
      if (productiondetail.length === 0)
        throw new BadRequestException(`No se recibieron los detalles de la receta`);
      for (const detail of productiondetail) {
        const { rawmaterialId, amount, unitmeasureId } = detail;
        const rawmaterial = await this.rawmaterialservice.findOne(rawmaterialId);
        const unitmeasure = await this.unitmeasureservice.findOne(String(unitmeasureId))
        await this.detailproductionservice.create(
          { rawmaterialId: rawmaterial.id, 
            amount, 
            unitmeasureId: unitmeasure.id, 
            recipproductionId: recipproductioncomplet.id },
          manager
        );
      }
    });
    return {
      recipproductioncomplet
    };
  }

  async findAll(queryparamsrecipproductionDto: QueryParamsRecipProductionDto) {
    const { limit=10, page=1, name, product } = queryparamsrecipproductionDto;
    const qb = this.recipproductionRepository.createQueryBuilder('recipproduction')
    .leftJoinAndSelect("recipproduction.productId", "product")
    .leftJoinAndSelect("product.unitmeasureId", "unitmeasure")
    .orderBy("recipproduction.id", "ASC")
    
    if (name) {
      qb.andWhere(`LOWER(recipproduction.name) LIKE :name`, { name: `%${name.toLowerCase()}%` });
    }
    if (product) {
      qb.andWhere(`LOWER(product.name) LIKE :name`, { name: `%${product.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, { page, take: limit });
  }

  async findOne(term: string) {
    let recipproduction: Recipproduction;
    if(this.uuidAdapter.IsUUID(term)){
      recipproduction = await this.recipproductionRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.recipproductionRepository.createQueryBuilder('recipproduction')
      recipproduction = await queryBuilder
      .where("LOWER(name) = LOWER(:name)", {name: term}).getOne();      
    }
    if (!recipproduction) throw new BadRequestException(`Receta con ${term} no existe`);
    return recipproduction;
  }

}
