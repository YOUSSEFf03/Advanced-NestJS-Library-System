import { Injectable, NotFoundException } from '@nestjs/common'; // Only one import
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
  ) {}

  async createNotification(userId: string, message: string): Promise<Notification> {
    const newNotification = new this.notificationModel({ userId, message });
    return newNotification.save();
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    ).exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}