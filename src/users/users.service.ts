import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { updateUserDto } from './updateUsers.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<Omit<User, 'password' | 'isAdmin'>[]> {
        const users = await this.prisma.user.findMany({
            where: { isDeleted: false },
            include: {
                bookLists: {
                    include: {
                        books: { // Incluyendo los libros de cada lista
                            include: {
                                book: { 
                                    select: {
                                        book_id: true,
                                        title: true,
                                        photoUrl: true,
                                    },
                                },
                            },
                        },
                    },
                },
                friends: true,
            },
        });
    
        return users.map(({ password, isAdmin, bookLists, friends, ...userWithoutSensitiveInfo }) => {
            const books = bookLists.flatMap(bookList => 
                bookList.books.map(bookListBook => ({
                    book_id: bookListBook.book.book_id,
                    title: bookListBook.book.title,
                    photoUrl: bookListBook.book.photoUrl,
                }))
            );
    
            return {
                ...userWithoutSensitiveInfo,
                book: books,
                friends: friends || [],
            };
        });
    }


    async getUserById(id: number): Promise<Omit<User, 'password' | 'isAdmin'> | null> {
        const user = await this.prisma.user.findUnique({
            where: { user_id: id },
        });
    
        if (!user) return null;
    
        const { password, isAdmin, ...userWithoutSensitiveInfo } = user; 
        return userWithoutSensitiveInfo;
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

    async updateUser(id: number, data: updateUserDto): Promise<Omit<User, 'password' | 'isAdmin'>> {
        if (data.password && typeof data.password === 'string') {
            data.password = await bcrypt.hash(data.password, 10);
        }
    
        try {
            const updatedUser = await this.prisma.user.update({
                where: { user_id: id },
                data,
            });
    
            const { password, isAdmin, ...userWithoutSensitiveInfo } = updatedUser;
            return userWithoutSensitiveInfo;
        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target.includes('email')) {
                throw new NotFoundException('El email ya está en uso.');
            }
            throw error;
        }
    }

    async deleteUser(id: number): Promise<Omit<User, 'password' | 'isAdmin'>> {
        // Marcar al usuario como eliminado lógicamente
        const deletedUser = await this.prisma.user.update({
            where: { user_id: id },
            data: { isDeleted: true },  // Aquí marcamos al usuario como eliminado
        });
    
        // Excluir la información sensible (password, isAdmin) del objeto devuelto
        const { password, isAdmin, ...userWithoutSensitiveInfo } = deletedUser;
        return userWithoutSensitiveInfo;
    }
}    