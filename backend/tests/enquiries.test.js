import request from 'supertest';
import app from '../src/app.js';

describe('Enquiries & Quote Requests API', () => {
  it('should submit a product enquiry successfully', async () => {
    const enquiryData = {
      name: 'Aditya Birla',
      email: 'aditya@example.com',
      phone: '+91 9988001122',
      location: 'Delhi NCR',
      message: 'Looking to purchase 14-place freestanding dishwasher.',
      preferred_contact_method: 'PHONE',
    };

    const res = await request(app).post('/api/v1/enquiries').send(enquiryData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.enquiry.enquiry_number).toBeDefined();
  });

  it('should submit a request a quote successfully', async () => {
    const quoteData = {
      customer_name: 'Hyatt Regency',
      customer_email: 'procurement@hyatt.com',
      customer_phone: '+91 9811002233',
      location: 'Mumbai',
      quantity: 5,
      message: 'Need commercial quotation for 5 hood dishwashers.',
    };

    const res = await request(app).post('/api/v1/quotes').send(quoteData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quote.quote_number).toBeDefined();
  });
});
