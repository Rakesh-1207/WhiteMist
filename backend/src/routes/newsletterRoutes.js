import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletterController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = Router();

router.post('/subscribe', NewsletterController.subscribe);
router.post('/unsubscribe', NewsletterController.unsubscribe);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), NewsletterController.getSubscribers);

export default router;
