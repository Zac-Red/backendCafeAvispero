import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class FormatSaledetailDto {
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  subtotal: number;

  @IsString()
  @MinLength(1)
  @IsUUID()
  productId: string;
}