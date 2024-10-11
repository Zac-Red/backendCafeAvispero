import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesdetailDto } from './create-salesdetail.dto';

export class UpdateSalesdetailDto extends PartialType(CreateSalesdetailDto) {}
