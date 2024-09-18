import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';

@Controller('books')
export class BooksController {

  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAllBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    
    limit = limit > 50 ? 50 : limit;
    return this.booksService.getAllBooks(page, limit);
  }

  @Get(':id')
  async getBookById(@Param ('id') id: string){
    const foundBook = await this.booksService.getBookById(Number(id));
    if (!foundBook) throw new NotFoundException('Book not found')
    return foundBook;
  }

  @Post()
  async createBook(@Body() data: Book){
    return this.booksService.createBook(data);
  }

  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() data: Book){
    try {
      return await this.booksService.updateBook(Number(id), data);
    } catch (error) {
      throw new NotFoundException('Book does not exist')
    }
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string){
    try {
      return await this.booksService.deleteBook(Number(id));
    } catch (error) {
      throw new NotFoundException('Book does not exist')
    }
  }
}


