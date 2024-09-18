import { IsBoolean, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSupplierDto {

  @IsString()
  @IsOptional()
  personeria?:string;

  @IsString()
  @MinLength(1)
  namecontact:string;

  @IsNumber()
  tel:number;

  @IsNumber()
  @IsOptional()
  dpi?:number;

  @IsString()
  @MinLength(1)
  address:string;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}
