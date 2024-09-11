import { Transform, } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsUserDto extends PaginationDto {
  
  @IsOptional()
  @IsString()
  firstname?: string

  @IsOptional()
  @IsString()
  lastname?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  IsActive?: boolean

  @IsOptional()
  @IsString()
  roles?: string;
}