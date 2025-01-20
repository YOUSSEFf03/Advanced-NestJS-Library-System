import { Schema, Document } from 'mongoose';

export const BorrowHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' },
});

export class BorrowHistory extends Document {
  userId: string;
  bookId: string;
  branchId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
}