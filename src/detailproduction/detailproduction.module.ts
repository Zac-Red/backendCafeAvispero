import { Module, forwardRef } from '@nestjs/common';
import { DetailproductionService } from './detailproduction.service';
import { DetailproductionController } from './detailproduction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detailproduction } from './entities/detailproduction.entity';
import { RawmaterialModule } from 'src/rawmaterial/rawmaterial.module';
import { RecipproductionModule } from 'src/recipproduction/recipproduction.module';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';

@Module({
  controllers: [DetailproductionController],
  providers: [DetailproductionService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Detailproduction]), RawmaterialModule, 
  forwardRef(() =>RecipproductionModule)],
  exports: [TypeOrmModule, DetailproductionService]
})
export class DetailproductionModule {}
