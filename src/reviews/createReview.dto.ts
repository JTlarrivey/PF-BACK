import { IsInt, IsNotEmpty, IsString, IsPositive, IsDate, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Contenido de la reseña',
    example: 'Este libro es increíble, lo recomiendo.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Calificación del libro',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsPositive()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'ID del usuario que realiza la reseña',
    example: 123,
  })
  @IsInt()
  user_id: number;

  @ApiProperty({
    description: 'ID del libro al que pertenece la reseña',
    example: 456,
  })
  @IsInt()
  book_id: number;

  @ApiProperty({
    description: 'Fecha de la reseña',
    example: '2023-10-08T14:48:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  reviewDate: Date;
}