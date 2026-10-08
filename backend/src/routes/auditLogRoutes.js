import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = Router();

router.use(authenticate, authorize('SUPER_ADMIN'));
router.get('/', AuditLogController.getLogs);

export default router;
