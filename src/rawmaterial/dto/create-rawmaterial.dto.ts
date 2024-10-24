import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateRawmaterialDto {
  
  @IsString()
  @MinLength(1)
  name:string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  url?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsPositive()
  unitmeasureId: number;

  @IsString()
  @MinLength(1)
  @IsUUID()
  supplierId:string;
}
