import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { updateUserDto } from './updateUsers.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<Omit<User, 'password' | 'isAdmin'>[]> {
        try {
            const users = await this.prisma.user.findMany({
                where: { isDeleted: false },
                include: {
                    bookLists: {
                        include: {
                            books: { 
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
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener los usuarios');
        }
    }

    async getUserById(id: number): Promise<Omit<User, 'password' | 'isAdmin'> | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { user_id: id },
            });

            if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);

            const { password, isAdmin, ...userWithoutSensitiveInfo } = user;
            return userWithoutSensitiveInfo;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error al obtener el usuario por id');
        }
    }

    async getUserActivity(userId: number): Promise<any> {
        try {
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

            return { reviews, forumComments };
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la actividad del usuario');
        }
    }

    async createUser(data: Omit<User, 'user_id'>): Promise<User> {
        try {
            const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });

            if (existingUser) throw new BadRequestException('El correo electrónico ya está registrado');

            return await this.prisma.user.create({ data });
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException('Error al crear el usuario');
        }
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
                throw new BadRequestException('El correo electrónico ya está en uso.');
            } else if (error.code === 'P2025') {
                throw new NotFoundException(`Usuario con id ${id} no encontrado para actualizar.`);
            } else {
                throw new InternalServerErrorException('Error al actualizar el usuario');
            }
        }
    }

    async deleteUser(id: number): Promise<Omit<User, 'password' | 'isAdmin'>> {
        try {
            const deletedUser = await this.prisma.user.update({
                where: { user_id: id },
                data: { isDeleted: true },  // Aquí marcamos al usuario como eliminado
            });

            const { password, isAdmin, ...userWithoutSensitiveInfo } = deletedUser;
            return userWithoutSensitiveInfo;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Usuario con id ${id} no encontrado para eliminar.`);
            } else {
                throw new InternalServerErrorException('Error al eliminar el usuario');
            }
        }
    }
    
    // Método para actualizar el rol de un usuario
    async updateUserRole(user_id: number, isAdmin: boolean): Promise<User> {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { user_id },
                data: { isAdmin },
            });

            return updatedUser;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Usuario con id ${user_id} no encontrado para actualizar el rol.`);
            } else {
                throw new InternalServerErrorException('Error al actualizar el rol del usuario');
            }
        }
    }
    
    // Método para obtener el historial de un usuario
    async getUserHistory(userId: number): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { user_id: userId },
                include: {
                    reviews: {
                        where: { isDeleted: false },
                        select: {
                            review_id: true,
                            content: true,
                            rating: true,
                            review_date: true,
                            book: {
                                select: {
                                    title: true,
                                    book_id: true,
                                }
                            },
                        }
                    },
                }
            });

            if (!user || user.isDeleted) {
                throw new NotFoundException('Usuario no encontrado o eliminado');
            }

            const { password, isAdmin, ...userData } = user;
            return {
                user: userData,
                reviews: user.reviews,
            };
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Usuario con id ${userId} no encontrado.`);
            } else {
                throw new InternalServerErrorException('Error al obtener el historial del usuario');
            }
        }
    }
}

