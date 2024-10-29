import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryParamsProductDto, QueryParamsReportTopProductsSaleDto } from './dto/query-params-products.dto';
import { Auth } from 'src/auth/decorators';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Auth()
  findAll(@Query() queryparams: QueryParamsProductDto) {
    return this.productsService.findAll(queryparams);
  }

  @Get("topproducts")
  @Auth()
  reportTopProducts(@Query() queryparams: QueryParamsReportTopProductsSaleDto) {
    return this.productsService.findTopProductsSales(queryparams);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
