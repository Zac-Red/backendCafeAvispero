import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UnitmeasureService } from './unitmeasure.service';
import { CreateUnitmeasureDto } from './dto/create-unitmeasure.dto';
import { UpdateUnitmeasureDto } from './dto/update-unitmeasure.dto';
import { QueryParamsUnitmeasureDto } from './dto/query-params-unitmeasure.dto';

@Controller('unitmeasure')
export class UnitmeasureController {
  constructor(private readonly unitmeasureService: UnitmeasureService) {}

  @Post()
  create(@Body() createUnitmeasureDto: CreateUnitmeasureDto) {
    return this.unitmeasureService.create(createUnitmeasureDto);
  }

  @Get()
  findAll(@Query() queryparams: QueryParamsUnitmeasureDto) {
    return this.unitmeasureService.findAll(queryparams);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.unitmeasureService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitmeasureDto: UpdateUnitmeasureDto) {
    return this.unitmeasureService.update(+id, updateUnitmeasureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitmeasureService.remove(id);
  }
}
