import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { CategoriesDto } from 'src/categories/categories.dto';

export class CreateBookDto {

  /**
   * Debe ser un string y no puede estar vacío
   * @example "El cuento de janeiro"
   */
  @IsString()
  @IsNotEmpty()
  title: string;
  
  /**
   * Debe ser un string y no puede estar vacío
   * @example "Texto de prueba"
   */
  @IsString()
  @IsNotEmpty()
  description: string;
  
  /**
   * Debe ser un string y no puede estar vacío
   * @example "https://example.com/image.jpg"
   */
  @IsString()
  @IsNotEmpty()
  photoUrl: string;
  
  /**
   * Debe ser un string y no puede estar vacío
   * @example "Gabriel Garcia Marquez"
   */
  @IsString()
  @IsNotEmpty()
  author: string;
  
  /**
   * Es un numero y no puede estar vacío
   * @example "2022"
   */
  @IsNumber()
  @IsNotEmpty()
  publication_year: number;
  
  /**
   * Es un array
   * @example "[1, 2, 3]"
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoriesDto) 
  categories: CategoriesDto[];
}