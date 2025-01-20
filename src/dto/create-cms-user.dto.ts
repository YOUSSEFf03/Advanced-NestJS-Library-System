// src/dto/create-cms-user.dto.ts
import { IsEmail, IsString, IsIn } from 'class-validator';

export class CreateCmsUserDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsIn(['Admin', 'Intern']) // Ensure the role is either 'Admin' or 'Intern'
  role: string;
}