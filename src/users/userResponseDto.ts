import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UserResponseDto {
  
  @IsNumber()
  user_id: number;
  
  /**
   * Es un string 
   * @example "John Doe"
   */
  @IsNotEmpty()
  @IsString()
  name: string;
  
  /**
   * Es un email y no puede ser vacío
   * @example "juanperez@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean; 

  /**
   * Debe ser un string
   * @example "https://example.com/image.jpg"
   */
  @IsOptional()
  @IsString()
  photoUrl?: string; 

  registration_date: Date;
}
