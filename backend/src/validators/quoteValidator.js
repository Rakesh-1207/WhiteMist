import { body } from 'express-validator';

export const quoteValidation = [
  body('customer_name').notEmpty().withMessage('Customer name is required').trim(),
  body('customer_email').isEmail().withMessage('Valid customer email is required').normalizeEmail(),
  body('customer_phone').notEmpty().withMessage('Customer phone is required').trim(),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];
