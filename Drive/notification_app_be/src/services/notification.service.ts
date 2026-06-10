import { Notification } from "../types/domain";
import { NotificationRepository } from "../repositories/interfaces/notification-repository.interface";
import { NotificationService } from "./interfaces/notification-service.interface";

export class NotificationServiceImpl implements NotificationService {
  constructor(private readonly repository: NotificationRepository) {}

  async getNotification(id: string): Promise<Notification | null> {
    return this.repository.findById(id);
  }

  async listNotifications(): Promise<Notification[]> {
    return this.repository.findAll();
  }
}
