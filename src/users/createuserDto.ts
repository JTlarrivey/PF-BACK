import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean; 

  @IsBoolean()
  @IsOptional()
  isConfirmed?: boolean;

  @IsOptional()
  @IsString()
  photoUrl?: string; 
}
