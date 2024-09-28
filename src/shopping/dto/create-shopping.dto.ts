import { IsArray, IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";
import { FormatShoppingdetailDto } from "src/shoppingdetail/dto/format-shoppingdetail.dto";

export class CreateShoppingDto {
  @IsNumber()
  @IsPositive()
  total:number;
  
  @IsString()
  @MinLength(1)
  commercialdocument: string

  @IsString()
  @MinLength(1)
  @IsUUID()
  supplierId:string

  @IsArray()
  shoppingdetail: FormatShoppingdetailDto[]
}
