import { Controller, Post, Delete, Param, Get, Body, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddFriendDto, RemoveFriendDto, GetUserFavoritesDto } from './favorites.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExtendedRequest } from 'src/interface/extended-request.interface';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('add-friend')
  async addFriend(@Body() addFriendDto: AddFriendDto, @Req() req: ExtendedRequest) {
    const userId = req.user.user_id; // Cambia 'id' por 'user_id'
    return this.favoritesService.addFriend(addFriendDto.friendId, userId);
  }

  @Delete('remove-friend')
  async removeFriend(@Body() removeFriendDto: RemoveFriendDto, @Req() req: ExtendedRequest) {
    const userId = req.user.user_id; // Cambia 'id' por 'user_id'
    return this.favoritesService.removeFriend(removeFriendDto.friendId, userId);
  }

  @Get('user/:userId')
  async getUserFavorites(@Param() getUserFavoritesDto: GetUserFavoritesDto) {
    return this.favoritesService.getUserFavorites(getUserFavoritesDto.userId);
  }
}
