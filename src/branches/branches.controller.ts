// src/branches/branches.controller.ts
import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { BranchesService } from './branches.service';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @Post()
  create(@Body() createBranchDto: { name: string; address: string; books: string[] }) { // Inline type
    return this.branchesService.create(createBranchDto);
  }

  @Post(':branchId/add-books')
  async addBooksToBranch(
    @Param('branchId') branchId: string,
    @Body() addBooksToBranchDto: { bookIds: string[] }, // Inline type
  ) {
    const branch = await this.branchesService.addBooksToBranch(branchId, addBooksToBranchDto.bookIds);
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }

  @Get(':branchId')
  async findOne(@Param('branchId') branchId: string) {
    const branch = await this.branchesService.findOne(branchId);
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }
}