import { IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateconversionrawmaterialDto {
  @IsNumber()
  amountToConvert: number; // Cantidad a convertir (unidad origen)

  @IsString()
  @MinLength(1)
  @IsUUID()
  sourceMaterialId: string; // Materia prima que se va a descontar

  @IsString()
  @MinLength(1)
  @IsUUID()
  targetMaterialId: string; // Materia prima a la que se aumenta stock
  
  @IsNumber()
  @IsPositive()
  unitMeasureSourceId: number;// Unidad de medida de la cantidad a convertir

  @IsNumber()
  @IsPositive()
  unitMeasureTargetId: number; // Unidad de medida de la cantidad procesada
}