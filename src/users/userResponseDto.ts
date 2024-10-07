import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UserResponseDto {
  user_id: number;
  
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean; 

  @IsBoolean()
  isDeleted?: boolean;

  @IsBoolean()
  isBanned?: boolean;

  @IsOptional()
  @IsString()
  photoUrl?: string; 

  registration_date: Date;
}
