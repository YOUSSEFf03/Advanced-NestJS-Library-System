import { Schema, Document } from 'mongoose';

export const AuthorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }], 
});

export class Author extends Document {
  userId: string; 
  books: string[]; 
}