import { Module } from '@nestjs/common';
import { ForumCommentsController } from './forum-comments.controller';
import { ForumCommentsService } from './forum-comments.service';

@Module({
  controllers: [ForumCommentsController],
  providers: [ForumCommentsService]
})
export class ForumCommentsModule {}
