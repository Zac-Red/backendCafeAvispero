import { Module, forwardRef } from '@nestjs/common';
import { RecipproductionService } from './recipproduction.service';
import { RecipproductionController } from './recipproduction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipproduction } from './entities/recipproduction.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { ProductsModule } from 'src/products/products.module';
import { RawmaterialModule } from 'src/rawmaterial/rawmaterial.module';
import { DetailproductionModule } from 'src/detailproduction/detailproduction.module';
import { UnitmeasureModule } from 'src/unitmeasure/unitmeasure.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RecipproductionController],
  providers: [RecipproductionService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Recipproduction]), ProductsModule,
  RawmaterialModule, UnitmeasureModule, forwardRef(()=> DetailproductionModule),
  AuthModule],
  exports: [TypeOrmModule, RecipproductionService]
})
export class RecipproductionModule {}
