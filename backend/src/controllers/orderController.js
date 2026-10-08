import { OrderService } from '../services/orderService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class OrderController {
  static async checkout(req, res, next) {
    try {
      const order = await OrderService.checkout(req.body, req.user);
      return ApiResponse.created(res, 'Order placed successfully', { order });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req, res, next) {
    try {
      const orders = await OrderService.getOrders(req.query);
      return ApiResponse.success(res, 'Orders retrieved successfully', { orders });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderByIdOrNumber(req, res, next) {
    try {
      const { idOrNumber } = req.params;
      let order = null;
      if (!isNaN(idOrNumber)) {
        order = await OrderService.getOrderById(idOrNumber);
      } else {
        order = await OrderService.getOrderByNumber(idOrNumber);
      }
      return ApiResponse.success(res, 'Order details retrieved', { order });
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req, res, next) {
    try {
      const orders = await OrderService.getCustomerOrders(req.user.id);
      return ApiResponse.success(res, 'Customer order history retrieved', { orders });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const order = await OrderService.updateOrderStatus(req.params.id, req.body, req.user);
      return ApiResponse.success(res, 'Order status updated successfully', { order });
    } catch (error) {
      next(error);
    }
  }
}
