import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { serviceRequestValidation } from '../validators/serviceValidator.js';

const router = Router();

router.post('/', optionalAuthenticate, serviceRequestValidation, validate, ServiceController.requestService);
router.get('/my-requests', authenticate, ServiceController.getMyServiceRequests);
router.get('/ticket/:ticketNumber', ServiceController.getServiceByTicket);

// Staff / Admin routes
router.get('/', authenticate, authorize('ADMIN', 'SERVICE_STAFF', 'SUPER_ADMIN'), ServiceController.getServiceRequests);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'SERVICE_STAFF', 'SUPER_ADMIN'), ServiceController.updateServiceStatus);

export default router;
