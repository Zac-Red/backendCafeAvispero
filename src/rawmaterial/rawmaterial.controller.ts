import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RawmaterialService } from './rawmaterial.service';
import { CreateRawmaterialDto } from './dto/create-rawmaterial.dto';
import { UpdateRawmaterialDto } from './dto/update-rawmaterial.dto';
import { QueryParamsRawMaterials, QueryParamsReportTopRawmaterialShoppDto } from './dto/query-params.dto';
import { Auth } from 'src/auth/decorators';

@Controller('rawmaterial')
export class RawmaterialController {
  constructor(private readonly rawmaterialService: RawmaterialService) {}

  @Post()
  @Auth()
  create(@Body() createRawmaterialDto: CreateRawmaterialDto) {
    return this.rawmaterialService.create(createRawmaterialDto);
  }

  @Get()
  @Auth()
  findAll(@Query() QueryParams: QueryParamsRawMaterials) {
    return this.rawmaterialService.findAll(QueryParams);
  }

  @Get("toprawmaterialshopping")
  @Auth()
  reportTopRawMaterialShopping(@Query() queryparams: QueryParamsReportTopRawmaterialShoppDto) {
    return this.rawmaterialService.findTopRawMaterialShopping(queryparams);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.rawmaterialService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateRawmaterialDto: UpdateRawmaterialDto) {
    return this.rawmaterialService.update(id, updateRawmaterialDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.rawmaterialService.remove(id);
  }
}
