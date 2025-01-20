// src/borrow-history/borrow-history.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BorrowHistoryController } from './borrow-history.controller';
import { BorrowHistoryService } from './borrow-history.service';
import { BorrowHistory, BorrowHistorySchema } from '../schemas/borrow-history.schema';
import { BooksModule } from '../books/books.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module'; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BorrowHistory.name, schema: BorrowHistorySchema }]),
    BooksModule,
    UsersModule,
    NotificationsModule, // Add this line
  ],
  controllers: [BorrowHistoryController],
  providers: [BorrowHistoryService],
  exports: [BorrowHistoryService], // Ensure this line is present
})
export class BorrowHistoryModule {}