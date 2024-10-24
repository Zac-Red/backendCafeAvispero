import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsString, IsUUID, MinLength, ValidateNested } from "class-validator";
import { FormatDetailproductionDto } from "src/detailproduction/dto/format-detailproduction.dto";

export class CreateRecipproductionDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsUUID()
  @MinLength(1)
  productId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) 
  @Type(() => FormatDetailproductionDto)
  productiondetail: FormatDetailproductionDto[]
}
