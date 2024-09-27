import { Controller, Post, Delete, Param, Get, Body, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddFriendDto, RemoveFriendDto, GetUserFavoritesDto } from './favorites.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express'; // Asegúrate de importar Request desde express
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('add-friend')
  async addFriend(@Body() addFriendDto: AddFriendDto, @Req() req: Request) { // Usa @Req() aquí
    const userId = req.user.id;  // Supone que ya tienes el ID del usuario en req.user
    return this.favoritesService.addFriend(addFriendDto.friendId, userId);
  }

  @Delete('remove-friend')
  async removeFriend(@Body() removeFriendDto: RemoveFriendDto, @Req() req: Request) { // Usa @Req() aquí
    const userId = req.user.id; // Supone que ya tienes el ID del usuario en req.user
    return this.favoritesService.removeFriend(removeFriendDto.friendId, userId);
  }

  @Get('user/:userId')
  async getUserFavorites(@Param() getUserFavoritesDto: GetUserFavoritesDto) {
    return this.favoritesService.getUserFavorites(getUserFavoritesDto.userId);
  }
}
