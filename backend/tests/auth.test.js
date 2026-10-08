import request from 'supertest';
import app from '../src/app.js';

describe('Auth REST API Endpoints', () => {
  const credentials = {
    email: 'new_customer_account@whitemist.com',
    password: 'Password123!',
    full_name: 'Test Customer',
    phone: '+919123456789',
  };

  it('should register a new customer and login successfully', async () => {
    // 1. Register
    const regRes = await request(app).post('/api/v1/auth/register').send(credentials);
    expect(regRes.status).toBe(201);
    expect(regRes.body.success).toBe(true);
    expect(regRes.body.data.user).toBeDefined();
    expect(regRes.body.data.tokens.accessToken).toBeDefined();

    // 2. Login
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: credentials.email,
      password: credentials.password,
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.tokens.accessToken).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'customer@example.com',
      password: 'WrongPassword!',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
