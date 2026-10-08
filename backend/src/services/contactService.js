import { ContactRepository } from '../repositories/contactRepository.js';
import { ApiError } from '../utils/apiError.js';

export class ContactService {
  static async submitContactMessage(data) {
    return ContactRepository.create(data);
  }

  static async getContactMessages(filters) {
    return ContactRepository.findAll(filters);
  }

  static async updateContactStatus(id, status) {
    const existing = await ContactRepository.findById(id);
    if (!existing) throw ApiError.notFound('Contact message not found');
    return ContactRepository.updateStatus(id, status);
  }
}
