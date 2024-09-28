import { Module } from '@nestjs/common';
import { InventoryrawmaterialService } from './inventoryrawmaterial.service';
import { InventoryrawmaterialController } from './inventoryrawmaterial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventoryrawmaterial } from './entities/inventoryrawmaterial.entity';
import { InventorymovesModule } from 'src/inventorymoves/inventorymoves.module';
import { HandleDBErrors } from 'src/common/adapters';


@Module({
  controllers: [InventoryrawmaterialController],
  providers: [InventoryrawmaterialService, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Inventoryrawmaterial]), InventorymovesModule],
  exports:[TypeOrmModule, InventoryrawmaterialService]
})
export class InventoryrawmaterialModule {}
