import { Controller, Get, Post, Body, Query, Put, Param } from '@nestjs/common';
import { ProductionsService } from './productions.service';
import { CreateProductionDto } from './dto/create-production.dto';
import { QueryParamsProductionsDto, QueryParamsReportTopProductsProductionsDto } from './dto/query-params-productions.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('productions')
export class ProductionsController {
  constructor(private readonly productionsService: ProductionsService) {}

  @Post()
  @Auth()
  create(@Body() createProductionDto: CreateProductionDto) {
    return this.productionsService.create(createProductionDto);
  }

  @Get()
  @Auth()
  findAll(@Query() queryparams: QueryParamsProductionsDto) {
    return this.productionsService.findAll(queryparams);
  }

  @Put(":productionId")
  @Auth(ValidRoles.SuperUser)
  revertProduction(@Param('productionId') productionId: string){
    return this.productionsService.revertProduction(productionId)
  }

  @Get('/topproductions')
  @Auth()
  findProductTopProductions(@Query() queryparams: QueryParamsReportTopProductsProductionsDto) {
    return this.productionsService.findTopProductProduction(queryparams);
  }
}
