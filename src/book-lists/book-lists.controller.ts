import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { BookListsService } from '../book-lists/book-lists.service';
import { CreateBookListDto } from '../book-lists/create-booklists.dto'
import { UpdateBookListDto } from '../book-lists/update-booklists.dto';
import { UserStatusGuard } from 'src/auth/guard/status.guard';
@Controller('booklists')
export class BookListsController {
  constructor(private readonly bookListsService: BookListsService) {}

  @Post()
  @UseGuards(UserStatusGuard)
  create(@Body() createBookListDto: CreateBookListDto) {
    return this.bookListsService.create(createBookListDto);
  }

  @Get()
  @UseGuards(UserStatusGuard)
  findAll() {
    return this.bookListsService.findAll();
  }

  @Get(':id')
  @UseGuards(UserStatusGuard)
  findOne(@Param('id') id: number) {
    return this.bookListsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserStatusGuard)
  update(@Param('id') id: number, @Body() updateBookListDto: UpdateBookListDto) {
    return this.bookListsService.update(id, updateBookListDto);
  }

  @Delete(':id')
  @UseGuards(UserStatusGuard)
  remove(@Param('id') id: number) {
    return this.bookListsService.remove(id);
  }
}
