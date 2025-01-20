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


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Yousseffarah313:SI4Uquuo1kf6z38l@cluster0.xsy7f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
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