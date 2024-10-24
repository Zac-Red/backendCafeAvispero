import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailproductionDto } from './create-detailproduction.dto';

export class UpdateDetailproductionDto extends PartialType(CreateDetailproductionDto) {}
