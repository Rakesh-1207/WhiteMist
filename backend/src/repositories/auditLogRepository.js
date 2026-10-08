import { query } from '../database/db.js';

export class AuditLogRepository {
  static async log({ user_id, user_email, user_role, action, entity, entity_id, metadata, ip_address }) {
    const sql = `
      INSERT INTO audit_logs (
        user_id, user_email, user_role, action, entity, entity_id, metadata_json, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const metadataStr = typeof metadata === 'object' ? JSON.stringify(metadata) : metadata;
    await query(sql, [
      user_id || null,
      user_email || null,
      user_role || null,
      action,
      entity,
      entity_id ? String(entity_id) : null,
      metadataStr || null,
      ip_address || null,
    ]);
  }

  static async findAll({ entity, action, search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM audit_logs WHERE 1=1`;
    const params = [];

    if (entity) {
      sql += ` AND entity = ?`;
      params.push(entity);
    }
    if (action) {
      sql += ` AND action = ?`;
      params.push(action);
    }
    if (search) {
      sql += ` AND (user_email LIKE ? OR action LIKE ? OR entity LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    return query(sql, params);
  }
}
