import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { UpdateShoppingDto } from './dto/update-shopping.dto';
import { QueryParamsShoppingDto } from './dto/query-params-shopping.dto';

@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Post()
  create(@Body() createShoppingDto: CreateShoppingDto) {
    return this.shoppingService.create(createShoppingDto);
  }

  @Get()
  findAll(@Query() queryparams: QueryParamsShoppingDto) {
    return this.shoppingService.findAll(queryparams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingDto: UpdateShoppingDto) {
    return this.shoppingService.update(+id, updateShoppingDto);
  }
}
