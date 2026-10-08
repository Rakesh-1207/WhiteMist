import { query } from '../database/db.js';

export class ContactRepository {
  static async create(data) {
    const sql = `
      INSERT INTO contact_messages (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'UNREAD')
    `;
    const result = await query(sql, [
      data.name,
      data.email,
      data.phone || null,
      data.subject,
      data.message,
    ]);
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const sql = `SELECT * FROM contact_messages WHERE id = ?`;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async findAll({ status, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM contact_messages WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    return query(sql, params);
  }

  static async updateStatus(id, status) {
    const sql = `UPDATE contact_messages SET status = ? WHERE id = ?`;
    await query(sql, [status, id]);
    return this.findById(id);
  }
}
