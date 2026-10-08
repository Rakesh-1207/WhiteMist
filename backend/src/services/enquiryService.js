import { EnquiryRepository } from '../repositories/enquiryRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { NotificationService } from './notificationService.js';
import { ApiError } from '../utils/apiError.js';

export class EnquiryService {
  static async submitEnquiry(data) {
    const enquiry = await EnquiryRepository.create(data);

    // Trigger Notification
    await NotificationService.sendEnquiryConfirmation(enquiry);

    return enquiry;
  }

  static async getEnquiries(filters) {
    return EnquiryRepository.findAll(filters);
  }

  static async getEnquiryById(id) {
    const enquiry = await EnquiryRepository.findById(id);
    if (!enquiry) throw ApiError.notFound('Enquiry not found');
    return enquiry;
  }

  static async updateEnquiryStatus(id, updateData, adminUser) {
    const enquiry = await EnquiryRepository.findById(id);
    if (!enquiry) throw ApiError.notFound('Enquiry not found');

    const updated = await EnquiryRepository.updateStatus(id, updateData);

    await AuditLogRepository.log({
      user_id: adminUser?.id,
      user_email: adminUser?.email,
      user_role: adminUser?.role,
      action: 'ENQUIRY_STATUS_UPDATED',
      entity: 'ENQUIRY',
      entity_id: id,
      metadata: { previousStatus: enquiry.status, newStatus: updated.status },
    });

    return updated;
  }
}
