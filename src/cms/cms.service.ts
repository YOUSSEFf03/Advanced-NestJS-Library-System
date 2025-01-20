// src/cms/cms.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../schemas/book.schema';
import { BorrowHistory } from '../schemas/borrow-history.schema';
import { Author } from '../schemas/author.schema'; 
import { CreateCmsUserDto } from '../dto/create-cms-user.dto'; 
import { UsersService } from '../users/users.service'; 

@Injectable()
export class CmsService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(BorrowHistory.name) private readonly borrowHistoryModel: Model<BorrowHistory>,
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
    private readonly usersService: UsersService ,
  ) {}

  async getDashboardData(branchId?: string) {
    const totalBooks = await this.bookModel.countDocuments();
    const totalOverdueBooks = await this.borrowHistoryModel.countDocuments({ status: 'borrowed', dueDate: { $lt: new Date() } });
  
    const mostPopularAuthors = await this.getMostPopularAuthors();
    const mostPopularBooks = await this.getMostPopularBooks();
    const branchData = await this.getBranchData(branchId); // Pass branchId here
  
    return {
      totalBooks,
      totalOverdueBooks,
      mostPopularAuthors,
      mostPopularBooks,
      branchData,
    };
  }

  private async getMostPopularAuthors() {
    const authors = await this.authorModel.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'authorId',
          as: 'books',
        },
      },
      {
        $lookup: {
          from: 'borrowhistory',
          localField: 'books._id',
          foreignField: 'bookId',
          as: 'borrows',
        },
      },
      {
        $project: {
          name: 1,
          totalBorrows: { $size: '$borrows' },
        },
      },
      {
        $sort: { totalBorrows: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return authors;
  }

  private async getMostPopularBooks() {
    const books = await this.borrowHistoryModel.aggregate([
      {
        $group: {
          _id: '$bookId',
          totalBorrows: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $project: {
          bookId: '$book._id',
          title: '$book.title',
          totalBorrows: 1,
        },
      },
      {
        $sort: { totalBorrows: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return books;
  }

  private async getBranchData(branchId?: string) {
    // Filter by branch if branchId is provided
    const branchFilter = branchId ? { branchId } : {};
  
    // Get the most popular authors for the branch
    const branches = await this.borrowHistoryModel.aggregate([
      {
        $match: branchFilter, // Apply branch filter
      },
      {
        $group: {
          _id: '$branchId',
          totalBorrows: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'authors',
          localField: '_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          branchId: '$_id',
          mostPopularAuthor: {
            authorId: '$author._id',
            name: '$author.name',
            totalBorrows: 1,
          },
        },
      },
    ]);
  
    // Get the most popular books for the branch
    const mostPopularBooks = await this.borrowHistoryModel.aggregate([
      {
        $match: branchFilter, // Apply branch filter
      },
      {
        $group: {
          _id: '$bookId',
          totalBorrows: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $project: {
          bookId: '$book._id',
          title: '$book.title',
          totalBorrows: 1,
        },
      },
      {
        $sort: { totalBorrows: -1 }, // Sort by total borrows (descending)
      },
      {
        $limit: 5, // Limit to top 5 books
      },
    ]);
  
    // Get books borrowed over time for the branch
    const booksBorrowedOverTime = await this.borrowHistoryModel.aggregate([
      {
        $match: branchFilter, // Apply branch filter
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$borrowDate' } },
          numberOfBooks: { $sum: 1 },
        },
      },
      {
        $project: {
          date: '$_id',
          numberOfBooks: 1,
        },
      },
      {
        $sort: { date: 1 }, 
      },
    ]);
  
    return {
      branches,
      mostPopularBooks,
      booksBorrowedOverTime,
    };
  }


  async createCmsUser(createCmsUserDto: CreateCmsUserDto) {
    return this.usersService.createCmsUser(createCmsUserDto);
  }


  
}