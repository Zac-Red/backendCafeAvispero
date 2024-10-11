import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, UuidAdapter, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Customer])],
  exports:[TypeOrmModule, CustomersService]
})
export class CustomersModule {}
