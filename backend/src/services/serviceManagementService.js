import { ServiceRepository } from '../repositories/serviceRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { NotificationService } from './notificationService.js';
import { ApiError } from '../utils/apiError.js';

export class ServiceManagementService {
  static async requestService(data, currentUser) {
    if (currentUser) {
      data.customer_id = currentUser.id;
      data.customer_name = data.customer_name || currentUser.full_name;
      data.customer_email = data.customer_email || currentUser.email;
      data.customer_phone = data.customer_phone || currentUser.phone;
    }

    const serviceReq = await ServiceRepository.create(data);
    await NotificationService.sendServiceRequestConfirmation(serviceReq);
    return serviceReq;
  }

  static async getServiceRequests(filters) {
    return ServiceRepository.findAll(filters);
  }

  static async getServiceByTicket(ticketNumber) {
    const serviceReq = await ServiceRepository.findByTicketNumber(ticketNumber);
    if (!serviceReq) throw ApiError.notFound('Service request ticket not found');
    return serviceReq;
  }

  static async getCustomerServiceHistory(customerId) {
    return ServiceRepository.findByCustomerId(customerId);
  }

  static async updateServiceStatus(id, updateData, staffUser) {
    const serviceReq = await ServiceRepository.findById(id);
    if (!serviceReq) throw ApiError.notFound('Service request not found');

    const updated = await ServiceRepository.updateStatus(id, updateData);

    await AuditLogRepository.log({
      user_id: staffUser?.id,
      user_email: staffUser?.email,
      user_role: staffUser?.role,
      action: 'SERVICE_STATUS_UPDATED',
      entity: 'SERVICE_REQUEST',
      entity_id: id,
      metadata: { previousStatus: serviceReq.status, newStatus: updated.status },
    });

    return updated;
  }
}
