import { Controller, Post, Body, Get, Param, Put , Query  } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @Put(':reviewId/like/:userId')
  async likeReview(
    @Param('reviewId') reviewId: string,
    @Param('userId') userId: string,
  ) {
    return this.reviewsService.likeReview(reviewId, userId);
  }

  @Put(':reviewId/unlike/:userId')
  async unlikeReview(
    @Param('reviewId') reviewId: string,
    @Param('userId') userId: string,
  ) {
    return this.reviewsService.unlikeReview(reviewId, userId);
  }

  @Get('book/:bookId')
async getReviewsForBook(
  @Param('bookId') bookId: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return this.reviewsService.getReviewsForBook(bookId, page, limit);
}
}
