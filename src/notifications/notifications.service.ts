import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../schemas/review.schema';
import { BooksService } from '../books/books.service';


@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Review.name) private reviewModel: Model<Review>, // Add this line
    private readonly booksService: BooksService,
  ) {}

  async createNotification(userId: string, message: string): Promise<Notification> {
    const newNotification = new this.notificationModel({ userId, message });
    return newNotification.save();
  }


  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { bookId, userId, comment, rating } = createReviewDto;
  
    const book = await this.booksService.findOneById(bookId);
    if (!book.isOpenToReview) {
      throw new BadRequestException('This book is not open to reviews');
    }
  
    const newReview = new this.reviewModel({
      bookId,
      userId,
      comment,
      rating,
      likes: [],
    });
  
    return newReview.save();
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    ).exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}