import { IsInt, IsNotEmpty, IsString, IsPositive, IsDate, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsPositive()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  user_id: number;

  @IsInt()
  book_id: number;
  
  @IsNotEmpty() 
  @IsDate()     
  reviewDate: Date
}