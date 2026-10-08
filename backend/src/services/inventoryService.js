import { InventoryRepository } from '../repositories/inventoryRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';

export class InventoryService {
  static async getLowStockAlerts(threshold) {
    return InventoryRepository.getLowStockProducts(threshold);
  }

  static async adjustStock(productId, data, adminUser) {
    const result = await InventoryRepository.updateStock(productId, {
      ...data,
      userId: adminUser?.id,
    });

    await AuditLogRepository.log({
      user_id: adminUser?.id,
      user_email: adminUser?.email,
      user_role: adminUser?.role,
      action: 'INVENTORY_ADJUSTED',
      entity: 'PRODUCT',
      entity_id: productId,
      metadata: result,
    });

    return result;
  }

  static async getLogs(productId) {
    return InventoryRepository.getInventoryLogs(productId);
  }
}
