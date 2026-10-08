import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.param || err.path,
      message: err.msg,
    }));
    return next(ApiError.badRequest('Validation error', extractedErrors));
  }
  next();
};
