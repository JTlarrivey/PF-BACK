import { Controller, Post, Delete, Param, Get, Body, Req, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
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
    const userId = req.user.user_id;
    if (!userId || !addFriendDto.friendId) {
      throw new BadRequestException('User ID or Friend ID is missing');
    }
    
    try {
      return await this.favoritesService.addFriend(addFriendDto.friendId, userId);
    } catch (error) {
      throw new BadRequestException('Error adding friend');
    }
  }

  @Delete('remove-friend')
  async removeFriend(@Body() removeFriendDto: RemoveFriendDto, @Req() req: ExtendedRequest) {
    const userId = req.user.user_id;
    if (!userId || !removeFriendDto.friendId) {
      throw new BadRequestException('User ID or Friend ID is missing');
    }

    try {
      return await this.favoritesService.removeFriend(removeFriendDto.friendId, userId);
    } catch (error) {
      throw new BadRequestException('Error removing friend');
    }
  }

  @Get('user/:userId')
  async getUserFavorites(@Param() getUserFavoritesDto: GetUserFavoritesDto) {
    try {
      const favorites = await this.favoritesService.getUserFavorites(getUserFavoritesDto.userId);
      if (!favorites) {
        throw new NotFoundException('User not found or has no favorites');
      }
      return favorites;
    } catch (error) {
      throw new BadRequestException('Error fetching user favorites');
    }
  }
}