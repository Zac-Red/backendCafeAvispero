import { Module, forwardRef } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SalesdetailModule } from 'src/salesdetail/salesdetail.module';
import { CustomersModule } from 'src/customers/customers.module';
import { ProductsModule } from 'src/products/products.module';
import { InventoryproductModule } from 'src/inventoryproduct/inventoryproduct.module';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SalesController],
  providers: [SalesService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Sale]), forwardRef(() =>SalesdetailModule), 
  CustomersModule, ProductsModule, InventoryproductModule, AuthModule],
  exports: [TypeOrmModule, SalesService]
})
export class SalesModule {}
