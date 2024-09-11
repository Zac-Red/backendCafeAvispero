import { IsString, MinLength } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  role: string;

  @IsString()
  @MinLength(1)
  description: string;
}
