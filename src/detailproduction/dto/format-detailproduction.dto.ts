import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class FormatDetailproductionDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  unitmeasureId: number;
  
  @IsString()
  @IsUUID()
  @MinLength(1)
  rawmaterialId: string;
}