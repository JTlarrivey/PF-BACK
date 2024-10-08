import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDonationDto {

  /**
   * Debe ser un numero 
   * @example "10.00"
   */
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  
  /**
   * Debe ser un email
   * @example "nXqJ3@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  /**
   * Debe ser un string
   * @example "Texto descriptivo"
   */
  @IsString()
  @IsOptional()
  description?: string;
}
