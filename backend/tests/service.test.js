import request from 'supertest';
import app from '../src/app.js';

describe('Service & Installation Management API', () => {
  it('should book an installation service request', async () => {
    const servicePayload = {
      customer_name: 'Priya Sharma',
      customer_email: 'priya@example.com',
      customer_phone: '+91 9776655443',
      service_type: 'INSTALLATION',
      problem_description: 'Installation of new 16-place built-in dishwasher',
      address_line: 'Flat 402, Sunshine Heights',
      city: 'Pune',
      state: 'Maharashtra',
      postal_code: '411001',
      preferred_date: '2026-10-12',
    };

    const res = await request(app).post('/api/v1/services').send(servicePayload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.serviceRequest.ticket_number).toBeDefined();
  });
});
