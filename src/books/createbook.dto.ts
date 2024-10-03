import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { CategoriesDto } from 'src/categories/categories.dto';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly photoUrl: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @IsNumber()
  publication_year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoriesDto) 
  categories: CategoriesDto[];
}