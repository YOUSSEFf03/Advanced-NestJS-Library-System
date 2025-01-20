import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../schemas/review.schema';
import { CreateReviewDto } from '../dto/create-review.dto';
import { BooksService } from '../books/books.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly booksService: BooksService,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { bookId, userId, comment, rating } = createReviewDto;

    // Check if the book is open to reviews
    const book = await this.booksService.findOneById(bookId);
    if (!book.isOpenToReview) {
      throw new BadRequestException('This book is not open to reviews');
    }

    // Create a new review
    const newReview = new this.reviewModel({
      bookId,
      userId,
      comment,
      rating,
      likes: [], // Initialize likes as an empty array
    });

    return newReview.save();
  }

  async likeReview(reviewId: string, userId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if the user has already liked the review
    if (review.likes.includes(userId)) {
      throw new BadRequestException('You have already liked this review');
    }

    // Add the user's ID to the likes array
    review.likes.push(userId);
    return review.save();
  }

  async unlikeReview(reviewId: string, userId: string): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if the user has liked the review
    if (!review.likes.includes(userId)) {
      throw new BadRequestException('You have not liked this review');
    }

    // Remove the user's ID from the likes array
    review.likes = review.likes.filter((id) => id.toString() !== userId); // Ensure IDs are compared as strings
    return review.save();
  }


  async getReviewsForBook(bookId: string, page: number = 1, limit: number = 10): Promise<Review[]> {
    const skip = (page - 1) * limit; 
  
    return this.reviewModel
      .find({ bookId })
      .sort({ likes: -1, createdAt: -1 }) // Sort by likes (descending) and then by creation date (newest first)
      .skip(skip) // Skip reviews for pagination
      .limit(limit) // Limit the number of reviews per page
      .exec();
  }
}
