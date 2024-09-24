import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserResponseDto } from './userResponseDto';
import * as bcrypt from 'bcrypt';
import { updateUserDto } from './updateUsers.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async getUserById(id: number): Promise<UserResponseDto | null> {
        const user = await this.prisma.user.findUnique({
        where: { user_id: id },
        });
    
        if (!user) return null;
    
        const { password, ...userWithoutPassword } = user; // Remover la contraseña
        return userWithoutPassword;
    }

    async getUserActivity(userId: number): Promise<any> {
        const reviews = await this.prisma.review.findMany({
            where: { user_id: userId },
            include: { book: true },
            orderBy: { review_date: 'desc' },
            take: 5, // Limitar a las 5 actividades más recientes
        });
    
        const forumComments = await this.prisma.forumComment.findMany({
            where: { user_id: userId },
            include: { forum: true },
            orderBy: { comment_date: 'desc' },
            take: 5,
        });
    
        return {
            reviews,
            forumComments,
        };
    }

    async createUser(data: Omit<User, 'user_id'>): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async updateUser(id: number, data: updateUserDto): Promise<User> {
        if (data.password) {
            // Encriptar la nueva contraseña si es que se está actualizando
            data.password = await bcrypt.hash(data.password, 10);
        }
    
        return this.prisma.user.update({
            where: { user_id: id },
            data,
        });
    }

    async deleteUser(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { user_id: id },
        });
    }
}
