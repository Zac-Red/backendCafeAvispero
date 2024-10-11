import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { Product } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';
import { createRegister } from 'src/common/helpers/create.helper';
import { QueryParamsProductDto } from './dto/query-params-products.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { UnitmeasureService } from 'src/unitmeasure/unitmeasure.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly unitmeasureservices: UnitmeasureService,
    private readonly uuidAdapter: UuidAdapter, 
    private readonly DBErrors: HandleDBErrors,
  ){}

  async create(createProductDto: CreateProductDto) {
    const {unitmeasureId, ...productData } = createProductDto;
    const unitmeasure = await this.unitmeasureservices.findOne(String(unitmeasureId));
    try {
      return await createRegister(this.productRepository, {...productData, unitmeasureId: unitmeasure});
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async findAll(queryparamsproductDto:QueryParamsProductDto) {
    const { name, price, stock, unitmeasure, deleted = false, 
      limit=10, page=1} = queryparamsproductDto;
    
    const qb = this.productRepository.createQueryBuilder('product').leftJoinAndSelect("product.unitmeasureId", "unitmeasure")

    qb.where('product.deleted = :deleted', { deleted: deleted });
    if (name) {
      qb.andWhere(`LOWER(product.name) LIKE :name`, { name: `%${name.toLowerCase()}%` });
    }
    if (price) {
      qb.andWhere(`product.price  =:price`, { price: price });
    }
    if (stock) {
      qb.andWhere(`product.stock =:stock`, { stock: stock });
    }
    if (unitmeasure) {
      qb.andWhere(`LOWER(unitmeasure.name) LIKE :unitmeasure`, { unitmeasure: `%${unitmeasure.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit}); 
  }

  async findOne(term: string) {
    let product: Product;
    if (this.uuidAdapter.IsUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
      .where("LOWER(name) = LOWER(:name)",{
        name: term
      }).getOne();
    }
    if (!product) throw new BadRequestException(`Producto con ${term} no encontrado`);
    return product;
  }

  async update(id:string, updateProductDto: UpdateProductDto, manager?: EntityManager) {
    const {unitmeasureId, ...updateProductrestData} = updateProductDto;
    const unitmeasure = await this.unitmeasureservices.findOne(String(unitmeasureId));
    const product = await this.productRepository.preload({ id, 
      unitmeasureId: unitmeasure, ...updateProductrestData });
    if(!product) throw new NotFoundException(`Producto con id: ${id} no existe`);
    
    const repo = manager ? manager.getRepository(Product) : this.productRepository;

    try {
      return repo.save({...product});
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);    
    await this.productRepository.save({...product, deleted: true})
    return {
      message: "Producto eliminado"
    }
  }
}
