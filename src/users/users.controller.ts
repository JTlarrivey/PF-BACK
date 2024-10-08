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
    async updateUser(@Param('id') id: string, @Body() data: updateUserDto) {
        try {
            return await this.usersService.updateUser(Number(id), data);
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
    @Put(':id/make-admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async makeUserAdmin(@Param('id') id: string, @Req() req: Request) {
        const adminUser = req.user as User;
        if (!adminUser?.isAdmin) throw new ForbiddenException('No tienes permiso para realizar esta acción');

        try {
            const updatedUser = await this.usersService.updateUserRole(Number(id), true);
            return { message: 'El usuario ahora es administrador', user: updatedUser };
        } catch (error) {
            throw new BadRequestException('Error al promover al usuario a administrador');
        }
    }

    @ApiBearerAuth()
    @Put(':id/remove-admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async removeUserAdmin(@Param('id') id: string, @Req() req: Request) {
        const adminUser = req.user as User;
        if (!adminUser?.isAdmin) throw new ForbiddenException('No tienes permiso para realizar esta acción');

        try {
            const updatedUser = await this.usersService.updateUserRole(Number(id), false);
            return { message: 'El usuario ya no es administrador', user: updatedUser };
        } catch (error) {
            throw new BadRequestException('Error al remover el rol de administrador del usuario');
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
}