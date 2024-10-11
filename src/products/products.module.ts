import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UnitmeasureModule } from 'src/unitmeasure/unitmeasure.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, UuidAdapter, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Product]), UnitmeasureModule],
  exports:[TypeOrmModule, ProductsService]
})
export class ProductsModule {}
