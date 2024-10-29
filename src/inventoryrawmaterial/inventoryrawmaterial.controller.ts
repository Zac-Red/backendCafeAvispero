import { Controller, Get, Query } from '@nestjs/common';
import { InventoryrawmaterialService } from './inventoryrawmaterial.service';
import { QueryParamsInventoryRawMaterialDto } from './dto/query-params-inventoryrawmaterial.dto';
import { Auth } from 'src/auth/decorators';

@Controller('inventoryrawmaterial')
export class InventoryrawmaterialController {
  constructor(private readonly inventoryrawmaterialService: InventoryrawmaterialService) {}

  @Get()
  @Auth()
  findAll(@Query() Queryparams: QueryParamsInventoryRawMaterialDto) {
    return this.inventoryrawmaterialService.findAll(Queryparams);
  }
}
