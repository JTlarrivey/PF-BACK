
import { Controller, Post, Body, Param, Get, BadRequestException, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './createReview.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserStatusGuard } from 'src/auth/guard/status.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
        @UseGuards(UserStatusGuard)
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    try {
      return await this.reviewsService.createReview(createReviewDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Datos inválidos o incompletos.');
      } else {
        throw new InternalServerErrorException('Error al crear la review.');
      }
    }
  }

  @Get('/book/:bookId')
        @UseGuards(UserStatusGuard)
  async getReviewsByBook(@Param('bookId') bookId: number) {
    try {
      const reviews = await this.reviewsService.getReviewsByBook(bookId);
      if (reviews.length === 0) {
        throw new NotFoundException(`No se encontraron reviews para el libro con ID ${bookId}.`);
      }
      return reviews;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Error al obtener las reviews.');
      }
    }
  }
}

