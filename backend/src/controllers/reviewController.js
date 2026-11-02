import { ReviewService } from '../services/reviewService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ReviewController {
  static async getReviews(req, res, next) {
    try {
      const { productId } = req.query;
      const reviews = await ReviewService.getReviews(productId);
      return ApiResponse.success(res, 'Customer reviews retrieved successfully', { reviews });
    } catch (error) {
      next(error);
    }
  }

  static async submitReview(req, res, next) {
    try {
      const review = await ReviewService.submitReview(req.body);
      return ApiResponse.created(res, 'Thank you! Your review has been saved in the database.', { review });
    } catch (error) {
      next(error);
    }
  }
}
