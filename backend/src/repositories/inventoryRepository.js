import { query } from '../database/db.js';

export class InventoryRepository {
  static async getLowStockProducts(threshold = 10) {
    const sql = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN product_categories c ON p.category_id = c.id
      WHERE p.available_quantity <= ? AND p.deleted_at IS NULL
      ORDER BY p.available_quantity ASC
    `;
    return query(sql, [parseInt(threshold, 10)]);
  }

  static async updateStock(productId, { changeType, quantity, reason, userId }) {
    const prodRows = await query(`SELECT available_quantity FROM products WHERE id = ?`, [productId]);
    if (!prodRows[0]) throw new Error('Product not found');

    const previousStock = prodRows[0].available_quantity;
    let newStock = previousStock;

    if (changeType === 'RESTOCK') {
      newStock = previousStock + quantity;
    } else if (changeType === 'ORDER_RESERVED' || changeType === 'ORDER_FULFILLED') {
      newStock = Math.max(0, previousStock - quantity);
    } else if (changeType === 'ORDER_CANCELLED') {
      newStock = previousStock + quantity;
    } else if (changeType === 'MANUAL_ADJUSTMENT') {
      newStock = quantity;
    }

    const stockStatus = newStock === 0 ? 'OUT_OF_STOCK' : newStock <= 5 ? 'LOW_STOCK' : 'IN_STOCK';

    await query(
      `UPDATE products SET available_quantity = ?, stock_status = ? WHERE id = ?`,
      [newStock, stockStatus, productId]
    );

    await query(
      `INSERT INTO inventory_logs (product_id, change_type, quantity, previous_stock, new_stock, reason, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [productId, changeType, quantity, previousStock, newStock, reason || null, userId || null]
    );

    return { productId, previousStock, newStock, stockStatus };
  }

  static async getInventoryLogs(productId) {
    const sql = `
      SELECT il.*, u.full_name as user_name
      FROM inventory_logs il
      LEFT JOIN users u ON il.created_by = u.id
      WHERE il.product_id = ?
      ORDER BY il.id DESC
    `;
    return query(sql, [productId]);
  }
}
