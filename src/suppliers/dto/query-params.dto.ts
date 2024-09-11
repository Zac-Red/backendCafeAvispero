import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class QueryParamsSupplierDto extends PaginationDto{
  @IsOptional()
  @IsString()
  personeria?:string;

  @IsOptional()
  @IsString()
  namecontact?:string;
}