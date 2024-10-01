import { Module } from '@nestjs/common';
import { ForumCommentsService } from './forum-comments.service';
import { ForumCommentsController } from './forum-comments.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ForumCommentsController],
  providers: [ForumCommentsService, PrismaService],
})
export class ForumCommentsModule {}
