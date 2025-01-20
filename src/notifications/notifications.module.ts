import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../schemas/notification.schema';
import { Review, ReviewSchema } from '../schemas/review.schema'; 
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { BooksModule } from '../books/books.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    BooksModule, 
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService], 
})
export class NotificationsModule {}