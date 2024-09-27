import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateSupplierDto {

  @IsString()
  @IsOptional()
  personeria?:string;

  @IsString()
  @MinLength(1)
  namecontact:string;

  @IsNumber()
  @IsPositive()
  tel:number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  dpi?:number;

  @IsString()
  @MinLength(1)
  address:string;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}
