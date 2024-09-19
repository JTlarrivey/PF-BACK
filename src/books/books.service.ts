import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {

  constructor(private prisma: PrismaService) {}

  async getAllBooks(page: number, limit: number): Promise<{ data: Book[], totalPages: number }> {
    const skip = (page - 1) * limit;

    const [books, totalBooks] = await Promise.all([
      this.prisma.book.findMany({
        skip: skip,
        take: limit,
      }),
      this.prisma.book.count(), 
    ]);

    const totalPages = Math.ceil(totalBooks / limit);

    return {
      data: books,
      totalPages,
    };
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
