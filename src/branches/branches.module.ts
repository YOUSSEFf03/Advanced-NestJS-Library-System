import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchSchema } from '../schemas/branch.schema';
import { BookSchema } from '../schemas/book.schema'; 
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }]),
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]), 
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService], 
})
export class BranchesModule {}