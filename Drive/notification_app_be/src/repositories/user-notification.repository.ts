import { UserNotification } from "../types/domain";
import { pool } from "../config/database";
import { UserNotificationRepository, UserNotificationListQuery } from "./interfaces/user-notification-repository.interface";

const DEFAULT_PAGE_SIZE = 20;

export class UserNotificationRepositoryImpl implements UserNotificationRepository {
  async findById(id: string): Promise<UserNotification | null> {
    const result = await pool.query<UserNotificationRow>(
      `SELECT id, user_id, notification_id, read, read_at, delivered, delivered_at, 
              delivery_channel, created_at
       FROM user_notifications WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.toUserNotification(result.rows[0]);
  }

  async findByUserId(
    userId: string,
    query: UserNotificationListQuery = {}
  ): Promise<{ items: UserNotification[]; total: number; unreadCount: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : DEFAULT_PAGE_SIZE;
    const offset = (page - 1) * pageSize;
    const parameters: unknown[] = [userId];
    const whereClauses: string[] = ["user_id = $1"];

    if (query.type) {
      parameters.push(query.type);
      whereClauses.push(`n.type = $${parameters.length}`);
    }

    if (query.read !== undefined) {
      parameters.push(query.read);
      whereClauses.push(`un.read = $${parameters.length}`);
    }

    const whereClause = `WHERE ${whereClauses.join(" AND ")}`;

    // Get total count
    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count 
       FROM user_notifications un
       JOIN notifications n ON un.notification_id = n.id
       ${whereClause}`,
      parameters
    );

    const total = Number(countResult.rows[0]?.count ?? 0);

    // Get unread count
    const unreadCount = await this.getUnreadCount(userId);

    // Sort
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const orderByClause = sortBy === 'priority'
      ? `CASE n.priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END ${sortOrder}`
      : `un.created_at ${sortOrder}`;

    parameters.push(pageSize, offset);
    const rowsResult = await pool.query<UserNotificationRow>(
      `SELECT un.id, un.user_id, un.notification_id, un.read, un.read_at, 
              un.delivered, un.delivered_at, un.delivery_channel, un.created_at
       FROM user_notifications un
       JOIN notifications n ON un.notification_id = n.id
       ${whereClause}
       ORDER BY ${orderByClause}
       LIMIT $${parameters.length - 1}
       OFFSET $${parameters.length}`,
      parameters
    );

    return {
      items: rowsResult.rows.map((row: UserNotificationRow) => this.toUserNotification(row)),
      total,
      unreadCount,
    };
  }

  async create(userId: string, notificationId: string, deliveryChannel?: string): Promise<UserNotification> {
    const result = await pool.query<UserNotificationRow>(
      `INSERT INTO user_notifications (user_id, notification_id, delivery_channel)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, notification_id) DO NOTHING
       RETURNING id, user_id, notification_id, read, read_at, delivered, delivered_at, 
                 delivery_channel, created_at`,
      [userId, notificationId, deliveryChannel || null]
    );

    if (result.rowCount === 0) {
      // Already exists, fetch it
      return this.findByUserAndNotification(userId, notificationId);
    }

    return this.toUserNotification(result.rows[0]);
  }

  async markAsRead(id: string): Promise<UserNotification> {
    const result = await pool.query<UserNotificationRow>(
      `UPDATE user_notifications SET
         read = TRUE,
         read_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, notification_id, read, read_at, delivered, delivered_at, 
                 delivery_channel, created_at`,
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error('User notification not found');
    }

    return this.toUserNotification(result.rows[0]);
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await pool.query(
      `UPDATE user_notifications SET
         read = TRUE,
         read_at = NOW()
       WHERE user_id = $1 AND read = FALSE`,
      [userId]
    );

    return result.rowCount || 0;
  }

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM user_notifications WHERE id = $1", [id]);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await pool.query<{ count: string }>(
      "SELECT COUNT(*) AS count FROM user_notifications WHERE user_id = $1 AND read = FALSE",
      [userId]
    );

    return Number(result.rows[0]?.count ?? 0);
  }

  private async findByUserAndNotification(userId: string, notificationId: string): Promise<UserNotification> {
    const result = await pool.query<UserNotificationRow>(
      `SELECT id, user_id, notification_id, read, read_at, delivered, delivered_at, 
              delivery_channel, created_at
       FROM user_notifications WHERE user_id = $1 AND notification_id = $2`,
      [userId, notificationId]
    );

    if (result.rowCount === 0) {
      throw new Error('User notification not found');
    }

    return this.toUserNotification(result.rows[0]);
  }

  private toUserNotification(row: UserNotificationRow): UserNotification {
    return {
      id: row.id,
      userId: row.user_id,
      notificationId: row.notification_id,
      read: row.read,
      readAt: row.read_at ? (row.read_at instanceof Date ? row.read_at.toISOString() : String(row.read_at)) : null,
      delivered: row.delivered,
      deliveredAt: row.delivered_at ? (row.delivered_at instanceof Date ? row.delivered_at.toISOString() : String(row.delivered_at)) : null,
      deliveryChannel: row.delivery_channel as UserNotification['deliveryChannel'],
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }
}

interface UserNotificationRow {
  id: string;
  user_id: string;
  notification_id: string;
  read: boolean;
  read_at: string | Date | null;
  delivered: boolean;
  delivered_at: string | Date | null;
  delivery_channel: string | null;
  created_at: string | Date;
}
