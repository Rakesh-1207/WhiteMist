import request from 'supertest';
import app from '../src/app.js';

describe('GET /health API', () => {
  it('should return 200 OK with health status and database info', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.service).toBeDefined();
    expect(res.body.database).toBeDefined();
    expect(res.body.database.connected).toBe(true);
  });
});
