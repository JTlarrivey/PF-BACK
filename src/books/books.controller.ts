import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterBooksDto } from './books.dto';
import { UpdateDescriptionDto } from './updateDescription.dto'; // Importa el DTO


@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAllBooks(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<Book[]> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const validPage = isNaN(pageNum) ? 1 : pageNum;
    const validLimit = isNaN(limitNum) ? 10 : (limitNum > 50 ? 50 : limitNum);
    return this.booksService.getAllBooks(validPage, validLimit);
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    const foundBook = await this.booksService.getBookById(Number(id));
    if (!foundBook) throw new NotFoundException('Book not found');
    return foundBook;
  }

  @Post('filter')
  async filterBooks(@Body() filterBooksDto: FilterBooksDto): Promise<Book[]> {
    const { title, author, page, limit } = filterBooksDto;
    const pageNum = page ?? 1;
    const limitNum = limit ?? 10;
    return this.booksService.filterBooks(title, author, pageNum, limitNum);
  }
  
  @ApiBearerAuth()
  @Put(':id')
  async updateBook(@Param('id') id: string, @Body() data: Book) {
    try {
      return await this.booksService.updateBook(Number(id), data);
    } catch (error) {
      throw new NotFoundException('Book does not exist');
    }
  }

  @Post(':id/description') // Endpoint para actualizar la descripción
  async updateDescription(@Param('id') id: string, @Body() updateDescriptionDto: UpdateDescriptionDto) {
    return this.booksService.updateBookDescription(Number(id), updateDescriptionDto.description);
  }
  
  @ApiBearerAuth()
  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    try {
      return await this.booksService.deleteBook(Number(id));
    } catch (error) {
      throw new NotFoundException('Book does not exist');
    }
  }
}
