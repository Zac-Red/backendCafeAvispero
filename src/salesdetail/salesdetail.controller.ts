import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SalesdetailService } from './salesdetail.service';
import { CreateSalesdetailDto } from './dto/create-salesdetail.dto';
import { Auth } from 'src/auth/decorators';

@Controller('salesdetail')
export class SalesdetailController {
  constructor(private readonly salesdetailService: SalesdetailService) {}

  // @Post()
  // create(@Body() createSalesdetailDto: CreateSalesdetailDto) {
  //   return this.salesdetailService.create(createSalesdetailDto);
  // }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.salesdetailService.findOne(id);
  }
}
