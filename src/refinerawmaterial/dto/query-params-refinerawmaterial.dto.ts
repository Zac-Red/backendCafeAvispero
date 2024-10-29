import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsRefineRawMaterialDto extends PaginationDto {
  @IsOptional()
  @IsString()
  rawmaterial?: string
}