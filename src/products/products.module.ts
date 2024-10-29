import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UnitmeasureModule } from 'src/unitmeasure/unitmeasure.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, UuidAdapter, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Product]), UnitmeasureModule, AuthModule],
  exports:[TypeOrmModule, ProductsService]
})
export class ProductsModule {}
