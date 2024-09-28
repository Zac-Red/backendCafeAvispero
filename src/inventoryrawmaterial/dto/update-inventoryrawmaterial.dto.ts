import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryrawmaterialDto } from './create-inventoryrawmaterial.dto';

export class UpdateInventoryrawmaterialDto extends PartialType(CreateInventoryrawmaterialDto) {}
