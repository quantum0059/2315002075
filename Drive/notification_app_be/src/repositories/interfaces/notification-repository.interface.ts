import { Notification, NotificationCreateInput, NotificationUpdateInput } from "../../types/domain";
import { Repository } from "./repository.interface";
import { NotificationListQuery } from "../../services/interfaces/notification-service.interface";

export interface NotificationRepository extends Repository<Notification> {
  create(input: NotificationCreateInput): Promise<Notification>;
  update(id: string, input: NotificationUpdateInput): Promise<Notification>;
  list(query?: NotificationListQuery): Promise<{ items: Notification[]; total: number }>;
}
