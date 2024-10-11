import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateSalesdetailDto {
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
  productId: string;

  @IsString()
  @MinLength(1)
  @IsUUID()
  saleId: string;
}
