import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsShoppingDto extends PaginationDto {

  @IsOptional()
  @IsString()
  suppliername?: string

  @IsOptional()
  @IsString()
  commercialdocument?: string

  @IsOptional()
  @Type(()=> Number)
  total?: number;
}