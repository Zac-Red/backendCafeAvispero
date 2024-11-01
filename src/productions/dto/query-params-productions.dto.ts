import { IsOptional, IsString, Matches } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsProductionsDto extends PaginationDto {
  
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  product?: string
}

export class QueryParamsReportTopProductsProductionsDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha (startOfCurrentMonth) de inicio debe estar en formato YYYY-MM-DD' })
  startOfCurrentMonth: string;
  
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha (endOfCurrentMonth) fin debe estar en formato YYYY-MM-DD' })
  endOfCurrentMonth:string;
}