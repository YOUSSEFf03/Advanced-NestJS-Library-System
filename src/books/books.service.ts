import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../schemas/book.schema';
import { CreateBookDto } from '../dto/create-book.dto'; 
import { BranchesService } from '../branches/branches.service'; 
import { EventsGateway } from '../utils/events.gateway'; 


@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>, // Add comma here
    private readonly branchesService: BranchesService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findOneById(bookId: string): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async approveBook(bookId: string, status: string): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (status !== 'approved' && status !== 'rejected') {
      throw new BadRequestException('Invalid status. Must be "approved" or "rejected".');
    }

    book.status = status;
    await book.save();

    if (status === 'approved') {
      await this.distributeBookToBranches(bookId, book.branches);
    }

    return book;
  }

  private async distributeBookToBranches(bookId: string, branchIds: string[]): Promise<void> {
    for (const branchId of branchIds) {
      await this.branchesService.addBooksToBranch(branchId, [bookId]);
    }
  }
  async borrowBook(userId: string, bookId: string, branchId: string): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
  
    if (book.copies <= 0) {
      throw new BadRequestException('Book not available for borrowing');
    }
  
    book.copies -= 1; // Decrease the number of available copies
    await book.save();
  
    // Emit real-time event
    this.eventsGateway.handleBookBorrowed({ bookId, branchId, availableCopies: book.copies });
  
    return book;
  }
  
  async returnBook(bookId: string, branchId: string): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
  
    book.copies += 1; // Increase the number of available copies
    await book.save();
  
    // Emit real-time event
    this.eventsGateway.handleBookReturned({ bookId, branchId, availableCopies: book.copies });
  
    return book;
  }
}