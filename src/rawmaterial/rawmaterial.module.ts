import { Module } from '@nestjs/common';
import { RawmaterialService } from './rawmaterial.service';
import { RawmaterialController } from './rawmaterial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rawmaterial } from './entities/rawmaterial.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { UnitmeasureModule } from 'src/unitmeasure/unitmeasure.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RawmaterialController],
  providers: [RawmaterialService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Rawmaterial]), SuppliersModule, 
  UnitmeasureModule, AuthModule],
  exports:[TypeOrmModule, RawmaterialService]
})
export class RawmaterialModule {}
