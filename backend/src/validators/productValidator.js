import { body } from 'express-validator';

export const productCreateValidation = [
  body('sku').notEmpty().withMessage('SKU code is required').trim(),
  body('model_number').notEmpty().withMessage('Model number is required').trim(),
  body('name').notEmpty().withMessage('Product name is required').trim(),
  body('category_id').isInt().withMessage('Valid category ID is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discount_price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Discount price must be a positive number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1 place setting'),
  body('noise_level').optional().isInt({ min: 20, max: 100 }).withMessage('Noise level must be in dB'),
];
