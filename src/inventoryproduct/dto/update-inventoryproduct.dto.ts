import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryproductDto } from './create-inventoryproduct.dto';

export class UpdateInventoryproductDto extends PartialType(CreateInventoryproductDto) {}
