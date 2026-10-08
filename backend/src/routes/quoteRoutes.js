import { Router } from 'express';
import { QuoteController } from '../controllers/quoteController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { quoteValidation } from '../validators/quoteValidator.js';

const router = Router();

router.post('/', quoteValidation, validate, QuoteController.requestQuote);
router.get('/', authenticate, authorize('ADMIN', 'SALES_STAFF', 'SUPER_ADMIN'), QuoteController.getQuotes);
router.get('/:id', authenticate, authorize('ADMIN', 'SALES_STAFF', 'SUPER_ADMIN'), QuoteController.getQuoteById);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'SALES_STAFF', 'SUPER_ADMIN'), QuoteController.updateQuoteStatus);

export default router;
