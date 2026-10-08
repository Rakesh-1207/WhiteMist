import { body } from 'express-validator';

export const warrantyRegisterValidation = [
  body('customer_name').notEmpty().withMessage('Customer name is required').trim(),
  body('customer_email').isEmail().withMessage('Valid customer email is required').normalizeEmail(),
  body('product_id').isInt().withMessage('Valid product ID is required'),
  body('model_number').notEmpty().withMessage('Model number is required').trim(),
  body('serial_number').notEmpty().withMessage('Serial number is required').trim(),
  body('purchase_date').isISO8601().withMessage('Valid purchase date is required (YYYY-MM-DD)'),
];

export const warrantyClaimValidation = [
  body('claim_description').notEmpty().withMessage('Claim description is required').trim(),
];
