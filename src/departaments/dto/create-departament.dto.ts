import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CreateDepartamentDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}
