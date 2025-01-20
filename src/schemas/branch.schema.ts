// src/schemas/branch.schema.ts
import { Schema, Document } from 'mongoose';

export const BranchSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
});

export interface Branch extends Document {
  name: string;
  address: string;
  books: string[]; 
}