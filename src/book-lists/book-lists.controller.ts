import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { BookListsService } from '../book-lists/book-lists.service';
import { CreateBookListDto } from '../book-lists/create-booklists.dto'
import { UpdateBookListDto } from '../book-lists/update-booklists.dto';
@Controller('booklists')
export class BookListsController {
  constructor(private readonly bookListsService: BookListsService) {}

  @Post()
  create(@Body() createBookListDto: CreateBookListDto) {
    return this.bookListsService.create(createBookListDto);
  }

  @Get()
  findAll() {
    return this.bookListsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookListsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookListDto: UpdateBookListDto) {
    return this.bookListsService.update(id, updateBookListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookListsService.remove(id);
  }
}
