import { Module } from '@nestjs/common';
import { ShoppingdetailService } from './shoppingdetail.service';
import { ShoppingdetailController } from './shoppingdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingDetail } from './entities/shoppingdetail.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { UnitmeasureModule } from 'src/unitmeasure/unitmeasure.module';
import { RawmaterialModule } from 'src/rawmaterial/rawmaterial.module';

@Module({
  controllers: [ShoppingdetailController],
  providers: [ShoppingdetailService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([ShoppingDetail]), UnitmeasureModule, 
  RawmaterialModule],
  exports:[TypeOrmModule, ShoppingdetailService]
})
export class ShoppingdetailModule {}
