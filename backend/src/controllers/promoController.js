import { PromoService } from '../services/promoService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class PromoController {
  static async getAllPromos(req, res, next) {
    try {
      const promos = await PromoService.getAllActivePromos();
      return ApiResponse.success(res, 'Active promo codes retrieved', { promos });
    } catch (error) {
      next(error);
    }
  }

  static async validatePromo(req, res, next) {
    try {
      const code = req.body.code;
      const subtotal = Number(req.body.subtotal ?? req.body.cartTotal ?? 0);
      const validated = await PromoService.validatePromo(code, subtotal);
      return ApiResponse.success(res, `Coupon code ${validated.code} applied successfully!`, validated);
    } catch (error) {
      next(error);
    }
  }
}
