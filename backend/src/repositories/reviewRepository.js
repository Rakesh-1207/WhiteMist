import { query } from '../database/db.js';

export class ReviewRepository {
  static async findAllApproved(productId = null) {
    let sql = `SELECT * FROM reviews WHERE is_approved = TRUE`;
    const params = [];
    if (productId) {
      sql += ` AND product_id = ?`;
      params.push(productId);
    }
    sql += ` ORDER BY id DESC`;
    const rows = await query(sql, params);
    return rows.map(r => ({
      id: r.id,
      author: r.author,
      role: r.role || 'Verified Buyer',
      city: r.city,
      rating: r.rating,
      comment: r.comment,
      productId: r.product_id,
      date: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    }));
  }

  static async create({ author, role, city, rating, comment, product_id }) {
    const sql = `
      INSERT INTO reviews (author, role, city, rating, comment, product_id, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, TRUE)
    `;
    const result = await query(sql, [
      author,
      role || 'Verified Buyer',
      city,
      rating || 5,
      comment,
      product_id || null,
    ]);
    const inserted = await query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    return inserted[0];
  }
}
