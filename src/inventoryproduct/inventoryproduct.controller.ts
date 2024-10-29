import { Controller, Get, Query } from '@nestjs/common';
import { InventoryproductService } from './inventoryproduct.service';
import { QueryParamsInventoryProductDto } from './dto/query-params-inventoryproducts.dto';
import { Auth } from 'src/auth/decorators';


@Controller('inventoryproduct')
export class InventoryproductController {
  constructor(private readonly inventoryproductService: InventoryproductService) {}

  @Get()
  @Auth()
  findAll(@Query() queryparams: QueryParamsInventoryProductDto) {
    return this.inventoryproductService.findAll(queryparams);
  }
}
