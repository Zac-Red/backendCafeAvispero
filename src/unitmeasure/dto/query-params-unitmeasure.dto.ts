import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsUnitmeasureDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string
}