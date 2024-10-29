import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { RefinerawmaterialService } from './refinerawmaterial.service';
import { CreateRefinerawmaterialDto } from './dto/create-refinerawmaterial.dto';
import { QueryParamsRefineRawMaterialDto } from './dto/query-params-refinerawmaterial.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('refinerawmaterial')
export class RefinerawmaterialController {
  constructor(private readonly refinerawmaterialService: RefinerawmaterialService) {}

  @Post()
  @Auth()
  create(@Body() createRefinerawmaterialDto: CreateRefinerawmaterialDto) {
    return this.refinerawmaterialService.create(createRefinerawmaterialDto);
  }

  @Get()
  @Auth()
  findAll(@Query() queryparams: QueryParamsRefineRawMaterialDto) {
    return this.refinerawmaterialService.findAll(queryparams);
  }

  // @Get(':term')
  // findOne(@Param('term') term: string) {
  //   return this.refinerawmaterialService.findOne(term);
  // }

  @Put(":refineId")
  @Auth(ValidRoles.SuperUser)
  revertRefineRaw(@Param('refineId') refineId: string){
    return this.refinerawmaterialService.revertRefinement(refineId)
  }
}
