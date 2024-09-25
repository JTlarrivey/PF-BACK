import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { updateUserDto } from './updateUsers.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
    const foundUser = await this.usersService.getUserById(Number(id));
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser; 
    }

    @Get(':id/activity')
    async getUserActivity(@Param('id') id: string) {
    const userId = Number(id);
    return this.usersService.getUserActivity(userId);
}

    @Post()
    async createUser(@Body() data: Omit<User, 'user_id'>) {
        return this.usersService.createUser(data);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() data: updateUserDto) {
    try {
        return await this.usersService.updateUser(Number(id), data);
    } catch (error) {
        throw new NotFoundException('User does not exist');
    }
}

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        try {
            return await this.usersService.deleteUser(Number(id));
        } catch (error) {
            throw new NotFoundException('User does not exist');
        }
    }
}
