import { query } from '../database/db.js';

export class CategoryRepository {
  static async findAll() {
    const sql = `SELECT * FROM product_categories WHERE is_active = TRUE ORDER BY display_order ASC`;
    return query(sql);
  }

  static async findById(id) {
    const sql = `SELECT * FROM product_categories WHERE id = ?`;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async findBySlug(slug) {
    const sql = `SELECT * FROM product_categories WHERE slug = ?`;
    const rows = await query(sql, [slug]);
    return rows[0] || null;
  }

  static async create({ slug, name, description, icon, display_order }) {
    const sql = `
      INSERT INTO product_categories (slug, name, description, icon, display_order)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [slug, name, description || null, icon || 'Sparkles', display_order || 0]);
    return this.findById(result.insertId);
  }

  static async update(id, { name, description, icon, is_active, display_order }) {
    const sql = `
      UPDATE product_categories SET
        name = ?, description = ?, icon = ?, is_active = ?, display_order = ?
      WHERE id = ?
    `;
    await query(sql, [name, description, icon, is_active, display_order, id]);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM product_categories WHERE id = ?`;
    await query(sql, [id]);
    return true;
  }
}
