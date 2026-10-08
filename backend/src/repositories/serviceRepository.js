import { query } from '../database/db.js';

export class ServiceRepository {
  static async create(data) {
    const ticketNumber = `SRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sql = `
      INSERT INTO service_requests (
        ticket_number, customer_id, customer_name, customer_email, customer_phone,
        product_id, model_number, serial_number, service_type, problem_description,
        address_line, city, state, postal_code, preferred_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REQUESTED')
    `;
    const result = await query(sql, [
      ticketNumber,
      data.customer_id || null,
      data.customer_name,
      data.customer_email,
      data.customer_phone,
      data.product_id || null,
      data.model_number || null,
      data.serial_number || null,
      data.service_type,
      data.problem_description,
      data.address_line,
      data.city,
      data.state,
      data.postal_code,
      data.preferred_date || null,
    ]);
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const sql = `
      SELECT s.*, p.name as product_name, tech.full_name as technician_name, tech.phone as technician_phone
      FROM service_requests s
      LEFT JOIN products p ON s.product_id = p.id
      LEFT JOIN users tech ON s.assigned_technician_id = tech.id
      WHERE s.id = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async findByTicketNumber(ticketNumber) {
    const sql = `
      SELECT s.*, p.name as product_name, tech.full_name as technician_name
      FROM service_requests s
      LEFT JOIN products p ON s.product_id = p.id
      LEFT JOIN users tech ON s.assigned_technician_id = tech.id
      WHERE s.ticket_number = ?
    `;
    const rows = await query(sql, [ticketNumber]);
    return rows[0] || null;
  }

  static async findByCustomerId(customerId) {
    const sql = `
      SELECT s.*, p.name as product_name
      FROM service_requests s
      LEFT JOIN products p ON s.product_id = p.id
      WHERE s.customer_id = ?
      ORDER BY s.id DESC
    `;
    return query(sql, [customerId]);
  }

  static async findAll({ status, serviceType, search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT s.*, p.name as product_name, tech.full_name as technician_name
      FROM service_requests s
      LEFT JOIN products p ON s.product_id = p.id
      LEFT JOIN users tech ON s.assigned_technician_id = tech.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND s.status = ?`;
      params.push(status);
    }
    if (serviceType) {
      sql += ` AND s.service_type = ?`;
      params.push(serviceType);
    }
    if (search) {
      sql += ` AND (s.ticket_number LIKE ? OR s.customer_name LIKE ? OR s.customer_phone LIKE ? OR s.serial_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY s.id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    return query(sql, params);
  }

  static async updateStatus(id, { status, assigned_technician_id, technician_notes }) {
    const sql = `
      UPDATE service_requests SET
        status = ?, assigned_technician_id = ?, technician_notes = ?
      WHERE id = ?
    `;
    await query(sql, [status, assigned_technician_id || null, technician_notes || null, id]);
    return this.findById(id);
  }
}
