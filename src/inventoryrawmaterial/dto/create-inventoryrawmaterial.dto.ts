import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateInventoryrawmaterialDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @MinLength(1)
  @IsUUID()
  rawmaterialId: string;

  @IsNumber()
  @IsPositive()
  inventorymoveId: number

  @IsNumber()
  @IsPositive()
  unitmeasureId: number
}
