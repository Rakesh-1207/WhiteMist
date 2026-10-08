import request from 'supertest';
import app from '../src/app.js';

describe('Warranty Management API', () => {
  it('should verify an active warranty by serial number', async () => {
    const res = await request(app).get('/api/v1/warranties/verify/WM-DW-2026-9948');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.warranty.serial_number).toBe('WM-DW-2026-9948');
    expect(res.body.data.warranty.is_valid).toBe(true);
  });

  it('should file a warranty claim for a valid serial number', async () => {
    const claimPayload = {
      claim_description: 'Water pump producing abnormal noise during drainage cycle.',
    };

    const res = await request(app)
      .post('/api/v1/warranties/claim/WM-DW-2026-9948')
      .send(claimPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.claim.status).toBe('FILED');
  });
});
