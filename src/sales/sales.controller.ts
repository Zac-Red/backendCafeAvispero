import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { QueryParamsReportTopClientesSaleDto, QueryParamsSaleDto } from './dto/query-params-sales.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(@Query() queryparams: QueryParamsSaleDto) {
    return this.salesService.findAll(queryparams);
  }

  @Get('/topcustomers')
  reportTopClients(@Query() queryparams: QueryParamsReportTopClientesSaleDto) {
    return this.salesService.findCustomersTop(queryparams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }
}
