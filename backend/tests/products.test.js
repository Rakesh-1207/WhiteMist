import request from 'supertest';
import app from '../src/app.js';

describe('Products REST API Endpoints', () => {
  it('should list all active dishwasher products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should filter dishwashers by category and capacity', async () => {
    const res = await request(app).get('/api/v1/products?category=freestanding&capacity=14');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fetch dishwasher details by slug', async () => {
    const res = await request(app).get('/api/v1/products/wm-masterclean-14-freestanding');
    expect(res.status).toBe(200);
    expect(res.body.data.product).toBeDefined();
    expect(res.body.data.product.sku).toBe('WM-DW-14F');
  });
});
