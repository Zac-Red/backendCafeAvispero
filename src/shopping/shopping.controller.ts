import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { QueryParamsShoppingDto } from './dto/query-params-shopping.dto';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Post()
  @Auth()
  create(@Body() createShoppingDto: CreateShoppingDto) {
    return this.shoppingService.create(createShoppingDto);
  }

  @Get()
  @Auth()
  findAll(@Query() queryparams: QueryParamsShoppingDto) {
    return this.shoppingService.findAll(queryparams);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.shoppingService.findOne(id);
  }

  @Put(":shoppingId")
  @Auth(ValidRoles.SuperUser)
  revertShopping(@Param('shoppingId') shoppingId: string){
    return this.shoppingService.revertShopping(shoppingId)
  }
}
