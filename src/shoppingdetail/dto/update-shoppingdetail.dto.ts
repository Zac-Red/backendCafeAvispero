import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingdetailDto } from './create-shoppingdetail.dto';

export class UpdateShoppingdetailDto extends PartialType(CreateShoppingdetailDto) {}
