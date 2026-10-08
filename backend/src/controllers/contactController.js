import { ContactService } from '../services/contactService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ContactController {
  static async submitContactMessage(req, res, next) {
    try {
      const message = await ContactService.submitContactMessage(req.body);
      return ApiResponse.created(res, 'Thank you! Your contact message has been received.', { message });
    } catch (error) {
      next(error);
    }
  }

  static async getContactMessages(req, res, next) {
    try {
      const messages = await ContactService.getContactMessages(req.query);
      return ApiResponse.success(res, 'Contact messages retrieved', { messages });
    } catch (error) {
      next(error);
    }
  }

  static async updateContactStatus(req, res, next) {
    try {
      const message = await ContactService.updateContactStatus(req.params.id, req.body.status);
      return ApiResponse.success(res, 'Contact message status updated', { message });
    } catch (error) {
      next(error);
    }
  }
}
