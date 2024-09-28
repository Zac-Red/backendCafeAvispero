import { Controller, Get, Param } from '@nestjs/common';
import { ShoppingdetailService } from './shoppingdetail.service';

@Controller('shoppingdetail')
export class ShoppingdetailController {
  constructor(private readonly shoppingdetailService: ShoppingdetailService) {}
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.shoppingdetailService.findOne(term);
  }
}
