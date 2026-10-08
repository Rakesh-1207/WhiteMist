import { QuoteService } from '../services/quoteService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class QuoteController {
  static async requestQuote(req, res, next) {
    try {
      const quote = await QuoteService.requestQuote(req.body);
      return ApiResponse.created(res, 'Quote request submitted successfully. A customized proposal will be emailed to you.', { quote });
    } catch (error) {
      next(error);
    }
  }

  static async getQuotes(req, res, next) {
    try {
      const quotes = await QuoteService.getQuotes(req.query);
      return ApiResponse.success(res, 'Quote requests retrieved', { quotes });
    } catch (error) {
      next(error);
    }
  }

  static async getQuoteById(req, res, next) {
    try {
      const quote = await QuoteService.getQuoteById(req.params.id);
      return ApiResponse.success(res, 'Quote details retrieved', { quote });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuoteStatus(req, res, next) {
    try {
      const quote = await QuoteService.updateQuoteStatus(req.params.id, req.body, req.user);
      return ApiResponse.success(res, 'Quote status updated', { quote });
    } catch (error) {
      next(error);
    }
  }
}
