import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString } from "class-validator";
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
  unitmeasure?:string

  @IsOptional()
  @IsString()
  supplier?:string
}