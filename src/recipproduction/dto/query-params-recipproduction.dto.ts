import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsRecipProductionDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  product?: string
}