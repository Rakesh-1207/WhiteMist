import { Router } from 'express';
import { WarrantyController } from '../controllers/warrantyController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { warrantyRegisterValidation, warrantyClaimValidation } from '../validators/warrantyValidator.js';

const router = Router();

router.get('/verify/:serialNumber', WarrantyController.verifyWarranty);
router.post('/register', optionalAuthenticate, warrantyRegisterValidation, validate, WarrantyController.registerWarranty);
router.post('/claim/:serialNumber', optionalAuthenticate, warrantyClaimValidation, validate, WarrantyController.fileClaim);

// Admin routes
router.get('/', authenticate, authorize('ADMIN', 'SERVICE_STAFF', 'SUPER_ADMIN'), WarrantyController.getAllWarranties);

export default router;
