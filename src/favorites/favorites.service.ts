import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(friendId: number, userId: number): Promise<any> {
    try {
      return await this.prisma.user.update({
        where: { user_id: userId },
        data: {
          friends: {
            connect: { user_id: friendId },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Unable to add friend');
    }
  }

  async removeFriend(friendId: number, userId: number): Promise<any> {
    try {
      return await this.prisma.user.update({
        where: { user_id: userId },
        data: {
          friends: {
            disconnect: { user_id: friendId },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Unable to remove friend');
    }
  }

  async getUserFavorites(userId: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_id: userId },
        include: {
          favorites: {
            include: {
              book: true,
            },
          },
          friends: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new BadRequestException('Error retrieving user favorites');
    }
  }
}
