// src/schemas/notification.schema.ts
import { Schema, Document } from 'mongoose';

export const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the author
  message: { type: String, required: true }, // Notification message
  timestamp: { type: Date, default: Date.now }, // When the notification was created
  isRead: { type: Boolean, default: false }, // Whether the notification has been read
});

export class Notification extends Document {
  userId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}