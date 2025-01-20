import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BorrowHistory } from '../schemas/borrow-history.schema';
import { CreateBorrowHistoryDto } from '../dto/create-borrow-history.dto';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service'; 


const RETURN_TIME_MINUTES = 1; // Return time is 1 minute for testing

@Injectable()
export class BorrowHistoryService {
  constructor(
    @InjectModel(BorrowHistory.name) private readonly borrowHistoryModel: Model<BorrowHistory>,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService, 
  ) {}

  async borrowBook(createBorrowHistoryDto: CreateBorrowHistoryDto): Promise<BorrowHistory> {
    const { userId, bookId, branchId } = createBorrowHistoryDto;

    // Check if the user's return rate is above 30%
    const user = await this.usersService.findOneById(userId);
    if (user.returnRate < 30) {
      throw new BadRequestException('User is not allowed to borrow books due to low return rate');
    }

    // Check if the book is available
    const book = await this.booksService.borrowBook(userId, bookId, branchId);
    if (!book) {
      throw new BadRequestException('Book not available for borrowing');
    }

    // Calculate the due date (1 minute from now for testing)
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + RETURN_TIME_MINUTES * 60 * 1000); // 1 minute

    // Create a new borrow history record
    const borrowedBook = new this.borrowHistoryModel({
      ...createBorrowHistoryDto,
      borrowDate,
      dueDate,
    });
    const savedBorrowHistory = await borrowedBook.save();

    // Add the borrow history record to the user's borrowHistory array
    user.borrowHistory.push((savedBorrowHistory as BorrowHistory & { _id: string })._id.toString());
    await user.save();

    // Notify the author
    const authorId = book.authorId; // Assuming the book schema has an authorId field
    const message = `Your book "${book.title}" has been borrowed by ${user.email}.`;
    await this.notificationsService.createNotification(authorId, message);

    return savedBorrowHistory;
  }

  async returnBook(borrowHistoryId: string): Promise<BorrowHistory> {
    const updatedBorrowHistory = await this.borrowHistoryModel.findByIdAndUpdate(
      borrowHistoryId,
      { status: 'returned', returnDate: new Date() },
      { new: true },
    );

    if (!updatedBorrowHistory) {
      throw new NotFoundException('Borrow history record not found');
    }

    // Update the book inventory when the book is returned
    await this.booksService.returnBook(updatedBorrowHistory.bookId, updatedBorrowHistory.branchId);

    // Check if the book was returned late
    const isLate =
      updatedBorrowHistory.returnDate && updatedBorrowHistory.returnDate > updatedBorrowHistory.dueDate;

    // Update the user's return rate
    await this.updateUserReturnRate(updatedBorrowHistory.userId, !!isLate); // Ensure isLate is a boolean

    return updatedBorrowHistory;
  }

  async findAll(): Promise<BorrowHistory[]> {
    return this.borrowHistoryModel.find().exec();
  }


  private async updateUserReturnRate(userId: string, isLate: boolean): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (isLate) {
      // Decrease the return rate by 10 if the book is returned late
      user.returnRate -= 10;
    } else {
      // Increase the return rate by 10 if the book is returned on time
      user.returnRate += 10;
    }

    // Ensure the return rate stays within 0-100
    user.returnRate = Math.max(0, Math.min(100, user.returnRate));

    await user.save();
  }

  async findAllOverdue(): Promise<BorrowHistory[]> {
    const now = new Date();
    console.log('Current time:', now.toISOString());
    const overdueBooks = await this.borrowHistoryModel.find({
      status: 'borrowed',
      dueDate: { $lt: now.toISOString() },
    }).exec();
    console.log('Overdue books:', overdueBooks);
    return overdueBooks;
  }


  
}