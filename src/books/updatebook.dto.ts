import { IsOptional, IsString, IsInt, IsArray, IsUrl } from 'class-validator';

export class UpdateBookDto {

  /**
   * Debe ser un string
   * @example "El señor de los anillos"
   */
  @IsOptional()
  @IsString()
  title?: string;
  
  /**
   * Es opcional y debe ser un string
   * @example "J. R. R. Tolkien"
   */
  @IsOptional()
  @IsString()
  author?: string;
  
  /**
   * Debe ser un entero
   * @example "1967"
   */
  @IsOptional()
  @IsInt()
  publication_year?: number;
  
  /**
   * Debe ser un string
   * @example "Esto es una descripción"
   */
  @IsOptional()
  @IsString()
  description?: string;
  
  /**
   * Debe ser un string
   * @example "https://example.com/image.jpg"
   */
  @IsOptional()
  @IsUrl()
  photoUrl?: string;
  
  /**
   * Debe ser un array de objetos con el formato { id: number }
   * @example "[{ id: 1 }, { id: 2 }]"
   */
  @IsOptional()
  @IsArray()
  categories?: { id: number }[];
}