import { QuoteRepository } from '../repositories/quoteRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { NotificationService } from './notificationService.js';
import { ApiError } from '../utils/apiError.js';

export class QuoteService {
  static async requestQuote(data) {
    const quote = await QuoteRepository.create(data);
    await NotificationService.sendQuoteConfirmation(quote);
    return quote;
  }

  static async getQuotes(filters) {
    return QuoteRepository.findAll(filters);
  }

  static async getQuoteById(id) {
    const quote = await QuoteRepository.findById(id);
    if (!quote) throw ApiError.notFound('Quote request not found');
    return quote;
  }

  static async updateQuoteStatus(id, updateData, adminUser) {
    const quote = await QuoteRepository.findById(id);
    if (!quote) throw ApiError.notFound('Quote request not found');

    const updated = await QuoteRepository.updateStatus(id, updateData);

    await AuditLogRepository.log({
      user_id: adminUser?.id,
      user_email: adminUser?.email,
      user_role: adminUser?.role,
      action: 'QUOTE_STATUS_UPDATED',
      entity: 'QUOTE',
      entity_id: id,
      metadata: { previousStatus: quote.status, newStatus: updated.status },
    });

    return updated;
  }
}
