import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  /**
   * Debe ser un string en formato de email y no estar vacío
   * @example "user1@example.com"
   */
  @IsEmail()
  email: string;
  
  /**
   * Debe ser un string de entre 8 y 15 caracteres
   * @example "Abcd1234!"
   */
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
