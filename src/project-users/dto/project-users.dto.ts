import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsUUID, MinLength } from "class-validator";

export class AssignateUserDto {
  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;
}
