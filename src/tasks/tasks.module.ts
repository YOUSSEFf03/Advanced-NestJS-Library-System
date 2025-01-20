// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { BorrowHistoryModule } from '../borrow-history/borrow-history.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [BorrowHistoryModule, UsersModule],
  providers: [TasksService],
})
export class TasksModule {}