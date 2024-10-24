import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateUnitmeasureDto {
  @IsString()
  @MinLength(1)
  name:string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  conversionfactor: number;
}
