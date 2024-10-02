import { ApiHideProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, MinLength, MaxLength, IsEmpty } from 'class-validator';

export class CreateUserDto {
  
  /**
   * Debe ser un string de entre 3 y 80 caracteres
   * @example "User1"
   */
  @IsNotEmpty()
  @IsString()
  name: string;
  
  /**
   * Debe ser un string en formato de email y no estar vacío
   * @example "user1@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  /**
   * Debe ser un string de entre 8 y 15 caracteres
   * @example "Abcd1234!"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @IsBoolean()
  @IsOptional()
  isConfirmed?: boolean;
  
  @IsOptional()
  @IsString()
  photoUrl?: string; 

  @ApiHideProperty()
  @IsEmpty()
  @IsOptional()
  isAdmin?: boolean; // Hazlo requerido o asegúrate de manejarlo en el servicio
}

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password']) {}
