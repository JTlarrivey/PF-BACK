import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { Book } from '@prisma/client';
import { CreateBookDto } from './createbook.dto';
import { UpdateBookDto } from './updatebook.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService, private readonly httpService: HttpService) {}


  // URL base de la API de Gutendex
  private readonly gutendexApiUrl = 'https://gutendex.com/books';

  // Método para llamar a la API de Gutendex
  async fetchExternalBooks(searchQuery?: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await axios.get(this.gutendexApiUrl, {
        params: {
          search: searchQuery,
          page: page,
        },
      });
      return response.data; // Devuelve los datos obtenidos de la API
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener libros de la API externa');
    }
  }

  // Método para combinar libros locales y externos
  async getAllBooksCombined(page: number, limit: number, searchQuery?: string): Promise<any> {
    try {
      // Libros locales desde Prisma
      const skip = (page - 1) * limit;
      const localBooks = await this.prisma.book.findMany({
        where: { isDeleted: false },
        skip: skip,
        take: limit,
        include: { categories: true },
      });

      // Libros externos desde Gutendex
      const externalBooks = await this.fetchExternalBooks(searchQuery, page, limit);

      // Combinar resultados (locales + externos)
      return {
        localBooks,
        externalBooks: externalBooks.results, // Ajustar según el formato de la API
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los libros combinados');
    }
  }

  // Mantengo aquí tus otros métodos para no perderlos.
  async totalBooks(): Promise<number> {
    try {
      const localBooksCount = await this.getLocalBooksCount();
      const apiBooksCount = await this.getAPIBooksCount();
      
      return localBooksCount + apiBooksCount;  // Sumar los totales
    } catch (error) {
      console.error('Error al calcular el total de libros:', error.message);
      throw new Error('Error al calcular el total de libros');
    }
  }

  async getLocalBooksCount(): Promise<number> {
    return await this.prisma.book.count(); // Cuenta libros en la base de datos local
  }

  async getAPIBooksCount(): Promise<number> {
    try {
      const response = await lastValueFrom(this.httpService.get('https://gutendex.com/books/?page=1'));
      // Retornamos solo el campo 'count' de la respuesta
      return response.data.count || 0;  // Si count es undefined, devolvemos 0
    } catch (error) {
      console.error('Error al obtener los libros de la API externa:', error.message);
      throw new Error('Error al obtener el número total de libros de la API externa');
    }
  }
  async getAllBooks(page: number, limit: number): Promise<{ books: Book[] }> {
    try {
      const skip = (page - 1) * limit;

      const books = await this.prisma.book.findMany({
        where: { isDeleted: false },
        skip: skip,
        take: limit,
        include: { categories: true },
      });

      return { books };
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

  async updateBook(book_id: number, data: UpdateBookDto): Promise<Book> {
    try {
      // Actualización de categorías, si están incluidas en la solicitud
      if (data.categories) {
        // Eliminar las categorías actuales
        await this.prisma.book.update({
          where: { book_id },
          data: {
            categories: {
              set: [], // Elimina todas las relaciones con categorías existentes
            },
          },
        });
  
        // Agregar las nuevas categorías
        await this.prisma.book.update({
          where: { book_id },
          data: {
            categories: {
              connect: data.categories.map((category) => ({
                id: category.id,
              })), 
            },
          },
        });
      }
  
      // Actualizar los demás campos del libro
      const updatedBook = await this.prisma.book.update({
        where: { book_id },
        data: {
          title: data.title,
          author: data.author,
          publication_year: data.publication_year,
          description: data.description,
          photoUrl: data.photoUrl,
        },
        include: {
          categories: true, 
        },
      });
  
      if (!updatedBook) throw new NotFoundException('Libro no encontrado');
      return updatedBook;
    } catch (error) {
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
  
      // Condiciones dinámicas para los filtros de título y autor
      const filters = [];
      if (title) {
        filters.push({ title: { contains: title, mode: 'insensitive' } });
      }
      if (author) {
        filters.push({ author: { contains: author, mode: 'insensitive' } });
      }
  
      // Consulta de libros, con o sin filtros
      return this.prisma.book.findMany({
        where: filters.length > 0 ? { OR: filters } : {}, // Si no hay filtros, se consulta todo
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
