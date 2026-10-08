import { NewsletterService } from '../services/newsletterService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class NewsletterController {
  static async subscribe(req, res, next) {
    try {
      const { email } = req.body;
      const subscriber = await NewsletterService.subscribe(email);
      return ApiResponse.success(res, 'Subscribed to White Mist Dishwashers newsletter successfully', { subscriber });
    } catch (error) {
      next(error);
    }
  }

  static async unsubscribe(req, res, next) {
    try {
      const { email } = req.body;
      await NewsletterService.unsubscribe(email);
      return ApiResponse.success(res, 'Unsubscribed from newsletter successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getSubscribers(req, res, next) {
    try {
      const subscribers = await NewsletterService.getSubscribers();
      return ApiResponse.success(res, 'Newsletter subscribers list retrieved', { subscribers });
    } catch (error) {
      next(error);
    }
  }
}
