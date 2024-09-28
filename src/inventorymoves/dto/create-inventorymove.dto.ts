import { IsString, MinLength } from "class-validator";

export class CreateInventorymoveDto {
  @IsString()
  @MinLength(1)
  name:string;

  @IsString()
  @MinLength(1)
  description: string;
}
