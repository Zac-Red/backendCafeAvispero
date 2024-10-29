import { Module } from '@nestjs/common';
import { RefinerawmaterialService } from './refinerawmaterial.service';
import { RefinerawmaterialController } from './refinerawmaterial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refinerawmaterial } from './entities/refinerawmaterial.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { RawmaterialModule } from 'src/rawmaterial/rawmaterial.module';
import { Conversionrawmaterial } from './entities/conversionrawmaterial.entity';
import { UnitmeasureModule } from 'src/unitmeasure/unitmeasure.module';
import { InventoryrawmaterialModule } from 'src/inventoryrawmaterial/inventoryrawmaterial.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RefinerawmaterialController],
  providers: [RefinerawmaterialService, HandleDBErrors, UuidAdapter],
  imports:[TypeOrmModule.forFeature([Refinerawmaterial, Conversionrawmaterial]), 
  RawmaterialModule, UnitmeasureModule, InventoryrawmaterialModule, AuthModule],
  exports:[TypeOrmModule]
})
export class RefinerawmaterialModule {}
