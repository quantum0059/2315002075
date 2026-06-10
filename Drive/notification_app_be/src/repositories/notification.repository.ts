import { Notification, NotificationType, NotificationCreateInput, NotificationUpdateInput } from "../types/domain";
import { pool } from "../config/database";
import { NotificationRepository } from "./interfaces/notification-repository.interface";
import { NotificationListQuery } from "../services/interfaces/notification-service.interface";

const DEFAULT_PAGE_SIZE = 20;

export class NotificationRepositoryImpl implements NotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    const result = await pool.query<NotificationRow>(
      `SELECT id, type, title, body, priority, status, metadata, target_audience, 
              scheduled_at, expires_at, created_at, updated_at, created_by 
       FROM notifications WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.toNotification(result.rows[0]);
  }

  async findAll(): Promise<Notification[]> {
    const result = await pool.query<NotificationRow>(
      `SELECT id, type, title, body, priority, status, metadata, target_audience, 
              scheduled_at, expires_at, created_at, updated_at, created_by 
       FROM notifications ORDER BY created_at DESC LIMIT $1`,
      [DEFAULT_PAGE_SIZE]
    );

    return result.rows.map((row: NotificationRow) => this.toNotification(row));
  }

  async save(entity: Notification): Promise<Notification> {
    const result = await pool.query<NotificationRow>(
      `INSERT INTO notifications (id, type, title, body, priority, status, metadata, target_audience, 
                                  scheduled_at, expires_at, created_at, updated_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO UPDATE SET
         type = EXCLUDED.type,
         title = EXCLUDED.title,
         body = EXCLUDED.body,
         priority = EXCLUDED.priority,
         status = EXCLUDED.status,
         metadata = EXCLUDED.metadata,
         target_audience = EXCLUDED.target_audience,
         scheduled_at = EXCLUDED.scheduled_at,
         expires_at = EXCLUDED.expires_at,
         updated_at = EXCLUDED.updated_at
       RETURNING id, type, title, body, priority, status, metadata, target_audience, 
                 scheduled_at, expires_at, created_at, updated_at, created_by`,
      [
        entity.id,
        entity.type,
        entity.title,
        entity.body,
        entity.priority,
        entity.status,
        JSON.stringify(entity.metadata),
        JSON.stringify(entity.targetAudience),
        entity.scheduledAt ? new Date(entity.scheduledAt) : null,
        entity.expiresAt ? new Date(entity.expiresAt) : null,
        new Date(entity.createdAt),
        new Date(entity.updatedAt),
        entity.createdBy,
      ]
    );

    return this.toNotification(result.rows[0]);
  }

  async create(input: NotificationCreateInput): Promise<Notification> {
    const result = await pool.query<NotificationRow>(
      `INSERT INTO notifications (type, title, body, priority, status, metadata, target_audience, 
                                  scheduled_at, expires_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, type, title, body, priority, status, metadata, target_audience, 
                 scheduled_at, expires_at, created_at, updated_at, created_by`,
      [
        input.type,
        input.title,
        input.body,
        input.priority,
        'draft',
        JSON.stringify(input.metadata),
        JSON.stringify(input.targetAudience),
        input.scheduledAt ? new Date(input.scheduledAt) : null,
        input.expiresAt ? new Date(input.expiresAt) : null,
        input.createdBy,
      ]
    );

    return this.toNotification(result.rows[0]);
  }

  async update(id: string, input: NotificationUpdateInput): Promise<Notification> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Notification not found');
    }

    const updated = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const result = await pool.query<NotificationRow>(
      `UPDATE notifications SET
         title = $1,
         body = $2,
         priority = $3,
         metadata = $4,
         target_audience = $5,
         scheduled_at = $6,
         expires_at = $7,
         updated_at = $8
       WHERE id = $9
       RETURNING id, type, title, body, priority, status, metadata, target_audience, 
                 scheduled_at, expires_at, created_at, updated_at, created_by`,
      [
        updated.title,
        updated.body,
        updated.priority,
        JSON.stringify(updated.metadata),
        JSON.stringify(updated.targetAudience),
        updated.scheduledAt ? new Date(updated.scheduledAt) : null,
        updated.expiresAt ? new Date(updated.expiresAt) : null,
        new Date(updated.updatedAt),
        id,
      ]
    );

    return this.toNotification(result.rows[0]);
  }

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM notifications WHERE id = $1", [id]);
  }

  async list(query: NotificationListQuery = {}): Promise<{ items: Notification[]; total: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : DEFAULT_PAGE_SIZE;
    const offset = (page - 1) * pageSize;
    const parameters: unknown[] = [];
    const whereClauses: string[] = [];

    if (query.type) {
      parameters.push(query.type);
      whereClauses.push(`type = $${parameters.length}`);
    }

    if (query.priority) {
      parameters.push(query.priority);
      whereClauses.push(`priority = $${parameters.length}`);
    }

    if (query.status) {
      parameters.push(query.status);
      whereClauses.push(`status = $${parameters.length}`);
    }

    if (query.search) {
      parameters.push(`%${query.search}%`);
      whereClauses.push(`(title ILIKE $${parameters.length} OR body ILIKE $${parameters.length})`);
    }

    if (query.from) {
      parameters.push(new Date(query.from));
      whereClauses.push(`created_at >= $${parameters.length}`);
    }

    if (query.to) {
      parameters.push(new Date(query.to));
      whereClauses.push(`created_at <= $${parameters.length}`);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM notifications ${whereClause}`,
      parameters
    );

    const total = Number(countResult.rows[0]?.count ?? 0);

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    let orderByClause = 'created_at DESC';

    if (sortBy === 'scheduledAt') {
      orderByClause = `scheduled_at ${sortOrder} NULLS LAST`;
    } else if (sortBy === 'priority') {
      orderByClause = `CASE priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
      END ${sortOrder}`;
    } else {
      orderByClause = `created_at ${sortOrder}`;
    }

    parameters.push(pageSize, offset);
    const rowsResult = await pool.query<NotificationRow>(
      `SELECT id, type, title, body, priority, status, metadata, target_audience, 
              scheduled_at, expires_at, created_at, updated_at, created_by
       FROM notifications
       ${whereClause}
       ORDER BY ${orderByClause}
       LIMIT $${parameters.length - 1}
       OFFSET $${parameters.length}`,
      parameters
    );

    return {
      items: rowsResult.rows.map((row: NotificationRow) => this.toNotification(row)),
      total,
    };
  }

  private toNotification(row: NotificationRow): Notification {
    return {
      id: row.id,
      type: row.type as NotificationType,
      title: row.title,
      body: row.body,
      priority: row.priority as Notification['priority'],
      status: row.status as Notification['status'],
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      targetAudience: typeof row.target_audience === 'string' ? JSON.parse(row.target_audience) : row.target_audience,
      scheduledAt: row.scheduled_at ? (row.scheduled_at instanceof Date ? row.scheduled_at.toISOString() : String(row.scheduled_at)) : null,
      expiresAt: row.expires_at ? (row.expires_at instanceof Date ? row.expires_at.toISOString() : String(row.expires_at)) : null,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
      createdBy: row.created_by,
    };
  }
}

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: string;
  status: string;
  metadata: object | string;
  target_audience: object | string;
  scheduled_at: string | Date | null;
  expires_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  created_by: string;
}
