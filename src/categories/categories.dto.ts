import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CategoriesDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}