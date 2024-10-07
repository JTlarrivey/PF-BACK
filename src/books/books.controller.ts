import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Query, Req, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterBooksDto } from './books.dto';
import { UpdateDescriptionDto } from './updateDescription.dto'; 
import { CreateBookDto } from './createbook.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/users/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserStatusGuard } from 'src/auth/guard/status.guard';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @UseGuards(AuthGuard, UserStatusGuard)
  async getAllBooks(
  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
  ): Promise<{ books: Book[], totalBooks: number }> {
  try {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const validPage = isNaN(pageNum) ? 1 : pageNum;
    const validLimit = isNaN(limitNum) ? 10 : (limitNum > 50 ? 50 : limitNum);

    const { books, totalBooks } = await this.booksService.getAllBooks(validPage, validLimit);

    return { books, totalBooks };
  } catch (error) {
    throw new InternalServerErrorException('Error al recuperar los libros');
  }
}

  @Get(':id')
  @UseGuards(UserStatusGuard)
  async getBookById(@Param('id') id: string) {
    try {
      const foundBook = await this.booksService.getBookById(Number(id));
      if (!foundBook) throw new NotFoundException('Libro no encontrado');
      return foundBook;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al recuperar el libro');
    }
  }

  @Post('filter')
  // @UseGuards(UserStatusGuard)
  async filterBooks(
  @Query('title') title?: string, 
  @Query('author') author?: string, 
  @Query('page') page?: number, 
  @Query('limit') limit?: number
  ): Promise<Book[]> {
  try {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return await this.booksService.filterBooks(title, author, pageNum, limitNum);
  } catch (error) {
    throw new InternalServerErrorException('Error al filtrar los libros');
  }
}
  
  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(UserStatusGuard)
  async updateBook(@Param('id') id: string, @Body() data: Book) {
    try {
      return await this.booksService.updateBook(Number(id), data);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el libro');
    }
  }


  // Endpoint para actualizar la descripción
  @Post(':id/description')
  @UseGuards(UserStatusGuard)
  async updateDescription(@Param('id') id: string, @Body() updateDescriptionDto: UpdateDescriptionDto) {
    try {
      return await this.booksService.updateBookDescription(Number(id), updateDescriptionDto.description);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la descripción');
    }
  }
  
  //Alta de libro-Admin


  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard, UserStatusGuard)
  async createBook(
    @Body() createBookDto: CreateBookDto, 
    @Req() req 
  ) {
    try {
      const user = req.user;
      if (!user || !user.isAdmin) {
        throw new ForbiddenException('No tienes permiso para realizar esta acción');
      }
      return await this.booksService.createBook(createBookDto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el libro');
    }

  }
  
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(UserStatusGuard)
  async deleteBook(@Param('id') id: string) {
    try {
      await this.booksService.deleteBook(Number(id));
      return { message: 'Libro eliminado con éxito' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el libro');
    }
  }
}