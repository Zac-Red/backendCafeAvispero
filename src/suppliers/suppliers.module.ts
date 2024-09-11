import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, UuidAdapter, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Supplier])],
  exports: [TypeOrmModule]
})
export class SuppliersModule {}
