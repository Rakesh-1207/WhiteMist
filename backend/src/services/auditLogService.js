import { AuditLogRepository } from '../repositories/auditLogRepository.js';

export class AuditLogService {
  static async getLogs(filters) {
    return AuditLogRepository.findAll(filters);
  }
}
