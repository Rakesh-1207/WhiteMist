import { query } from '../database/db.js';

export class WarrantyRepository {
  static async create(data) {
    const warrantyCode = `WRN-${data.serial_number || Math.floor(10000 + Math.random() * 90000)}`;
    const sql = `
      INSERT INTO warranties (
        warranty_code, customer_id, customer_name, customer_email, product_id,
        model_number, serial_number, purchase_date, warranty_start_date,
        warranty_end_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      warrantyCode,
      data.customer_id || null,
      data.customer_name,
      data.customer_email,
      data.product_id,
      data.model_number,
      data.serial_number,
      data.purchase_date,
      data.warranty_start_date || data.purchase_date,
      data.warranty_end_date,
      data.status || 'ACTIVE',
    ]);
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const sql = `
      SELECT w.*, p.name as product_name
      FROM warranties w
      JOIN products p ON w.product_id = p.id
      WHERE w.id = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async findBySerialNumber(serialNumber) {
    const sql = `
      SELECT w.*, p.name as product_name, p.sku, p.warranty_years
      FROM warranties w
      JOIN products p ON w.product_id = p.id
      WHERE w.serial_number = ?
    `;
    const rows = await query(sql, [serialNumber]);
    if (!rows[0]) return null;

    const warranty = rows[0];
    const claims = await this.getClaimsByWarrantyId(warranty.id);
    warranty.claims = claims;

    const now = new Date();
    const endDate = new Date(warranty.warranty_end_date);
    warranty.is_valid = now <= endDate && warranty.status === 'ACTIVE';

    return warranty;
  }

  static async createClaim({ warranty_id, claim_description }) {
    const claimNumber = `CLM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sql = `
      INSERT INTO warranty_claims (claim_number, warranty_id, claim_description, status)
      VALUES (?, ?, ?, 'FILED')
    `;
    const result = await query(sql, [claimNumber, warranty_id, claim_description]);
    return result.insertId;
  }

  static async getClaimsByWarrantyId(warrantyId) {
    const sql = `SELECT * FROM warranty_claims WHERE warranty_id = ? ORDER BY id DESC`;
    return query(sql, [warrantyId]);
  }

  static async findAll({ status, search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT w.*, p.name as product_name
      FROM warranties w
      JOIN products p ON w.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ` AND w.status = ?`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (w.serial_number LIKE ? OR w.customer_name LIKE ? OR w.warranty_code LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY w.id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    return query(sql, params);
  }
}
