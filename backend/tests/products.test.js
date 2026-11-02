import request from 'supertest';
import app from '../src/app.js';

describe('Products REST API Endpoints', () => {
  it('should list all active products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/v1/products?category=liquid-detergent');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fetch product details by slug', async () => {
    const res = await request(app).get('/api/v1/products/wm-blue-ocean');
    expect(res.status).toBe(200);
    expect(res.body.data.product).toBeDefined();
    expect(res.body.data.product.sku).toBe('WM-LD-2L-BLU');
  });

  it('should fetch super saver bundle', async () => {
    const res = await request(app).get('/api/v1/products/bundle/super-saver');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bundle).toBeDefined();
  });
});
