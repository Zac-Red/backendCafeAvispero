import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateInventoryproductDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @MinLength(1)
  @IsUUID()
  productId: string;
  
  @IsNumber()
  @IsPositive()
  unitmeasureId: number
  
  @IsNumber()
  @IsPositive()
  inventorymoveId: number
}
