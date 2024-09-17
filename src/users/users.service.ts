import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async getUserById(id: number): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async createUsers(data: User): Promise<User> {
        return this.prisma.user.create({data});
    }

    async updateUser(id: number, data: User): Promise<User> {
        return this.prisma.user.update({
            where:{
            id
        },
        data
    })

    }

    async deleteUser(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: {
                id
            }
        });
    }

}
