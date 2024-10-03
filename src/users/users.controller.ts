import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards, ForbiddenException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { updateUserDto } from './updateUsers.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express'; 
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from './roles.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}
    
    @ApiBearerAuth()
    @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }
    
    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id') id: string) {
    const foundUser = await this.usersService.getUserById(Number(id));
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser; 
    }
    
    @ApiBearerAuth()
    @Get(':id/activity')
    async getUserActivity(@Param('id') id: string) {
    const userId = Number(id);
    return this.usersService.getUserActivity(userId);
}

    @Post()
    async createUser(@Body() data: Omit<User, 'user_id'>) {
        return this.usersService.createUser(data);
    }
    
    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard)
    async updateUser(
    @Param('id') id: string,
    @Body() data: updateUserDto
) {
    try {
    return await this.usersService.updateUser(Number(id), data);
    } catch (error) {
    if (error instanceof NotFoundException) {
    throw new NotFoundException('User does not exist');
    } else if (error.message.includes('El email ya está en uso')) {
    throw new NotFoundException('El email ya está en uso.');
    }
    throw error;
    } 
}

@ApiBearerAuth()
@Delete(':id')
async deleteUser(@Param('id') id: string) {
    try {
        const user = await this.usersService.deleteUser(Number(id));
        
        // Si el usuario ya estaba eliminado, lanzar una excepción
        if (!user) {
            throw new NotFoundException('User does not exist or is already deleted');
        }

        return {
            message: 'User deleted successfully'
        };
    } catch (error) {
        throw new NotFoundException('User does not exist');
        }
    }
    
    //Hacer un usuario Admin
    @ApiBearerAuth()
    @Put(':id/make-admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async makeUserAdmin(@Param('id') id: string, @Req() req: Request) {
        const adminUser = req.user as User;  

        // Verificación de que el usuario tiene el campo isAdmin
        if (!adminUser || !adminUser.isAdmin) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        try {
            const updatedUser = await this.usersService.updateUserRole(Number(id), true);
            return { message: 'User is now an admin', user: updatedUser };
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    @ApiBearerAuth()
    @Put(':id/remove-admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async removeUserAdmin(@Param('id') id: string, @Req() req: Request) {
        const adminUser = req.user as User;  

        // Verificación de que el usuario tiene el campo isAdmin
        if (!adminUser || !adminUser.isAdmin) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        try {
            const updatedUser = await this.usersService.updateUserRole(Number(id), false);
            return { message: 'User is not an admin any more', user: updatedUser };
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    // Ruta para que los administradores puedan ver el historial de un usuario
    @ApiBearerAuth()
    @Get(':id/history')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async getUserHistory(@Param('id') id: string) {
        const userId = Number(id);
        return this.usersService.getUserHistory(userId);

        }
    }


