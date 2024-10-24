import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, IsUUID, Matches, MinLength, ValidateNested } from "class-validator";
import { FormatShoppingdetailDto } from "src/shoppingdetail/dto/format-shoppingdetail.dto";

export class CreateShoppingDto {
  @IsNumber()
  @IsPositive()
  total:number;
  
  @IsString()
  @MinLength(1)
  commercialdocument: string

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe estar en formato YYYY-MM-DD' })
  datecommercialdocument: string;

  @IsString()
  @MinLength(1)
  @IsUUID()
  supplierId:string

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) 
  @Type(() => FormatShoppingdetailDto)
  shoppingdetail: FormatShoppingdetailDto[]
}
