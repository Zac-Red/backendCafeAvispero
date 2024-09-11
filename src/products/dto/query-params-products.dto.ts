import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsProductDto extends PaginationDto {
  
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  unitmeasure?: string

  @IsOptional()
  @Type(()=> Number)
  price?: number;

  @IsOptional()
  @Type(()=> Number)
  stock?: number;
}