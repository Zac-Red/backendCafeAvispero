import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateShoppingdetailDto {
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  subtotal: number;
  
  @IsNumber()
  @IsPositive()
  unitmeasureId: number
  
  @IsString()
  @MinLength(1)
  @IsUUID()
  rawmaterialId: string;

  @IsString()
  @MinLength(1)
  @IsUUID()
  shoppingId: string;
}
