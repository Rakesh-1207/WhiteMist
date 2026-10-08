import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'White Mist Dishwashers REST API',
    version: '1.0.0',
    description: 'Production-ready REST API & MySQL Database System for Commercial & Residential Dishwashers Appliance Company',
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Local Development Server' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'System and MySQL Database Health Check',
        responses: {
          200: { description: 'System healthy' },
          503: { description: 'Database unavailable' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register a new customer account',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'customer@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  full_name: { type: 'string', example: 'John Doe' },
                  phone: { type: 'string', example: '+91 9876543210' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Customer created' } },
      },
    },
    '/products': {
      get: {
        summary: 'List & search dishwasher products with multi-attribute filters',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'capacity', in: 'query', schema: { type: 'number' } },
          { name: 'noiseLevel', in: 'query', schema: { type: 'number' } },
          { name: 'energyRating', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Products list' } },
      },
    },
    '/enquiries': {
      post: {
        summary: 'Submit a dishwasher product enquiry',
        responses: { 201: { description: 'Enquiry received' } },
      },
    },
    '/quotes': {
      post: {
        summary: 'Request a customized commercial or residential quote',
        responses: { 201: { description: 'Quote request recorded' } },
      },
    },
    '/services': {
      post: {
        summary: 'Book installation, repair, maintenance or warranty service',
        responses: { 201: { description: 'Service ticket created' } },
      },
    },
    '/warranties/verify/{serialNumber}': {
      get: {
        summary: 'Check dishwasher warranty status and claims history by serial number',
        parameters: [{ name: 'serialNumber', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Warranty details' } },
      },
    },
    '/orders/checkout': {
      post: {
        summary: 'Process dishwasher cart purchase & create database order',
        responses: { 201: { description: 'Order completed' } },
      },
    },
    '/admin/dashboard': {
      get: {
        summary: 'Executive dashboard metrics, statistics, and low-stock alerts',
        responses: { 200: { description: 'Dashboard metrics' } },
      },
    },
  },
};

const router = Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

export default router;
