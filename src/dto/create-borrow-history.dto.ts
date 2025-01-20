export class CreateBorrowHistoryDto {
  userId: string;
  bookId: string;
  branchId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  isOverdue: boolean;
}