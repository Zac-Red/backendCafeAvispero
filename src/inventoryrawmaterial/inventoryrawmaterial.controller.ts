import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryrawmaterialService } from './inventoryrawmaterial.service';
import { QueryParamsInventoryRawMaterialDto } from './dto/query-params-inventoryrawmaterial.dto';

@Controller('inventoryrawmaterial')
export class InventoryrawmaterialController {
  constructor(private readonly inventoryrawmaterialService: InventoryrawmaterialService) {}

  @Get()
  findAll(@Query() Queryparams: QueryParamsInventoryRawMaterialDto) {
    return this.inventoryrawmaterialService.findAll(Queryparams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryrawmaterialService.findOne(+id);
  }
}
