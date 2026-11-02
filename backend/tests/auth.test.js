import request from 'supertest';
import app from '../src/app.js';

describe('Auth REST API Endpoints', () => {
  const credentials = {
    email: `test_customer_${Date.now()}@whitemist.com`,
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

  it('should authenticate with google successfully (both new and existing users)', async () => {
    const googleEmail = `google_user_${Date.now()}@gmail.com`;
    // First time: registers new user with google
    const firstRes = await request(app).post('/api/v1/auth/google').send({
      email: googleEmail,
      full_name: 'Google User',
    });
    expect(firstRes.status).toBe(200);
    expect(firstRes.body.success).toBe(true);
    expect(firstRes.body.data.user.email).toBe(googleEmail);
    expect(firstRes.body.data.tokens.accessToken).toBeDefined();

    // Second time: logs in existing user with google
    const secondRes = await request(app).post('/api/v1/auth/google').send({
      email: googleEmail,
      full_name: 'Google User',
    });
    expect(secondRes.status).toBe(200);
    expect(secondRes.body.success).toBe(true);
    expect(secondRes.body.data.tokens.accessToken).toBeDefined();
  });
});
