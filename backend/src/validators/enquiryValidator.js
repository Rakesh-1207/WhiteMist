import { body } from 'express-validator';

export const enquiryValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required').trim(),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('message').notEmpty().withMessage('Enquiry message is required').trim(),
];
