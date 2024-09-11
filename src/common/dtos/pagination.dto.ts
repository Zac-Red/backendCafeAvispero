import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  
  @IsOptional()
  @IsPositive()
  @Type(()=> Number)
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(()=> Number)
  page?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  deleted?:boolean;
}