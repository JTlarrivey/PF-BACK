import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ForumCommentsService } from './forum-comments.service';
import { CreateForumCommentDto } from './create-forum-comment.dto';
import { UpdateForumCommentDto } from './update-forum-comment.dto';

@Controller('forum-comments')
export class ForumCommentsController {
    constructor(private readonly forumCommentsService: ForumCommentsService) {}

@Post()
    create(@Body() createForumCommentDto: CreateForumCommentDto) {
    return this.forumCommentsService.create(createForumCommentDto);
}

@Get()
    findAll() {
    return this.forumCommentsService.findAll();
}

@Get(':id')
    findOne(@Param('id') id: string) {
    return this.forumCommentsService.findOne(Number(id));
}

@Patch(':id')
    update(@Param('id') id: string, @Body() updateForumCommentDto: UpdateForumCommentDto) {
    return this.forumCommentsService.update(Number(id), updateForumCommentDto);
}

@Delete(':id')
    remove(@Param('id') id: string) {
    return this.forumCommentsService.remove(Number(id));
}

}
