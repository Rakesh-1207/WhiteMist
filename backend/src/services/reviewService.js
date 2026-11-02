import { ReviewRepository } from '../repositories/reviewRepository.js';
import { ApiError } from '../utils/apiError.js';

export class ReviewService {
  static async getReviews(productId) {
    return ReviewRepository.findAllApproved(productId);
  }

  static async submitReview(reviewData) {
    if (!reviewData.author || !reviewData.comment) {
      throw ApiError.badRequest('Author name and comment are required');
    }
    return ReviewRepository.create(reviewData);
  }
}
