import { Schema, Document } from 'mongoose';

export const ReviewSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to the book
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  comment: { type: String, required: true }, // Review comment
  rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating (1–5)
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the review
});

export class Review extends Document {
  bookId: string;
  userId: string;
  comment: string;
  rating: number;
  likes: string[];
}