import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsInventoryProductDto extends PaginationDto {
  @IsOptional()
  @IsString()
  product?: string

  @IsOptional()
  @IsString()
  unitmeasure?: string

  @IsOptional()
  @IsString()
  tipomovimiento?: string

  @IsOptional()
  @Type(()=> Number)
  amount?: number;
}