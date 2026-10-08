import { ApiError } from '../utils/apiError.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole) && userRole !== 'SUPER_ADMIN') {
      return next(ApiError.forbidden(`Access denied for role '${userRole}'. Required roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
};
