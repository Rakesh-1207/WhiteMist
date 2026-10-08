import request from 'supertest';
import app from '../src/app.js';

describe('Orders & Checkout API', () => {
  it('should process cart checkout and create an order', async () => {
    const checkoutPayload = {
      customer_name: 'Sneha Patel',
      customer_email: 'sneha@example.com',
      customer_phone: '+91 9898989898',
      items: [
        { product_id: 1, quantity: 1 },
      ],
      shipping_address: {
        address_line1: 'B-102 Green Park',
        city: 'Ahmedabad',
        state: 'Gujarat',
        postal_code: '380015',
      },
      payment_method: 'CREDIT_CARD',
    };

    const res = await request(app).post('/api/v1/orders/checkout').send(checkoutPayload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.order.order_number).toBeDefined();
    expect(res.body.data.order.items.length).toBe(1);
  });
});
