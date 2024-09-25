import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './createReview.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

    @Get('/book/:bookId')
    async getReviewsByBook(@Param('bookId') bookId: number) {
    return this.reviewsService.getReviewsByBook(bookId);
  }
}

