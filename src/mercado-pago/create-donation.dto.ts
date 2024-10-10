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
  
  @ApiProperty({
    description: 'Email del donante',
    example: 'juanperez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({
    description: 'Descripción de la donación',
    example: 'Texto descriptivo de la donación',
    required: false,  
  })
  @IsString()
  @IsOptional()
  description?: string;
}
