import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipproductionDto } from './create-recipproduction.dto';

export class UpdateRecipproductionDto extends PartialType(CreateRecipproductionDto) {}
