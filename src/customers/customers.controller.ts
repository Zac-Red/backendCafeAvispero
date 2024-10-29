import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryParamsCustomers } from './dto/query-params-customers.dto';
import { Auth } from 'src/auth/decorators';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Auth()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Auth()
  findAll(@Query() QueryParams: QueryParamsCustomers) {
    return this.customersService.findAll(QueryParams);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term:string) {
    return this.customersService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
