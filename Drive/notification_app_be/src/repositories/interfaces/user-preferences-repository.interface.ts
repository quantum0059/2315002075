import { UserPreferences, NotificationPreferences } from "../../types/domain";

export interface UserPreferencesRepository {
  findById(id: string): Promise<UserPreferences | null>;
  findByUserId(userId: string): Promise<UserPreferences | null>;
  create(userId: string, preferences?: Partial<NotificationPreferences>): Promise<UserPreferences>;
  update(userId: string, preferences: Partial<NotificationPreferences>): Promise<UserPreferences>;
  remove(userId: string): Promise<void>;
}
