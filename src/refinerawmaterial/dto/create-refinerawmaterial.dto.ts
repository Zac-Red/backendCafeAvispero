import { IsNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateRefinerawmaterialDto {
  @IsNumber()
  amount: number;

  @IsString()
  @MinLength(1)
  @IsUUID()
  rawmaterialId: string;

  @IsNumber()
  unitmeasureId: number;
}
