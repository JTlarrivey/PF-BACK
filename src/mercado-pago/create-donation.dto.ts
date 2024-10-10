import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDonationDto {

  @ApiProperty({
    description: 'Monto a donar',
  example: 100,
})
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
