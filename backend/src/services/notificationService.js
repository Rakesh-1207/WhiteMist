import logger from '../utils/logger.js';

export class NotificationService {
  static async sendEnquiryConfirmation(enquiry) {
    logger.info(`[NotificationService] Sending enquiry confirmation to ${enquiry.email} for enquiry #${enquiry.enquiry_number}`);
    return true;
  }

  static async sendQuoteConfirmation(quote) {
    logger.info(`[NotificationService] Sending quote request confirmation to ${quote.customer_email} for quote #${quote.quote_number}`);
    return true;
  }

  static async sendServiceRequestConfirmation(serviceReq) {
    logger.info(`[NotificationService] Sending service ticket notification to ${serviceReq.customer_email} for ticket #${serviceReq.ticket_number}`);
    return true;
  }

  static async sendOrderConfirmation(order) {
    logger.info(`[NotificationService] Sending order confirmation email to ${order.customer_email} for order #${order.order_number}`);
    return true;
  }
}
