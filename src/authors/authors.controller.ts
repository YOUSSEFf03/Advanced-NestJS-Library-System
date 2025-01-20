import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { CreateBookDto } from '../dto/create-book.dto';


@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post('add')
  async addAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.addAuthor(createAuthorDto);
  }

  @Post('submit-book')
  async submitBook(@Body() createBookDto: CreateBookDto) {
    return this.authorsService.submitBook(createBookDto);
  }

  @Get()
  async findAllAuthors() {
    return this.authorsService.findAllAuthors();
  }

  @Get(':id')
  async findAuthorById(@Param('id') id: string) {
    return this.authorsService.findAuthorById(id);
  }
  

  @Get(':authorId/book-requests')
  async getBookRequestsByStatus(@Param('authorId') authorId: string) {
    return this.authorsService.getBookRequestsByStatus(authorId);
  }

  @Get(':authorId/average-approval-time')
  async getAverageApprovalTime(@Param('authorId') authorId: string) {
    return this.authorsService.getAverageApprovalTime(authorId);
}

@Get(':authorId/branch-distribution')
async getBranchDistribution(@Param('authorId') authorId: string) {
  return this.authorsService.getBranchDistribution(authorId);
}


}