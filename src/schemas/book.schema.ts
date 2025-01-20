// src/schemas/book.schema.ts
import { Schema, Document } from 'mongoose';

export const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    genre: { type: String, required: true },
    isbn: { 
      type: String, 
      required: true, 
      unique: true, 
      default: () => `978${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}` // Auto-generate ISBN
    },
    description: { type: String, required: true },
    minAge: { type: Number, required: true },
    copies: { type: Number, required: true },
    pdfUrl: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    isOpenToReview: { type: Boolean, default: true },
    branches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    authorId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true },
);

export class Book extends Document {
  title: string;
  genre: string;
  isbn: string;
  description: string;
  minAge: number;
  copies: number;
  pdfUrl: string;
  coverImageUrl: string;
  isOpenToReview: boolean;
  branches: string[];
  authorId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}