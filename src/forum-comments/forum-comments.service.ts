import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateForumCommentDto } from './create-forum-comment.dto';
import { UpdateForumCommentDto } from './update-forum-comment.dto';

@Injectable()
export class ForumCommentsService {
    constructor(private prisma: PrismaService) {}

async create(createForumCommentDto: CreateForumCommentDto) {
    return this.prisma.forumComment.create({
        data: {
        content: createForumCommentDto.content,
        forum: { connect: { forum_id: createForumCommentDto.forum_id } },
        user: { connect: { user_id: createForumCommentDto.user_id } },
        comment_date: new Date(), // Establece la fecha de creación
        },
    });
}

async findAll() {
    return this.prisma.forumComment.findMany({
        where: { isDeleted: false },
    });
}

async findOne(id: number) {
    const forumComment = await this.prisma.forumComment.findFirst({
        where: {
        comment_id: id,
        isDeleted: false,
        },
    });

    if (!forumComment) {
        throw new NotFoundException(`ForumComment with ID ${id} not found`);
    }

    return forumComment;
}

async update(id: number, updateForumCommentDto: UpdateForumCommentDto) {
    const forumComment = await this.prisma.forumComment.findUnique({
        where: { comment_id: id },
    });

    if (!forumComment) {
        throw new NotFoundException(`ForumComment with ID ${id} not found`);
    }

    return this.prisma.forumComment.update({
        where: { comment_id: id },
        data: {
            ...(updateForumCommentDto.content && { content: updateForumCommentDto.content }),
        },
    });
}

async remove(id: number): Promise<void> {
    await this.prisma.forumComment.update({
        where: { comment_id: id },
        data: { isDeleted: true },
        });
    }
}
