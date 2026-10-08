import { InventoryService } from '../services/inventoryService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class InventoryController {
  static async getLowStockAlerts(req, res, next) {
    try {
      const threshold = req.query.threshold || 10;
      const products = await InventoryService.getLowStockAlerts(threshold);
      return ApiResponse.success(res, 'Low stock products retrieved', { products });
    } catch (error) {
      next(error);
    }
  }

  static async adjustStock(req, res, next) {
    try {
      const result = await InventoryService.adjustStock(req.params.productId, req.body, req.user);
      return ApiResponse.success(res, 'Inventory stock level adjusted', { result });
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryLogs(req, res, next) {
    try {
      const logs = await InventoryService.getLogs(req.params.productId);
      return ApiResponse.success(res, 'Inventory audit logs retrieved', { logs });
    } catch (error) {
      next(error);
    }
  }
}
