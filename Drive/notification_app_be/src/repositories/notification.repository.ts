import { Notification } from "../types/domain";
import { NotificationRepository } from "./interfaces/notification-repository.interface";

export class NotificationRepositoryImpl implements NotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    throw new Error("NotificationRepositoryImpl.findById not implemented");
  }

  async findAll(): Promise<Notification[]> {
    throw new Error("NotificationRepositoryImpl.findAll not implemented");
  }

  async save(entity: Notification): Promise<Notification> {
    throw new Error("NotificationRepositoryImpl.save not implemented");
  }

  async remove(id: string): Promise<void> {
    throw new Error("NotificationRepositoryImpl.remove not implemented");
  }
}
