import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDonationDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  description?: string;
}
