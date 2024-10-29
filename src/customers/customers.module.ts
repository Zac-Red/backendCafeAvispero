import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, UuidAdapter, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Customer]), AuthModule],
  exports:[TypeOrmModule, CustomersService]
})
export class CustomersModule {}
