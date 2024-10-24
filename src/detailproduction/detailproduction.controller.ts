import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetailproductionService } from './detailproduction.service';
import { CreateDetailproductionDto } from './dto/create-detailproduction.dto';
import { UpdateDetailproductionDto } from './dto/update-detailproduction.dto';

@Controller('detailproduction')
export class DetailproductionController {
  constructor(private readonly detailproductionService: DetailproductionService) {}

  @Post()
  create(@Body() createDetailproductionDto: CreateDetailproductionDto) {
    return this.detailproductionService.create(createDetailproductionDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.detailproductionService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailproductionDto: UpdateDetailproductionDto) {
    return this.detailproductionService.update(+id, updateDetailproductionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailproductionService.remove(+id);
  }
}
