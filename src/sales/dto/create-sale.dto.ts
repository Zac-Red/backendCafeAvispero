import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, IsUUID, MinLength, ValidateNested } from "class-validator";
import { FormatSaledetailDto } from "src/salesdetail/dto/format-saledetail.dto";

export class CreateSaleDto {
  @IsNumber()
  @IsPositive()
  total:number;

  @IsString()
  @MinLength(1)
  @IsUUID()
  customerId:string

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) 
  @Type(() => FormatSaledetailDto)
  salesdetail: FormatSaledetailDto[]
}
