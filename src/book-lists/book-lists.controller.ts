import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { BookListsService } from '../book-lists/book-lists.service';
import { CreateBookListDto } from '../book-lists/create-booklists.dto'
import { UpdateBookListDto } from '../book-lists/update-booklists.dto';
import { UserStatusGuard } from 'src/auth/guard/status.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('booklists')
export class BookListsController {
  constructor(private readonly bookListsService: BookListsService) {}

  @Post()
  @UseGuards(AuthGuard, UserStatusGuard)
  create(@Body() createBookListDto: CreateBookListDto) {
    return this.bookListsService.create(createBookListDto);
  }

  @Get()
  @UseGuards(AuthGuard, UserStatusGuard)
  findAll() {
    return this.bookListsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, UserStatusGuard)
  findOne(@Param('id') id: number) {
    return this.bookListsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, UserStatusGuard)
  update(@Param('id') id: number, @Body() updateBookListDto: UpdateBookListDto) {
    return this.bookListsService.update(id, updateBookListDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, UserStatusGuard)
  remove(@Param('id') id: number) {
    return this.bookListsService.remove(id);
  }
}
