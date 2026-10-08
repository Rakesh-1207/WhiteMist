import { WarrantyRepository } from '../repositories/warrantyRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { ApiError } from '../utils/apiError.js';

export class WarrantyService {
  static async registerWarranty(data, currentUser) {
    if (currentUser) {
      data.customer_id = currentUser.id;
      data.customer_name = data.customer_name || currentUser.full_name;
      data.customer_email = data.customer_email || currentUser.email;
    }

    // Default warranty start is purchase_date and end date is purchase_date + 2 years
    const purchaseDate = new Date(data.purchase_date);
    const endDate = new Date(purchaseDate);
    endDate.setFullYear(endDate.getFullYear() + (data.warranty_years || 2));

    data.warranty_start_date = data.purchase_date;
    data.warranty_end_date = endDate.toISOString().split('T')[0];

    const warranty = await WarrantyRepository.create(data);
    return warranty;
  }

  static async verifyWarrantyBySerial(serialNumber) {
    const warranty = await WarrantyRepository.findBySerialNumber(serialNumber);
    if (!warranty) throw ApiError.notFound(`No warranty record found for serial number "${serialNumber}"`);
    return warranty;
  }

  static async fileWarrantyClaim(serialNumber, { claim_description }, currentUser) {
    const warranty = await WarrantyRepository.findBySerialNumber(serialNumber);
    if (!warranty) throw ApiError.notFound('Warranty record not found');
    if (!warranty.is_valid) throw ApiError.badRequest('Warranty for this dishwasher model is expired or void');

    const claimId = await WarrantyRepository.createClaim({
      warranty_id: warranty.id,
      claim_description,
    });

    await AuditLogRepository.log({
      user_id: currentUser?.id,
      user_email: currentUser?.email,
      user_role: currentUser?.role,
      action: 'WARRANTY_CLAIM_FILED',
      entity: 'WARRANTY',
      entity_id: warranty.id,
      metadata: { serial_number: serialNumber, claim_id: claimId },
    });

    return { claimId, serialNumber, status: 'FILED', message: 'Warranty claim filed successfully' };
  }

  static async getAllWarranties(filters) {
    return WarrantyRepository.findAll(filters);
  }
}
