import request from 'supertest';
import app from '../src/app.js';

describe('Reviews, Promo Codes, Newsletter & Contact APIs', () => {
  it('should fetch customer reviews', async () => {
    const res = await request(app).get('/api/v1/reviews');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.reviews)).toBe(true);
    expect(res.body.data.reviews.length).toBeGreaterThan(0);
  });

  it('should validate an active promo code', async () => {
    const res = await request(app)
      .post('/api/v1/promo/validate')
      .send({ code: 'MISTWELCOME10', subtotal: 500 });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toBe('MISTWELCOME10');
    expect(res.body.data.discountPercent).toBe(10);
  });

  it('should reject an invalid promo code', async () => {
    const res = await request(app)
      .post('/api/v1/promo/validate')
      .send({ code: 'INVALID_CODE_999', subtotal: 500 });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should subscribe a new email to newsletter', async () => {
    const res = await request(app)
      .post('/api/v1/newsletter/subscribe')
      .send({ email: 'new_subscriber_' + Date.now() + '@example.com' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should submit a contact inquiry', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'Arjun Mehta',
        email: 'arjun@example.com',
        phone: '+91 9876543210',
        message: 'Interested in becoming a distributor for White Mist in Karnataka.'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
