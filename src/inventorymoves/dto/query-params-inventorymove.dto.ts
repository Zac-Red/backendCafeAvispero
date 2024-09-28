import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsInventoryMoveDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string
}