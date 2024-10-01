import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateForumDto } from './create-forum.dto';
import { UpdateForumDto } from './update-forum.dto';

@Injectable()
export class ForumsService {
    constructor(private prisma: PrismaService) {}

async create(createForumDto: CreateForumDto) {
    return this.prisma.forum.create({
    data: {
        topic: createForumDto.topic,
        description: createForumDto.description,
        creation_date: new Date(), // Establece la fecha de creación
        },
    });
}

async findAll() {
    return this.prisma.forum.findMany({
        where: { isDeleted: false },
    });
}

async findOne(id: number) {
    const forum = await this.prisma.forum.findFirst({
        where: {
        forum_id: id,
        isDeleted: false,
        },
    });

    if (!forum) {
        throw new NotFoundException(`Forum with ID ${id} not found`);
    }

    return forum;
}

async update(id: number, updateForumDto: UpdateForumDto) {
    const forum = await this.prisma.forum.findUnique({
        where: { forum_id: id },
    });

    if (!forum) {
        throw new NotFoundException(`Forum with ID ${id} not found`);
    }

    return this.prisma.forum.update({
        where: { forum_id: id },
        data: {
        ...(updateForumDto.topic && { topic: updateForumDto.topic }),
        ...(updateForumDto.description && { description: updateForumDto.description }),
        },
    });
}

async remove(id: number): Promise<void> {
    await this.prisma.forum.update({
        where: { forum_id: id },
        data: { isDeleted: true },
        });
    }
}
