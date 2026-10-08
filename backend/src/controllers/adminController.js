import { AdminService } from '../services/adminService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AdminController {
  static async getDashboardMetrics(req, res, next) {
    try {
      const data = await AdminService.getDashboardMetrics();
      return ApiResponse.success(res, 'Admin dashboard metrics retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }
}
