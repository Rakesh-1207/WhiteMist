import { query } from '../database/db.js';

export class NewsletterRepository {
  static async subscribe(email) {
    const sql = `
      INSERT INTO newsletter_subscribers (email, status, subscribed_at)
      VALUES (?, 'SUBSCRIBED', NOW())
      ON DUPLICATE KEY UPDATE status = 'SUBSCRIBED', unsubscribed_at = NULL
    `;
    await query(sql, [email]);
    return this.findByEmail(email);
  }

  static async unsubscribe(email) {
    const sql = `
      UPDATE newsletter_subscribers SET status = 'UNSUBSCRIBED', unsubscribed_at = NOW()
      WHERE email = ?
    `;
    await query(sql, [email]);
    return true;
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM newsletter_subscribers WHERE email = ?`;
    const rows = await query(sql, [email]);
    return rows[0] || null;
  }

  static async findAll() {
    const sql = `SELECT * FROM newsletter_subscribers ORDER BY id DESC`;
    return query(sql);
  }
}
