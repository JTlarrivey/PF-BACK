import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './create-forum.dto';
import { UpdateForumDto } from './update-forum.dto';
import { UserStatusGuard } from 'src/auth/guard/status.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('forums')
export class ForumsController {
    constructor(private readonly forumsService: ForumsService) {}

@Post()
@UseGuards(AuthGuard, UserStatusGuard)
    create(@Body() createForumDto: CreateForumDto) {
    return this.forumsService.create(createForumDto);
}

@Get()
@UseGuards(AuthGuard, UserStatusGuard)
    findAll() {
    return this.forumsService.findAll();
}

@Get(':id')
@UseGuards(AuthGuard, UserStatusGuard)
    findOne(@Param('id') id: string) {
    return this.forumsService.findOne(Number(id));
}

@Patch(':id')
@UseGuards(AuthGuard, UserStatusGuard)
    update(@Param('id') id: string, @Body() updateForumDto: UpdateForumDto) {
    return this.forumsService.update(Number(id), updateForumDto);
}

@Delete(':id')
@UseGuards(AuthGuard, UserStatusGuard)
    remove(@Param('id') id: string) {
    return this.forumsService.remove(Number(id));
}

}
