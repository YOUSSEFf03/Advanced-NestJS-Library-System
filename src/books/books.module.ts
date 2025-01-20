import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book, BookSchema } from '../schemas/book.schema';
import { BranchesModule } from '../branches/branches.module';
import { WebsocketModule } from '../websocket/websocket.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    BranchesModule,
    WebsocketModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService], 
})
export class BooksModule {} 