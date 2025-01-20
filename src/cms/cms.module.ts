// src/cms/cms.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { Book, BookSchema } from '../schemas/book.schema';
import { BorrowHistory, BorrowHistorySchema } from '../schemas/borrow-history.schema';
import { Author, AuthorSchema } from '../schemas/author.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MongooseModule.forFeature([{ name: BorrowHistory.name, schema: BorrowHistorySchema }]),
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    UsersModule,
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}