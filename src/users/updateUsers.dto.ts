import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class updateUserDto {

  /**
   * Es un string 
   * @example "John"
   */
  @IsOptional()
  @IsString()
  name?: string;
  
  /**
   * Debe ser un email
   * @example "jonh03@example.com "
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * Debe ser un string y debe tener al menos 8 caracteres
   * @example "12345678"
   */
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password?: string;
  
  /**
   * Debe ser un string
   * @example "https://example.com/image.jpg"
   */
  @IsOptional()
  @IsString()
  photoUrl?: string;
  
  /**
   * Debe ser un string
   * @example "Texto descriptivo"
   */
  @IsOptional()
  @IsString()
  description?: string;
}