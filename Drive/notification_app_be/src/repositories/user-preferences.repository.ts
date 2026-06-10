import { UserPreferences, NotificationPreferences } from "../types/domain";
import { pool } from "../config/database";
import { UserPreferencesRepository } from "./interfaces/user-preferences-repository.interface";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  placement: {
    enabled: true,
    channels: ['in-app'],
    priorityFilter: ['low', 'medium', 'high', 'critical'],
  },
  result: {
    enabled: true,
    channels: ['in-app'],
    priorityFilter: ['low', 'medium', 'high', 'critical'],
  },
  event: {
    enabled: true,
    channels: ['in-app'],
    priorityFilter: ['low', 'medium', 'high', 'critical'],
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export class UserPreferencesRepositoryImpl implements UserPreferencesRepository {
  async findById(id: string): Promise<UserPreferences | null> {
    const result = await pool.query<UserPreferencesRow>(
      "SELECT id, user_id, preferences, created_at, updated_at FROM user_preferences WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.toUserPreferences(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<UserPreferences | null> {
    const result = await pool.query<UserPreferencesRow>(
      "SELECT id, user_id, preferences, created_at, updated_at FROM user_preferences WHERE user_id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.toUserPreferences(result.rows[0]);
  }

  async create(
    userId: string,
    preferences?: Partial<NotificationPreferences>
  ): Promise<UserPreferences> {
    const finalPreferences = {
      ...DEFAULT_PREFERENCES,
      ...preferences,
    };

    const result = await pool.query<UserPreferencesRow>(
      `INSERT INTO user_preferences (user_id, preferences)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET
         preferences = EXCLUDED.preferences,
         updated_at = NOW()
       RETURNING id, user_id, preferences, created_at, updated_at`,
      [userId, JSON.stringify(finalPreferences)]
    );

    return this.toUserPreferences(result.rows[0]);
  }

  async update(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<UserPreferences> {
    const existing = await this.findByUserId(userId);
    if (!existing) {
      throw new Error('User preferences not found');
    }

    const updatedPreferences = {
      ...existing.preferences,
      ...preferences,
      placement: { ...existing.preferences.placement, ...preferences.placement },
      result: { ...existing.preferences.result, ...preferences.result },
      event: { ...existing.preferences.event, ...preferences.event },
      quietHours: { ...existing.preferences.quietHours, ...preferences.quietHours },
    };

    const result = await pool.query<UserPreferencesRow>(
      `UPDATE user_preferences SET
         preferences = $1,
         updated_at = NOW()
       WHERE user_id = $2
       RETURNING id, user_id, preferences, created_at, updated_at`,
      [JSON.stringify(updatedPreferences), userId]
    );

    if (result.rowCount === 0) {
      throw new Error('Failed to update user preferences');
    }

    return this.toUserPreferences(result.rows[0]);
  }

  async remove(userId: string): Promise<void> {
    await pool.query("DELETE FROM user_preferences WHERE user_id = $1", [userId]);
  }

  private toUserPreferences(row: UserPreferencesRow): UserPreferences {
    return {
      id: row.id,
      userId: row.user_id,
      preferences: typeof row.preferences === 'string' ? JSON.parse(row.preferences) : row.preferences,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    };
  }
}

interface UserPreferencesRow {
  id: string;
  user_id: string;
  preferences: NotificationPreferences | string;
  created_at: string | Date;
  updated_at: string | Date;
}
