import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BorrowHistoryService } from './borrow-history.service';
import { CreateBorrowHistoryDto } from '../dto/create-borrow-history.dto';

@Controller('borrow-history')
export class BorrowHistoryController {
  constructor(private readonly borrowHistoryService: BorrowHistoryService) {}

  @Post('borrow')
  async borrowBook(@Body() createBorrowHistoryDto: CreateBorrowHistoryDto) {
    return this.borrowHistoryService.borrowBook(createBorrowHistoryDto);
  }

  @Post('return/:id')
  async returnBook(@Param('id') id: string) {
    return this.borrowHistoryService.returnBook(id);
  }

  @Get()
  async findAll() {
    return this.borrowHistoryService.findAll();
  }
}