import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional, MinLength, MaxLength, IsEmpty } from 'class-validator';

export class CreateUserDto {
  
  @ApiProperty({
    description: 'Nombre del usuario. Debe ser un string de entre 3 y 80 caracteres',
    example: 'User1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({
    description: 'Email del usuario. Debe ser un string en formato de email y no estar vacío',
    example: 'user1@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @ApiProperty({
    description: 'Contraseña del usuario. Debe ser un string de entre 8 y 15 caracteres',
    example: 'Abcd1234!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @ApiProperty({
    description: 'Indica si el usuario ha confirmado su cuenta',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isConfirmed?: boolean;
  
  @ApiProperty({
    description: 'URL de la foto del usuario',
    example: 'http://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photoUrl?: string; 

  @ApiHideProperty() 
  @IsEmpty()
  @IsOptional()
  isAdmin?: boolean; 
}

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password']) {}
