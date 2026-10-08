import { query } from '../database/db.js';

export class UserRepository {
  static async findByEmail(email) {
    const sql = `
      SELECT u.*, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.email = ? AND u.deleted_at IS NULL
    `;
    const rows = await query(sql, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const sql = `
      SELECT u.id, u.role_id, u.email, u.full_name, u.phone, u.is_verified, u.status, u.created_at, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ? AND u.deleted_at IS NULL
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ role_id, email, password_hash, full_name, phone, is_verified = true, status = 'ACTIVE' }) {
    const sql = `
      INSERT INTO users (role_id, email, password_hash, full_name, phone, is_verified, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [role_id, email, password_hash, full_name, phone || null, is_verified, status]);
    return this.findById(result.insertId);
  }

  static async updateProfile(id, { full_name, phone }) {
    const sql = `UPDATE users SET full_name = ?, phone = ? WHERE id = ?`;
    await query(sql, [full_name, phone, id]);
    return this.findById(id);
  }

  static async updatePassword(id, password_hash) {
    const sql = `UPDATE users SET password_hash = ? WHERE id = ?`;
    await query(sql, [password_hash, id]);
    return true;
  }

  static async getRoleIdByName(roleName) {
    const sql = `SELECT id FROM roles WHERE name = ?`;
    const rows = await query(sql, [roleName]);
    return rows[0]?.id || 5; // Default to CUSTOMER
  }

  static async getAllUsers({ page = 1, limit = 20, role, search }) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT u.id, u.email, u.full_name, u.phone, u.is_verified, u.status, u.created_at, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NULL
    `;
    const params = [];

    if (role) {
      sql += ` AND r.name = ?`;
      params.push(role);
    }
    if (search) {
      sql += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY u.id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const rows = await query(sql, params);
    return rows;
  }

  static async countUsers({ role, search }) {
    let sql = `
      SELECT COUNT(*) as count
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NULL
    `;
    const params = [];

    if (role) {
      sql += ` AND r.name = ?`;
      params.push(role);
    }
    if (search) {
      sql += ` AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const rows = await query(sql, params);
    return rows[0]?.count || 0;
  }
}
