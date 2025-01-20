// src/schemas/user.schema.ts
import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Member', 'Author', 'Admin', 'Intern'], default: 'Member' }, // Ensure 'Author' is included
  returnRate: { type: Number, default: 100 },
  borrowHistory: [{ type: Schema.Types.ObjectId, ref: 'BorrowHistory' }],
});

export class User extends Document {
  email: string;
  password: string;
  role: string;
  returnRate: number;
  borrowHistory: string[];
}