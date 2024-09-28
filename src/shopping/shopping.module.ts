import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shopping } from './entities/shopping.entity';
import { InventoryrawmaterialModule } from 'src/inventoryrawmaterial/inventoryrawmaterial.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { RawmaterialModule } from 'src/rawmaterial/rawmaterial.module';
import { ShoppingdetailModule } from 'src/shoppingdetail/shoppingdetail.module';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Shopping]), InventoryrawmaterialModule, 
  SuppliersModule, RawmaterialModule, ShoppingdetailModule],
  exports: [TypeOrmModule]
})
export class ShoppingModule {}
