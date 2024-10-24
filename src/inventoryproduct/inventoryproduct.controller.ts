import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryproductService } from './inventoryproduct.service';
import { QueryParamsInventoryProductDto } from './dto/query-params-inventoryproducts.dto';


@Controller('inventoryproduct')
export class InventoryproductController {
  constructor(private readonly inventoryproductService: InventoryproductService) {}

  @Get()
  findAll(@Query() queryparams: QueryParamsInventoryProductDto) {
    return this.inventoryproductService.findAll(queryparams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryproductService.findOne(+id);
  }
}
