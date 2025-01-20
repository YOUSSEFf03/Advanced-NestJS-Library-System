import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BorrowHistoryService } from '../borrow-history/borrow-history.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly borrowHistoryService: BorrowHistoryService,
    private readonly usersService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Runs every day at midnight
  async handleOverdueBooks() {
    console.log('Checking for overdue books...');
    const overdueBooks = await this.borrowHistoryService.findAllOverdue();
    for (const book of overdueBooks) {
      await this.usersService.updateReturnRate(book.userId, true); // Decrease return rate
    }
  }


// If you need to test, use "every_minute." However, be aware that it will deduct 10 point
// from each user who has borrowed a book and not returned it past the return deadline.






// @Cron(CronExpression.EVERY_MINUTE)
// async handleOverdueBooks() {
//   console.log('Scheduled job is running...'); // Add this line
//   const overdueBooks = await this.borrowHistoryService.findAllOverdue();
//   for (const book of overdueBooks) {
//     await this.usersService.updateReturnRate(book.userId, true);
//   }
// }


}