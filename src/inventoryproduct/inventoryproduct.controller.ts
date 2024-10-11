import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryproductService } from './inventoryproduct.service';
import { CreateInventoryproductDto } from './dto/create-inventoryproduct.dto';
import { UpdateInventoryproductDto } from './dto/update-inventoryproduct.dto';

@Controller('inventoryproduct')
export class InventoryproductController {
  constructor(private readonly inventoryproductService: InventoryproductService) {}

  @Get()
  findAll() {
    return this.inventoryproductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryproductService.findOne(+id);
  }
}
