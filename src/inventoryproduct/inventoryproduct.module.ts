import { Module } from '@nestjs/common';
import { InventoryproductService } from './inventoryproduct.service';
import { InventoryproductController } from './inventoryproduct.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventoryproduct } from './entities/inventoryproduct.entity';
import { InventorymovesModule } from 'src/inventorymoves/inventorymoves.module';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [InventoryproductController],
  providers: [InventoryproductService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Inventoryproduct]), InventorymovesModule,
  AuthModule],
  exports: [TypeOrmModule, InventoryproductService]
})
export class InventoryproductModule {}
