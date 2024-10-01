import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './create-forum.dto';
import { UpdateForumDto } from './update-forum.dto';

@Controller('forums')
export class ForumsController {
    constructor(private readonly forumsService: ForumsService) {}

@Post()
    create(@Body() createForumDto: CreateForumDto) {
    return this.forumsService.create(createForumDto);
}

@Get()
    findAll() {
    return this.forumsService.findAll();
}

@Get(':id')
    findOne(@Param('id') id: string) {
    return this.forumsService.findOne(Number(id));
}

@Patch(':id')
    update(@Param('id') id: string, @Body() updateForumDto: UpdateForumDto) {
    return this.forumsService.update(Number(id), updateForumDto);
}

@Delete(':id')
    remove(@Param('id') id: string) {
    return this.forumsService.remove(Number(id));
}

}
