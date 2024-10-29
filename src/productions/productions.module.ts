import { Module } from '@nestjs/common';
import { ProductionsService } from './productions.service';
import { ProductionsController } from './productions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production } from './entities/production.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { ProductsModule } from 'src/products/products.module';
import { RawmaterialModule } from 'src/rawmaterial/rawmaterial.module';
import { DetailproductionModule } from 'src/detailproduction/detailproduction.module';
import { InventoryrawmaterialModule } from 'src/inventoryrawmaterial/inventoryrawmaterial.module';
import { InventoryproductModule } from 'src/inventoryproduct/inventoryproduct.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductionsController],
  providers: [ProductionsService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Production]), ProductsModule, 
  RawmaterialModule, DetailproductionModule, InventoryrawmaterialModule,
  InventoryproductModule, AuthModule],
  exports: [TypeOrmModule]
})
export class ProductionsModule {}
