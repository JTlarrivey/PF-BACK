import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ForbiddenException  } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { updateUserDto } from './updateUsers.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(page: number, limit: number): Promise<Omit<User, 'password' | 'isAdmin'>[]> {
        const skip = (page - 1) * limit;
    
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
            skip,
            take: limit,
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

        if (!user || user.isDeleted) {
            throw new NotFoundException('Usuario no encontrado o eliminado.');
        }

        const { password, isAdmin, ...userWithoutSensitiveInfo } = user;
        return userWithoutSensitiveInfo;
    }

    async getUserActivity(userId: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { user_id: userId },
        });

        // Validación de estado del usuario
        if (!user || user.isDeleted || user.isBanned) {
            throw new ForbiddenException('Tu cuenta está deshabilitada o baneada.');
        }

        const reviews = await this.prisma.review.findMany({
            where: { user_id: userId },
            include: { book: true },
            orderBy: { review_date: 'desc' },
            take: 5, 
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

    async searchUsers(name?: string, email?: string, page: number = 1, limit: number = 10): Promise<User[]> {
        const skip = (page - 1) * limit;
    
        const filters = [];
        if (name) {
            filters.push({ name: { contains: name, mode: 'insensitive' } });
        }
        if (email) {
            filters.push({ email: { contains: email, mode: 'insensitive' } });
        }
    
        try {
            return await this.prisma.user.findMany({
            where: {
                isDeleted: false,  
                OR: filters.length > 0 ? filters : undefined,
            },
            skip,
            take: limit,
            });
        } catch (error) {
            console.error(error);  
            throw new InternalServerErrorException('Error al obtener los usuarios');
        }
    }

    async createUser(data: Omit<User, 'user_id'>): Promise<User> {
        // No se requiere validación aquí porque es para la creación de un usuario nuevo
        return this.prisma.user.create({ data });
    }

    async updateUser(id: number, data: updateUserDto, currentUser: User): Promise<Omit<User, 'password' | 'isAdmin'>> {
        const user = await this.prisma.user.findUnique({
            where: { user_id: id },
        });
    
        // Validación de estado del usuario antes de permitir la actualización
        if (!user) {
            throw new NotFoundException('Usuario no encontrado.');
        }
    
        // Permitir a un admin modificar usuarios baneados o eliminados
        if ((user.isDeleted || user.isBanned) && !currentUser.isAdmin) {
            throw new ForbiddenException('No puedes modificar este perfil porque la cuenta está deshabilitada o baneada.');
        }
    
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
    

    async deleteUser(id: number, banUser: boolean = false): Promise<Omit<User, 'password' | 'isAdmin'>> {
        // Verificar si el usuario ya está eliminado o no existe
        const user = await this.prisma.user.findUnique({
            where: { user_id: id },
        });
    
        if (!user || user.isDeleted) {
            throw new NotFoundException('Usuario ya ha sido eliminado.');
        }
    
        // Definir los datos que se actualizarán dependiendo de si es eliminación lógica o baneo
        const updateData = banUser ? { isBanned: true } : { isDeleted: true };
    
        // Actualizar el estado del usuario (baneado o eliminado)
        const updatedUser = await this.prisma.user.update({
            where: { user_id: id },
            data: updateData,
        });
    
        const { password, isAdmin, ...userWithoutSensitiveInfo } = updatedUser;
        return userWithoutSensitiveInfo;
    }
    

     // Encuentra un usuario por ID
    async findUserById(user_id: number): Promise<User | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { user_id: Number(user_id) },
            });
        } catch (error) {
            throw new NotFoundException('Usuario no encontrado');
        }
    }

    // Actualiza el rol de administrador del usuario
    async updateUserRole(user_id: number, isAdmin: boolean): Promise<User> {
        try {
            return await this.prisma.user.update({
                where: { user_id: Number(user_id) },
                data: { isAdmin },
            });
        } catch (error) {
            throw new BadRequestException('No se pudo actualizar el rol del usuario');
        }
    }

    async updateUserBanStatus(user_id: number, isBanned: boolean): Promise<User> {
        try {
            return await this.prisma.user.update({
                where: { user_id: Number(user_id) },
                data: { isBanned },
            });
        } catch (error) {
            throw new BadRequestException('No se pudo actualizar el estado de baneo del usuario');
        }
    }


    async getUserHistory(user_id: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { user_id: Number(user_id)},
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
            throw new NotFoundException('Usuario no encontrado o eliminado.');
       }
    }
}