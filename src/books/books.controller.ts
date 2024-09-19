import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {

  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAllBooks(
    @Query('page') page: string = '1',  // Recibe como string por defecto
    @Query('limit') limit: string = '10',  // Recibe como string por defecto
  ): Promise<Book[]> {
    const pageNum = parseInt(page, 10);   // Convertir a número
    const limitNum = parseInt(limit, 10); // Convertir a número
    const validPage = isNaN(pageNum) ? 1 : pageNum;
    const validLimit = isNaN(limitNum) ? 10 : (limitNum > 50 ? 50 : limitNum);
    return this.booksService.getAllBooks(validPage, validLimit);
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


