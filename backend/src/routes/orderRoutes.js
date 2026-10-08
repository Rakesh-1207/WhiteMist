import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { checkoutValidation } from '../validators/orderValidator.js';

const router = Router();

router.post('/checkout', optionalAuthenticate, checkoutValidation, validate, OrderController.checkout);
router.get('/my-orders', authenticate, OrderController.getMyOrders);
router.get('/:idOrNumber', OrderController.getOrderByIdOrNumber);

// Admin routes
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), OrderController.getOrders);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), OrderController.updateOrderStatus);

export default router;
