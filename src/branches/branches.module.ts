// src/branches/branches.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema } from '../schemas/branch.schema';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService], // Export BranchesService
})
export class BranchesModule {}