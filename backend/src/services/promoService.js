import { PromoRepository } from '../repositories/promoRepository.js';
import { ApiError } from '../utils/apiError.js';

export class PromoService {
  static async getAllActivePromos() {
    return PromoRepository.findAllActive();
  }

  static async validatePromo(code, subtotal = 0) {
    if (!code) {
      throw ApiError.badRequest('Promo code is required');
    }

    const promo = await PromoRepository.findByCode(code);
    if (!promo) {
      throw ApiError.badRequest('Invalid or expired coupon code');
    }

    const minOrder = parseFloat(promo.min_order_amount || 0);
    const orderSubtotal = parseFloat(subtotal || 0);

    if (orderSubtotal < minOrder) {
      throw ApiError.badRequest(`This promo code requires a minimum order amount of ₹${minOrder}`);
    }

    let discountAmount = 0;
    if (promo.discount_type === 'percent') {
      discountAmount = Math.round((orderSubtotal * parseFloat(promo.discount)) / 100);
    } else {
      discountAmount = parseFloat(promo.discount);
    }

    // Ensure discount does not exceed subtotal
    discountAmount = Math.min(discountAmount, orderSubtotal);

    return {
      code: promo.code,
      discount: discountAmount,
      discountType: promo.discount_type,
      discountPercent: promo.discount_type === 'percent' ? parseFloat(promo.discount) : null,
      description: promo.description,
      minOrderAmount: minOrder,
    };
  }
}
