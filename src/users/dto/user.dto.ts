import { IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsIn(["Admin", "Employee", "ProjectManager"])
  role: 'Admin' | 'Employee' | 'ProjectManager';
}
