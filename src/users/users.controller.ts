import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards, ForbiddenException, Req, UseInterceptors, UploadedFile, InternalServerErrorException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { updateUserDto } from './updateUsers.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express'; 
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from './roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { BadRequestException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserStatusGuard } from 'src/auth/guard/status.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        private readonly fileUploadService: FileUploadService
    ) {}
    
@ApiBearerAuth()
@Get()
    async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10', 
    ): Promise<Omit<User, 'password' | 'isAdmin'>[]> {
    try {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const validPage = isNaN(pageNum) ? 1 : pageNum;
    const validLimit = isNaN(limitNum) ? 10 : (limitNum > 50 ? 50 : limitNum);

    return await this.usersService.getUsers(validPage, validLimit);
    } catch (error) {
    throw new BadRequestException('No se encontraron usuarios');
    }
}

@ApiBearerAuth()
@Get(':id')
@UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string) {
        try {
            const foundUser = await this.usersService.getUserById(Number(id));
            if (!foundUser) throw new NotFoundException('Usuario no encontrado');
            return foundUser;
        } catch (error) {
            throw error instanceof NotFoundException ? error : new BadRequestException('Error al obtener el usuario');
        }
}

@ApiBearerAuth()
@Get(':id/activity')
    async getUserActivity(@Param('id') id: string) {
        try {
            const userId = Number(id);
            return await this.usersService.getUserActivity(userId);
        } catch (error) {
            throw new BadRequestException('Error al obtener la actividad del usuario');
        }
}

@Post('search')
@UseGuards(AuthGuard, UserStatusGuard)
    async searchUsers(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
    ): Promise<User[]> {
        try {
        const pageNum = page ? Number(page) : 1;
        const limitNum = limit ? Number(limit) : 10;
        return await this.usersService.searchUsers(name, email, pageNum, limitNum);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener los usuarios'); 
        }
}

@Post()
    async createUser(@Body() data: Omit<User, 'user_id'>) {
        try {
            return await this.usersService.createUser(data);
        } catch (error) {
            throw new BadRequestException('Error al crear el usuario');
        }
}

@ApiBearerAuth()
@Put(':id')
@UseGuards(AuthGuard)
async updateUser(@Param('id') id: string, @Body() data: updateUserDto, @Req() req) {
    try {
        const currentUser = req.user; // Obtener el usuario autenticado
        return await this.usersService.updateUser(Number(id), data, currentUser); // Pasar el usuario actual al servicio
    } catch (error) {
        if (error instanceof NotFoundException) {
            throw new NotFoundException('El usuario no existe');
        } else if (error.message.includes('El email ya está en uso')) {
            throw new ConflictException('El email ya está en uso');
        }

        throw new BadRequestException('Error al actualizar el usuario');
    }
}

@ApiBearerAuth()
@Delete(':id')
    async deleteUser(@Param('id') id: string) {
        try {
            const user = await this.usersService.deleteUser(Number(id));
            if (!user) throw new NotFoundException('El usuario no existe o ya ha sido eliminado');
            return { message: 'Usuario eliminado con éxito' };
        } catch (error) {
            throw error instanceof NotFoundException ? error : new BadRequestException('Error al eliminar el usuario');
        }
}

    
@ApiBearerAuth()
@Get(':id/history')
@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
    async getUserHistory(@Param('id') id: string) {
        try {
            const userId = Number(id);
            return await this.usersService.getUserHistory(userId);
        } catch (error) {
            throw new BadRequestException('Error al obtener el historial del usuario');
        }
}

@ApiBearerAuth()
@Put('profile/:id/upload-photo')
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor('file'))
    async uploadUserPhoto(
        @UploadedFile() file: Express.Multer.File,
        @Param('id') id: string,
        @Req() req: Request,
        ) { 
        const user = req.user as User;
        
       // Verificar que el ID del usuario está presente
        if (!id) {
        throw new BadRequestException('El ID del usuario es obligatorio');
        }

       // Verificar si el usuario tiene permiso para actualizar su foto
        if (!user || user.user_id !== Number(id)) {
        throw new ForbiddenException('No tienes permiso para realizar esta acción');
        }

      // Verificar si se ha subido un archivo
        if (!file) {
        throw new BadRequestException('No se ha subido ningún archivo');
        }

        try {
        // Llama al servicio para subir la imagen
        const updatedUser = await this.fileUploadService.uploadImage(file, id);
        return { message: 'Foto subida exitosamente', user: updatedUser };
        } catch (error) { 
        throw new InternalServerErrorException('Error al subir la foto del usuario');
       }
}


@Post('book-list/:bookId')
async addBookToUserList(@Param('bookId') bookId: number, @Body('userId') userId: number) {
    return this.usersService.addBookToUserList(userId, bookId);
}

@Post('add-follower')
async addFollower(@Body() body: { userId: number; followedId: number }) {
    // Asegúrate de que userId y followedId estén definidos
    if (!body.userId || !body.followedId) {
    throw new BadRequestException('userId y followedId son requeridos.');
    }
    return this.usersService.addFollower(body.userId, body.followedId);
}


@ApiBearerAuth()
@Put(':id/toggle-ban')
@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
async toggleUserBan(@Param('id') id: string, @Req() req: Request) {
    const adminUser = req.user as User;
    if (!adminUser?.isAdmin) {
        throw new ForbiddenException('No tienes permiso para realizar esta acción');
    }

    try {
        const user = await this.usersService.findUserById(Number(id));
        const newIsBannedStatus = !user.isBanned;
        const updatedUser = await this.usersService.updateUserBanStatus(Number(id), newIsBannedStatus);

        return {
            message: newIsBannedStatus ? 'El usuario ha sido baneado' : 'El usuario ya no está baneado',
            user: updatedUser
        };
    } catch (error) {
        throw new BadRequestException('Error al cambiar el estado de baneo del usuario');
    }
}

@ApiBearerAuth()
    @Put(':id/toggle-admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async toggleUserAdmin(@Param('id') id: string, @Req() req: Request) {
        const adminUser = req.user as User;
        if (!adminUser?.isAdmin) {
            throw new ForbiddenException('No tienes permiso para realizar esta acción');
        }
    
        try {
            const user = await this.usersService.findUserById(Number(id));
            const newIsAdminStatus = !user.isAdmin;
            const updatedUser = await this.usersService.updateUserRole(Number(id), newIsAdminStatus);
    
            return {
                message: newIsAdminStatus ? 'El usuario ahora es administrador' : 'El usuario ya no es administrador',
                user: updatedUser
            };
        } catch (error) {
            throw new BadRequestException('Error al cambiar el rol de administrador del usuario');
        }
    } 
    @ApiBearerAuth()
@Get(':id/books')
@UseGuards(AuthGuard)
async getUserBooks(@Param('id') id: string) {
    try {
        const userId = Number(id);
        const books = await this.usersService.getUserBooks(userId);
        if (!books) throw new NotFoundException('No se encontraron libros para este usuario');
        return books;
    } catch (error) {
        throw new BadRequestException('Error al obtener los libros del usuario');
    }
}


}