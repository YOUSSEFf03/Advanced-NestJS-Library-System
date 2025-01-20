// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchesModule } from './branches/branches.module';
import { UsersModule } from './users/users.module';
import { BorrowHistoryModule } from './borrow-history/borrow-history.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { CmsModule } from './cms/cms.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksController } from './tasks/tasks.controller';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'fallback_mongodb_uri'),
    ScheduleModule.forRoot(),
    BranchesModule,
    UsersModule,
    BorrowHistoryModule,
    ReviewsModule,
    AuthModule,
    BooksModule,
    AuthorsModule,
    CmsModule,
    TasksModule,
    NotificationsModule,
    WebsocketModule, 
    
  ],
  controllers: [AppController], // Remove TasksController
  providers: [AppService],
})
export class AppModule {}