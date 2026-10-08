import { query, getTransaction } from '../database/db.js';

export class OrderRepository {
  static async createOrderWithItems(orderData, items) {
    const tx = await getTransaction();
    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const orderSql = `
        INSERT INTO orders (
          order_number, customer_id, customer_name, customer_email, customer_phone,
          subtotal, tax_amount, shipping_amount, discount_amount, total_amount,
          payment_method, payment_status, order_status, shipping_address_json,
          billing_address_json, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const orderParams = [
        orderNumber,
        orderData.customer_id || null,
        orderData.customer_name,
        orderData.customer_email,
        orderData.customer_phone,
        orderData.subtotal,
        orderData.tax_amount || 0.0,
        orderData.shipping_amount || 0.0,
        orderData.discount_amount || 0.0,
        orderData.total_amount,
        orderData.payment_method || 'CREDIT_CARD',
        orderData.payment_status || 'PENDING',
        orderData.order_status || 'PENDING',
        JSON.stringify(orderData.shipping_address || {}),
        JSON.stringify(orderData.billing_address || {}),
        orderData.notes || null,
      ];

      const result = await tx.query(orderSql, orderParams);
      const orderId = result.insertId;

      for (const item of items) {
        const itemSql = `
          INSERT INTO order_items (
            order_id, product_id, product_name, sku, unit_price, quantity, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await tx.query(itemSql, [
          orderId,
          item.product_id,
          item.product_name,
          item.sku,
          item.unit_price,
          item.quantity,
          item.unit_price * item.quantity,
        ]);

        // Reserve/Deduct Inventory Safely
        await tx.query(
          `UPDATE products SET available_quantity = available_quantity - ?, sold_quantity = sold_quantity + ? WHERE id = ? AND available_quantity >= ?`,
          [item.quantity, item.quantity, item.product_id, item.quantity]
        );
      }

      await tx.commit();
      return this.findById(orderId);
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  static async findById(id) {
    const sql = `SELECT * FROM orders WHERE id = ?`;
    const rows = await query(sql, [id]);
    if (!rows[0]) return null;

    const order = rows[0];
    order.items = await this.getOrderItems(order.id);
    return order;
  }

  static async findByOrderNumber(orderNumber) {
    const sql = `SELECT * FROM orders WHERE order_number = ?`;
    const rows = await query(sql, [orderNumber]);
    if (!rows[0]) return null;

    const order = rows[0];
    order.items = await this.getOrderItems(order.id);
    return order;
  }

  static async getOrderItems(orderId) {
    const sql = `
      SELECT oi.*, p.slug as product_slug, pi.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE oi.order_id = ?
    `;
    return query(sql, [orderId]);
  }

  static async findByCustomerId(customerId) {
    const sql = `SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC`;
    const orders = await query(sql, [customerId]);
    for (const order of orders) {
      order.items = await this.getOrderItems(order.id);
    }
    return orders;
  }

  static async findAll({ status, paymentStatus, search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM orders WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ` AND order_status = ?`;
      params.push(status);
    }
    if (paymentStatus) {
      sql += ` AND payment_status = ?`;
      params.push(paymentStatus);
    }
    if (search) {
      sql += ` AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    const orders = await query(sql, params);
    for (const order of orders) {
      order.items = await this.getOrderItems(order.id);
    }
    return orders;
  }

  static async updateStatus(id, { order_status, payment_status }) {
    const sql = `UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?`;
    await query(sql, [order_status, payment_status, id]);
    return this.findById(id);
  }
}
