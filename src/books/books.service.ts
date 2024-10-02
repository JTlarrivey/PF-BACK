import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';
import { CreateBookDto } from './createbook.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(page: number, limit: number): Promise<Book[]> {
    const skip = (page - 1) * limit;
    const take = parseInt(limit as any, 10);
    
    // Consulta a la base de datos con paginación
    return this.prisma.book.findMany({
      where: { isDeleted: false },
      skip: skip,
      take: limit,
      include: {
        categories: true
      }
    });
  }

  async getBookById(book_id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: {
        book_id
      },
      include: {
        categories: true, // Incluye las categorías asociadas al libross
      },
    });
  }
  
  // async createBook(data: Omit<Book, 'book_id'>): Promise<Book> {
  //   return this.prisma.book.create({
  //     data
  //   });
  // }

  async updateBook(book_id: number, data: Partial<Omit<Book, 'book_id'>>): Promise<Book> {
    return this.prisma.book.update({
      where: {
        book_id
      },
      data
    });
  }

  async deleteBook(book_id: number): Promise<Omit<Book, 'isDeleted'>> {
    const deletedBook = await this.prisma.book.update({
        where: {
            book_id
        },
        data: {
            isDeleted: true // Marcamos el libro como eliminado
        }
    });

    // Excluir el campo isDeleted del objeto devuelto, si es necesario
    const { isDeleted, ...bookWithoutIsDeleted } = deletedBook;
    return bookWithoutIsDeleted;
}


  async filterBooks(title?: string, author?: string, page: number = 1, limit: number = 10): Promise<Book[]> {
    const skip = (page - 1) * limit;
    const take = parseInt(limit as any, 10);

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
  }

  // Nueva función para actualizar solo la descripción
  async updateBookDescription(book_id: number, description: string): Promise<Book> {
    return this.prisma.book.update({
      where: { book_id },
      data: { description }, // Actualiza solo la descripción
    });
  }
  
  //ADMIN 
  async createBook(data: CreateBookDto): Promise<Book> {
    // Verificar que data.categories existe y es un array
    if (!Array.isArray(data.categories)) {
      throw new Error('categories debe ser un array');
    }
  
    // Filtrar solo las categorías que tengan un id definido
    const validCategories = data.categories
      .filter(category => category.id !== undefined)
      .map(category => ({
        id: category.id,
      }));
  
    return this.prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        photoUrl: data.photoUrl,
        author: data.author,
        publication_year: data.publication_year,
        categories: {
          connect: validCategories, // Solo conectar categorías válidas
        },
      },
      include: {
        categories: true,
      },
    });
  }
}
