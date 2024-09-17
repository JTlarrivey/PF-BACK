import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param ('id') id: string) {
        const foundUser = await this.usersService.getUserById(Number(id))
        if (!foundUser) throw new NotFoundException('User not found')
        return foundUser;
    }

    @Post()
    async createUsers(@Body() data: User) {
        return this.usersService.createUsers(data);
    }

    @Put(':id')
    async updateUsers(@Param('id') id: string, @Body() data: User) {
        try {
            return await this.usersService.updateUser(Number(id), data)
            
        } catch (error) {
            throw new NotFoundException('User does not exist')
            
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        try {
            return await this.usersService.deleteUser(Number(id))
            
        } catch (error) {
            throw new NotFoundException('User does not exist')
            
        }
    }
}
