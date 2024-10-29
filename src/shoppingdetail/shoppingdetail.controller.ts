import { Controller, Get, Param } from '@nestjs/common';
import { ShoppingdetailService } from './shoppingdetail.service';
import { Auth } from 'src/auth/decorators';

@Controller('shoppingdetail')
export class ShoppingdetailController {
  constructor(private readonly shoppingdetailService: ShoppingdetailService) {}
  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.shoppingdetailService.findOne(term);
  }
}
