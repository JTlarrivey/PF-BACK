import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
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
    return this.reviewsService.createReview(createReviewDto);
  }

    @Get('/book/:bookId')
    @UseGuards(UserStatusGuard)
    async getReviewsByBook(@Param('bookId') bookId: number) {
    return this.reviewsService.getReviewsByBook(bookId);
  }
}

