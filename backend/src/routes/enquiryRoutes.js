import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { enquiryValidation } from '../validators/enquiryValidator.js';

const router = Router();

// Visitor submission
router.post('/', enquiryValidation, validate, EnquiryController.submitEnquiry);

// Staff / Admin Management
router.get('/', authenticate, authorize('ADMIN', 'SALES_STAFF', 'SUPER_ADMIN'), EnquiryController.getEnquiries);
router.get('/:id', authenticate, authorize('ADMIN', 'SALES_STAFF', 'SUPER_ADMIN'), EnquiryController.getEnquiryById);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'SALES_STAFF', 'SUPER_ADMIN'), EnquiryController.updateEnquiryStatus);

export default router;
