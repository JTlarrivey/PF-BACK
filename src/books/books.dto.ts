import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class FilterBooksDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly author?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  readonly limit?: number = 10;
} 