import { UserService } from '../services/userService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class UserController {
  static async getProfile(req, res, next) {
    try {
      const user = await UserService.getProfile(req.user.id);
      return ApiResponse.success(res, 'User profile retrieved', { user });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const user = await UserService.updateProfile(req.user.id, req.body);
      return ApiResponse.success(res, 'Profile updated successfully', { user });
    } catch (error) {
      next(error);
    }
  }

  static async getAddresses(req, res, next) {
    try {
      const addresses = await UserService.getAddresses(req.user.id);
      return ApiResponse.success(res, 'User addresses retrieved', { addresses });
    } catch (error) {
      next(error);
    }
  }

  static async addAddress(req, res, next) {
    try {
      const addresses = await UserService.addAddress(req.user.id, req.body);
      return ApiResponse.created(res, 'Address added successfully', { addresses });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req, res, next) {
    try {
      const addresses = await UserService.deleteAddress(req.user.id, req.params.id);
      return ApiResponse.success(res, 'Address removed successfully', { addresses });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const { users, total } = await UserService.getAllUsers(req.query);
      return ApiResponse.success(res, 'Users retrieved successfully', { users }, 200, { total });
    } catch (error) {
      next(error);
    }
  }
}
