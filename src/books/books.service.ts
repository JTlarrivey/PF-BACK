import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Book } from '@prisma/client';


@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(page: number, limit: number): Promise<Book[]> {
    const skip = (page - 1) * limit;
    const take = parseInt(limit as any, 10);
    
    // Consulta a la base de datos con paginación
    return this.prisma.book.findMany({
      skip: skip,
      take: limit,
      include: {
        category: true
      }
    });
  }


  async getBookById(book_id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: {
        book_id
      }
    });
  }

  async createBook(data: Omit<Book, 'book_id'>): Promise<Book> {
    return this.prisma.book.create({
      data
    });
  }

  async updateBook(book_id: number, data: Partial<Omit<Book, 'book_id'>>): Promise<Book> {
    return this.prisma.book.update({
      where: {
        book_id
      },
      data
    });
  }

  async deleteBook(book_id: number): Promise<Book> {
    return this.prisma.book.delete({
      where: {
        book_id
      }
    });
  }
}
