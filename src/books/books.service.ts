import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService, 
  ) {}

  async getAllBooks(page: number, limit: number): Promise<any> {
    const searchQuery = 'pride and prejudice'; 
    const apiUrl = `https://gutendex.com/books/?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`;

    // Realizar la solicitud a la API externa usando Axios a través de HttpService
    const response = await lastValueFrom(this.httpService.get(apiUrl));

    return response.data;
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
