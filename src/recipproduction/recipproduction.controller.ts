import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RecipproductionService } from './recipproduction.service';
import { CreateRecipproductionDto } from './dto/create-recipproduction.dto';
import { QueryParamsRecipProductionDto } from './dto/query-params-recipproduction.dto';

@Controller('recipproduction')
export class RecipproductionController {
  constructor(private readonly recipproductionService: RecipproductionService) {}

  @Post()
  create(@Body() createRecipproductionDto: CreateRecipproductionDto) {
    return this.recipproductionService.create(createRecipproductionDto);
  }

  @Get()
  findAll(@Query() queryparams: QueryParamsRecipProductionDto) {
    return this.recipproductionService.findAll(queryparams);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.recipproductionService.findOne(term);
  }

}
