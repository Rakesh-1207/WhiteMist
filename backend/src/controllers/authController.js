import { AuthService } from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return ApiResponse.created(res, 'Account registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const ip_address = req.ip || req.connection.remoteAddress;
      const result = await AuthService.login({ ...req.body, ip_address });
      return ApiResponse.success(res, 'User logged in successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshTokens(refreshToken);
      return ApiResponse.success(res, 'Token refreshed successfully', tokens);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      await AuthService.changePassword(req.user.id, req.body);
      return ApiResponse.success(res, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      return ApiResponse.success(res, 'Current user profile retrieved', { user: req.user });
    } catch (error) {
      next(error);
    }
  }
}
