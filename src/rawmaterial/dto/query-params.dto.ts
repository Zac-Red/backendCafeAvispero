import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString, IsUUID, Matches, MinLength } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsRawMaterials extends PaginationDto{
  @IsOptional()
  @IsString()
  name?:string;

  @IsOptional()
  @IsPositive()
  @Type(()=> Number)
  price?:number;

  @IsOptional()
  @IsPositive()
  @Type(()=> Number)
  stock?:number;

  @IsOptional()
  @IsString()
  unitmeasure?:string;

  @IsOptional()
  @IsString()
  supplier?:string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @IsUUID()
  supplierId?:string;
}


export class QueryParamsReportTopRawmaterialShoppDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha (startOfCurrentMonth) de inicio debe estar en formato YYYY-MM-DD' })
  startOfCurrentMonth: string;
  
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha (endOfCurrentMonth) fin debe estar en formato YYYY-MM-DD' })
  endOfCurrentMonth:string;
}