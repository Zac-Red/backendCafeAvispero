import { Type } from "class-transformer";
import { IsOptional, IsString, Matches } from "class-validator";
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

export class QueryParamsReportTopProductsSaleDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha (startOfCurrentMonth) de inicio debe estar en formato YYYY-MM-DD' })
  startOfCurrentMonth: string;
  
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha (endOfCurrentMonth) fin debe estar en formato YYYY-MM-DD' })
  endOfCurrentMonth:string;
}