// src/branches/branches.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from '../schemas/branch.schema';
import { Book } from '../schemas/book.schema'; 


@Injectable()
export class BranchesService {
  constructor(
    @InjectModel('Branch') private readonly branchModel: Model<Branch>,
    @InjectModel('Book') private readonly bookModel: Model<Book>,
  ) {}

  async findOne(branchId: string): Promise<Branch> {
    const branch = await this.branchModel.findById(branchId).exec();
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }


  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().exec();
  }

  async create(createBranchDto: { name: string; address: string; books: string[] }): Promise<Branch> {
    const createdBranch = new this.branchModel(createBranchDto);
    return createdBranch.save();
  }

  async addBooksToBranch(branchId: string, bookIds: string[]): Promise<Branch> {
    const branch = await this.branchModel.findById(branchId).exec();
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const uniqueBookIds = [...new Set([...branch.books, ...bookIds])];
    branch.books = uniqueBookIds;
    await branch.save();
  
    
    for (const bookId of bookIds) {
      const book = await this.bookModel.findById(bookId).exec();
      if (!book) {
        throw new NotFoundException(`Book with ID ${bookId} not found`);
      }
  
      if (!book.branches.includes(branchId)) {
        book.branches.push(branchId);
        await book.save();
      }
    }
  
    return branch;
  }
}