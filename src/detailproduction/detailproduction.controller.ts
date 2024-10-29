import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { DetailproductionService } from './detailproduction.service';
import { CreateDetailproductionDto } from './dto/create-detailproduction.dto';
import { Auth } from 'src/auth/decorators';

@Controller('detailproduction')
export class DetailproductionController {
  constructor(private readonly detailproductionService: DetailproductionService) {}

  // @Post()
  // create(@Body() createDetailproductionDto: CreateDetailproductionDto) {
  //   return this.detailproductionService.create(createDetailproductionDto);
  // }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.detailproductionService.findOne(term);
  }
}
