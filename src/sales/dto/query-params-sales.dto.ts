import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsSaleDto extends PaginationDto {

  @IsOptional()
  @IsString()
  clientname?: string

  @IsOptional()
  @Type(()=> Number)
  total?: number;
}