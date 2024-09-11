import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class QueryParamsCustomers extends PaginationDto{
  @IsString()
  @IsOptional()  
  name?:string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(()=> Number)
  phone?: number;

  @IsString()
  @IsOptional()  
  nit?: string;
}
