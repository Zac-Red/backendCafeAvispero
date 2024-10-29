import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { QueryParamsReportTopClientesSaleDto, QueryParamsSaleDto } from './dto/query-params-sales.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Auth()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Auth()
  findAll(@Query() queryparams: QueryParamsSaleDto) {
    return this.salesService.findAll(queryparams);
  }

  @Get('/topcustomers')
  @Auth()
  reportTopClients(@Query() queryparams: QueryParamsReportTopClientesSaleDto) {
    return this.salesService.findCustomersTop(queryparams);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Put(":saleId")
  @Auth(ValidRoles.SuperUser)
  revertSale(@Param('saleId') saleId: string){
    return this.salesService.revertSale(saleId)
  }
}
