import { Controller, Get, Post, Body, Param } from '@nestjs/common'; // Add Param
import { BooksService } from './books.service';
import { CreateBookDto } from '../dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Post('approve-book/:bookId')
  async approveBook(
    @Param('bookId') bookId: string,
    @Body('status') status: string,
  ) {
    return this.booksService.approveBook(bookId, status);
  }

  @Post('borrow')
  async borrowBook(
    @Body('userId') userId: string,
    @Body('bookId') bookId: string,
    @Body('branchId') branchId: string,
  ) {
    return this.booksService.borrowBook(userId, bookId, branchId);
  }
}