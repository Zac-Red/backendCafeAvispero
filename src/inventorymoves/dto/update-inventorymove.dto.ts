import { PartialType } from '@nestjs/mapped-types';
import { CreateInventorymoveDto } from './create-inventorymove.dto';

export class UpdateInventorymoveDto extends PartialType(CreateInventorymoveDto) {}
