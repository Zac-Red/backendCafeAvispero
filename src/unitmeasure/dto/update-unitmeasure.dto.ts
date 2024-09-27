import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitmeasureDto } from './create-unitmeasure.dto';

export class UpdateUnitmeasureDto extends PartialType(CreateUnitmeasureDto) {
  
}
