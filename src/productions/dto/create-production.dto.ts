import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateProductionDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsUUID()
  @MinLength(1)
  recipproductionId: string;
}
