import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';
import { CreateBookDto } from './createbook.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async totalBooks(): Promise<number> {
    try {
      return await this.prisma.book.count({
        where: { isDeleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to count the books');
    }
  }

  async getAllBooks(page: number, limit: number): Promise<Book[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.prisma.book.findMany({
        where: { isDeleted: false },
        skip: skip,
        take: limit,
        include: {
          categories: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('No se pudieron recuperar los libros');
    }
  }

  async getBookById(book_id: number): Promise<Book | null> {
    try {
      const book = await this.prisma.book.findUnique({
        where: { book_id },
        include: { categories: true },
      });
      if (!book) throw new NotFoundException('Libro no encontrado');
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al recuperar el libro');
    }
  }

  async updateBook(book_id: number, data: Partial<Omit<Book, 'book_id'>>): Promise<Book> {
    try {
      const book = await this.prisma.book.update({
        where: { book_id },
        data,
      });
      if (!book) throw new NotFoundException('Libro no encontrado');
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el libro');
    }
  }

  async deleteBook(book_id: number): Promise<Omit<Book, 'isDeleted'>> {
    try {
      const deletedBook = await this.prisma.book.update({
        where: { book_id },
        data: { isDeleted: true },
      });
      const { isDeleted, ...bookWithoutIsDeleted } = deletedBook;
      return bookWithoutIsDeleted;
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el libro');
    }
  }

  async filterBooks(title?: string, author?: string, page: number = 1, limit: number = 10): Promise<Book[]> {
    try {
      const skip = (page - 1) * limit;
      return this.prisma.book.findMany({
        where: {
          AND: [
            title ? { title: { contains: title, mode: 'insensitive' } } : {},
            author ? { author: { contains: author, mode: 'insensitive' } } : {},
          ],
        },
        skip: skip,
        take: limit,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al filtrar los libros');
    }
  }
  //Nueva funcion para actualizar solo la descripcion
  async updateBookDescription(book_id: number, description: string): Promise<Book> {
    try {
      return this.prisma.book.update({
        where: { book_id },
        data: { description },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la descripción');
    }
  }
  //ADMIN
  async createBook(data: CreateBookDto): Promise<Book> {
    try {
      if (!Array.isArray(data.categories)) {
        throw new InternalServerErrorException('Las categorías deben ser un arreglo');
      }
      //Filtrar solo las categorias que tengan un id definido
      const validCategories = data.categories
        .filter(category => category.id !== undefined)
        .map(category => ({ id: category.id }));

      return await this.prisma.book.create({
        data: {
          title: data.title,
          description: data.description,
          photoUrl: data.photoUrl,
          author: data.author,
          publication_year: data.publication_year,
          categories: {
            connect: validCategories,
          },
        },
        include: {
          categories: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el libro');
    }
  }
}
