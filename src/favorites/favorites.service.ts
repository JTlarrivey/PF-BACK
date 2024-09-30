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

  async getUserFavorites(userId: number, requesterId: number): Promise<any> {
    try {
      // Verifica si requesterId y userId son amigos
      const isFriend = await this.prisma.follower.findFirst({
        where: {
          OR: [
            { follower_user_id: requesterId, followed_user_id: userId },
            { follower_user_id: userId, followed_user_id: requesterId }
          ]
        }
      });
  
      // Si no son amigos, deniega el acceso
      if (!isFriend) {
        throw new BadRequestException('You are not allowed to view this user\'s favorites or friends because you are not friends.');
      }
  
      // Si son amigos, obtiene los favoritos y amigos del usuario
      const user = await this.prisma.user.findUnique({
        where: { user_id: userId },
        include: {
          favorites: {
            include: {
              book: true,  // Incluye los detalles del libro favorito
            },
          },
          friends: true,  // Incluye la lista de amigos
        },
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      return {
        favoriteBooks: user.favorites.map(favorite => favorite.book), // Solo libros favoritos
        friends: user.friends,  // Lista de amigos
      };
    } catch (error) {
      throw new BadRequestException('Error retrieving user favorites');
    }
  }
}