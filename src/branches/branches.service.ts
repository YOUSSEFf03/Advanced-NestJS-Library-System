// src/branches/branches.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from '../schemas/branch.schema';

@Injectable()
export class BranchesService {
  constructor(@InjectModel('Branch') private readonly branchModel: Model<Branch>) {}

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

    branch.books = [...branch.books, ...bookIds];
    return branch.save();
  }

  async findOne(branchId: string): Promise<Branch> {
    const branch = await this.branchModel.findById(branchId).exec();
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }
}