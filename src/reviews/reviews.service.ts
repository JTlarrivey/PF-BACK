import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './createReview.dto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: CreateReviewDto): Promise<Review> {
    try {
      // Validar si el usuario o libro existen
      const user = await this.prisma.user.findUnique({ where: { user_id: data.user_id } });
      const book = await this.prisma.book.findUnique({ where: { book_id: data.book_id } });

      if (!user) {
        throw new BadRequestException('El usuario especificado no existe.');
      }
      if (!book) {
        throw new BadRequestException('El libro especificado no existe.');
      }

      return await this.prisma.review.create({
        data: {
          content: data.content,
          rating: data.rating,
          review_date: new Date(),
          user: { connect: { user_id: data.user_id } },
          book: { connect: { book_id: data.book_id } },
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la review.');
    }
  }

  // Método para obtener todas las reviews
  async getReviews() {
    try {
      const reviews = await this.prisma.review.findMany({
        include: {
          user: true,
          book: true,
        },
      });
      return reviews;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las reviews.');
    }
  }
  
  // Método para listar todas las reviews de un libro específico
  async getReviewsByBook(book_id: number) {
    try {
      const reviews = await this.prisma.review.findMany({
        where: { book_id: book_id },
        include: {
          user: true,
        },
      });

      if (!reviews.length) {
        throw new NotFoundException(`No se encontraron reviews para el libro con ID ${book_id}.`);
      }

      return reviews;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener las reviews.');
    }
  }
}
