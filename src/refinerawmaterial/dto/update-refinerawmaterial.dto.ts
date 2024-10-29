import { PartialType } from '@nestjs/mapped-types';
import { CreateRefinerawmaterialDto } from './create-refinerawmaterial.dto';

export class UpdateRefinerawmaterialDto extends PartialType(CreateRefinerawmaterialDto) {}
