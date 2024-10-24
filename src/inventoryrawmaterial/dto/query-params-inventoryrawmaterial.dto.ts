import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsInventoryRawMaterialDto extends PaginationDto {
  
  @IsOptional()
  @Type(()=> Number)
  amount?: number;

  @IsOptional()
  @IsString()
  rawmaterial?: string

  @IsOptional()
  @IsString()
  unitmeasure?: string

  @IsOptional()
  @IsString()
  moveinventory?: string
}