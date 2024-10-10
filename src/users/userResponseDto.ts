import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
  })
  @IsNumber()
  user_id: number;
  
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({
    description: 'Email del usuario. No puede ser vacío',
    example: 'juanperez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({
    description: 'Indica si el usuario es administrador',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean; 

  @ApiProperty({
    description: 'URL de la foto del usuario',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string; 

  @ApiProperty({
    description: 'Fecha de registro del usuario',
    example: '2023-10-08T14:48:00.000Z',
  })
  registration_date: Date;
}
