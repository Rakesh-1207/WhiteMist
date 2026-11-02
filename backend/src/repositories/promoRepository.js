import { query } from '../database/db.js';

export class PromoRepository {
  static async findAllActive() {
    const sql = `SELECT * FROM promo_codes WHERE is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW())`;
    return query(sql);
  }

  static async findByCode(code) {
    if (!code) return null;
    const sql = `
      SELECT * FROM promo_codes 
      WHERE UPPER(code) = UPPER(?) AND is_active = TRUE 
        AND (expires_at IS NULL OR expires_at > NOW())
    `;
    const rows = await query(sql, [code.trim()]);
    return rows[0] || null;
  }
}
