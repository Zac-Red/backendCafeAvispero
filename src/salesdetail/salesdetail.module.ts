import { Module, forwardRef } from '@nestjs/common';
import { SalesdetailService } from './salesdetail.service';
import { SalesdetailController } from './salesdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salesdetail } from './entities/salesdetail.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { SalesModule } from 'src/sales/sales.module';

@Module({
  controllers: [SalesdetailController],
  providers: [SalesdetailService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([Salesdetail]), forwardRef(() => SalesModule)],
  exports: [TypeOrmModule, SalesdetailService]
})
export class SalesdetailModule {}
