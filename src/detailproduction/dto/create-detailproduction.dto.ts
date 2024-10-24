import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateDetailproductionDto {
  @IsNumber()
  unitmeasureId: number;
  
  @IsNumber()
  amount: number;

  @IsString()
  @IsUUID()
  @MinLength(1)
  rawmaterialId: string;

  @IsString()
  @IsUUID()
  @MinLength(1)
  recipproductionId: string;
}
