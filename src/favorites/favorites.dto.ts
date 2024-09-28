import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddFriendDto {
  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}

export class RemoveFriendDto {
  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}

export class GetUserFavoritesDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}