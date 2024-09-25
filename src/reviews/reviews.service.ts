import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateReviewDto } from './createReview.dto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}
  
  async createReview(data: CreateReviewDto): Promise<Review> {
    return this.prisma.review.create({
      data: {
        content: data.content,
        rating: data.rating,
        review_date: new Date(), 
        user: {
          connect: { user_id: data.userId },
        },
        book: {
          connect: { book_id: data.bookId },
        },
      },
    });
  }

  // Método para listar todas las reviews de un libro específico
  async getReviewsByBook(bookId: number) {
    return this.prisma.review.findMany({
      where: { book_id: bookId },
      include: {
        user: true,  // Incluir la información del usuario que escribió la review
      },
    });
  }
}
