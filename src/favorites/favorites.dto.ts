import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFriendDto {
  @ApiProperty({
    description: 'ID del amigo que se desea agregar',
    example: 456,
  })
  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}

export class RemoveFriendDto {
  @ApiProperty({
    description: 'ID del amigo que se desea eliminar',
    example: 456,
  })
  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}

export class GetUserFavoritesDto {
  @ApiProperty({
    description: 'ID del usuario cuyas preferencias se desean obtener',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}