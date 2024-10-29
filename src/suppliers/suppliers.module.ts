import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, UuidAdapter, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Supplier]), AuthModule],
  exports: [TypeOrmModule, SuppliersService]
})
export class SuppliersModule {}
