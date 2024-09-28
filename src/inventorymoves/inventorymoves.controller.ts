import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InventorymovesService } from './inventorymoves.service';
import { CreateInventorymoveDto } from './dto/create-inventorymove.dto';
import { UpdateInventorymoveDto } from './dto/update-inventorymove.dto';
import { QueryParamsInventoryMoveDto } from './dto/query-params-inventorymove.dto';

@Controller('inventorymoves')
export class InventorymovesController {
  constructor(private readonly inventorymovesService: InventorymovesService) {}

  @Post()
  create(@Body() createInventorymoveDto: CreateInventorymoveDto) {
    return this.inventorymovesService.create(createInventorymoveDto);
  }

  @Get()
  findAll(@Query() queryparams: QueryParamsInventoryMoveDto) {
    return this.inventorymovesService.findAll(queryparams);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.inventorymovesService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventorymoveDto: UpdateInventorymoveDto) {
    return this.inventorymovesService.update(+id, updateInventorymoveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventorymovesService.remove(id);
  }
}
