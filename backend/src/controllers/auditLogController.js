import { AuditLogService } from '../services/auditLogService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuditLogController {
  static async getLogs(req, res, next) {
    try {
      const logs = await AuditLogService.getLogs(req.query);
      return ApiResponse.success(res, 'Audit logs retrieved successfully', { logs });
    } catch (error) {
      next(error);
    }
  }
}
