import { Router } from 'express';
import { ContactController } from '../controllers/contactController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { contactValidation } from '../validators/contactValidator.js';

const router = Router();

router.post('/', contactValidation, validate, ContactController.submitContactMessage);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ContactController.getContactMessages);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ContactController.updateContactStatus);

export default router;
