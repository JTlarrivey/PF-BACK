import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(friendId: number, userId: number): Promise<any> {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        friends: {
          connect: { user_id: friendId },
        },
      },
    });
  }

  async removeFriend(friendId: number, userId: number): Promise<any> {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        friends: {
          disconnect: { user_id: friendId },
        },
      },
    });
  }

  async getUserFavorites(userId: number): Promise<any> {
    return this.prisma.user.findUnique({
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
  }
}
