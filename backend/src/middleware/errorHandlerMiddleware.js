import { ApiError } from '../utils/apiError.js';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  logger.error(`[API Error] ${req.method} ${req.originalUrl} - ${error.statusCode} ${error.message}`, {
    stack: error.stack,
    errors: error.errors,
  });

  const response = {
    success: false,
    message: error.message,
    error: {
      statusCode: error.statusCode,
      errors: error.errors.length > 0 ? error.errors : undefined,
      ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    },
  };

  res.status(error.statusCode).json(response);
};
