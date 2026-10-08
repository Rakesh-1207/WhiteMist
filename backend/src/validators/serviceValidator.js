import { body } from 'express-validator';

export const serviceRequestValidation = [
  body('customer_name').notEmpty().withMessage('Customer name is required').trim(),
  body('customer_email').isEmail().withMessage('Valid email address is required').normalizeEmail(),
  body('customer_phone').notEmpty().withMessage('Phone number is required').trim(),
  body('service_type').isIn(['INSTALLATION', 'REPAIR', 'MAINTENANCE', 'WARRANTY_SERVICE', 'TECH_SUPPORT']).withMessage('Invalid service type'),
  body('problem_description').notEmpty().withMessage('Problem description is required').trim(),
  body('address_line').notEmpty().withMessage('Address line is required').trim(),
  body('city').notEmpty().withMessage('City is required').trim(),
  body('state').notEmpty().withMessage('State is required').trim(),
  body('postal_code').notEmpty().withMessage('Postal code is required').trim(),
];
