import { body } from 'express-validator';

export const contactValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('subject').optional().trim(),
  body('message').notEmpty().withMessage('Message is required').trim(),
];
