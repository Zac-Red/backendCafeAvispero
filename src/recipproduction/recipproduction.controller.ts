import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RecipproductionService } from './recipproduction.service';
import { CreateRecipproductionDto } from './dto/create-recipproduction.dto';
import { QueryParamsRecipProductionDto } from './dto/query-params-recipproduction.dto';
import { Auth } from 'src/auth/decorators';

@Controller('recipproduction')
export class RecipproductionController {
  constructor(private readonly recipproductionService: RecipproductionService) {}

  @Post()
  @Auth()
  create(@Body() createRecipproductionDto: CreateRecipproductionDto) {
    return this.recipproductionService.create(createRecipproductionDto);
  }

  @Get()
  @Auth()
  findAll(@Query() queryparams: QueryParamsRecipProductionDto) {
    return this.recipproductionService.findAll(queryparams);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.recipproductionService.findOne(term);
  }
}
