import { query } from '../database/db.js';

export class EnquiryRepository {
  static async create(data) {
    const enquiryNumber = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sql = `
      INSERT INTO enquiries (
        enquiry_number, name, email, phone, location, product_id,
        model_number, message, preferred_contact_method, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
    `;
    const result = await query(sql, [
      enquiryNumber,
      data.name,
      data.email,
      data.phone,
      data.location,
      data.product_id || null,
      data.model_number || null,
      data.message,
      data.preferred_contact_method || 'PHONE',
    ]);

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const sql = `
      SELECT e.*, p.name as product_name, u.full_name as assigned_staff_name
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      LEFT JOIN users u ON e.assigned_staff_id = u.id
      WHERE e.id = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async findAll({ status, search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT e.*, p.name as product_name, u.full_name as assigned_staff_name
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      LEFT JOIN users u ON e.assigned_staff_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND e.status = ?`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (e.name LIKE ? OR e.email LIKE ? OR e.phone LIKE ? OR e.enquiry_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY e.id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    return query(sql, params);
  }

  static async updateStatus(id, { status, assigned_staff_id, internal_notes }) {
    const sql = `
      UPDATE enquiries SET
        status = ?, assigned_staff_id = ?, internal_notes = ?
      WHERE id = ?
    `;
    await query(sql, [status, assigned_staff_id || null, internal_notes || null, id]);
    return this.findById(id);
  }
}
