import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoriesDto {
  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Ficción',
    maxLength: 255, 
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Indica si la categoría está eliminada',
    example: false,
    required: false,  
  })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}