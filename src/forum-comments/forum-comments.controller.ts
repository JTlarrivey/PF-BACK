import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ForumCommentsService } from './forum-comments.service';
import { CreateForumCommentDto } from './create-forum-comment.dto';
import { UpdateForumCommentDto } from './update-forum-comment.dto';
import { UserStatusGuard } from 'src/auth/guard/status.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('forum-comments')
export class ForumCommentsController {
    constructor(private readonly forumCommentsService: ForumCommentsService) {}

@Post()
@UseGuards(AuthGuard, UserStatusGuard)
    create(@Body() createForumCommentDto: CreateForumCommentDto) {
    return this.forumCommentsService.create(createForumCommentDto);
}

@Get()
@UseGuards(AuthGuard, UserStatusGuard)
    findAll() {
    return this.forumCommentsService.findAll();
}

@Get(':id')
@UseGuards(AuthGuard, UserStatusGuard)
    findOne(@Param('id') id: string) {
    return this.forumCommentsService.findOne(Number(id));
}

@Patch(':id')
@UseGuards(AuthGuard, UserStatusGuard)
    update(@Param('id') id: string, @Body() updateForumCommentDto: UpdateForumCommentDto) {
    return this.forumCommentsService.update(Number(id), updateForumCommentDto);
}

@Delete(':id')
@UseGuards(AuthGuard, UserStatusGuard)
    remove(@Param('id') id: string) {
    return this.forumCommentsService.remove(Number(id));
}

}
