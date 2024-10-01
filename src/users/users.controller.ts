import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { updateUserDto } from './updateUsers.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

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
    }