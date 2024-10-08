import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class FilterBooksDto {
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
   * Debe ser un numero entero entre 1 y 50
   * @example "1"
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;
  
  /**
   * Debe ser un numero entero entre 1 y 50
   * @example "10"
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
} 