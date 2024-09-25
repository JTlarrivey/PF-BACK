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
  isAdmin?: boolean; // Hazlo requerido o asegúrate de manejarlo en el servicio

  @IsBoolean()
  @IsOptional()
  isConfirmed?: boolean;

  @IsOptional()
  @IsString()
  photoUrl?: string; 
}
