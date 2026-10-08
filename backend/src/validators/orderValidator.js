import { body } from 'express-validator';

export const checkoutValidation = [
  body('items').isArray({ min: 1 }).withMessage('Cart items must be a non-empty array'),
  body('items.*.product_id').isInt().withMessage('Valid product ID is required for each cart item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1 for each cart item'),
  body('shipping_address').isObject().withMessage('Shipping address object is required'),
  body('shipping_address.address_line1').notEmpty().withMessage('Shipping address line 1 is required'),
  body('shipping_address.city').notEmpty().withMessage('City is required'),
  body('shipping_address.state').notEmpty().withMessage('State is required'),
  body('shipping_address.postal_code').notEmpty().withMessage('Postal code is required'),
];
