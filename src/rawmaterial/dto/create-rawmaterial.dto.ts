import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateRawmaterialDto {
  
  @IsString()
  @MinLength(1)
  name:string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString()
  @MinLength(1)
  unitMeasure: string;

  @IsString()
  @MinLength(1)
  @IsUUID()
  supplierId:string;
}
