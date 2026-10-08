import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = Router();

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/low-stock', InventoryController.getLowStockAlerts);
router.post('/adjust/:productId', InventoryController.adjustStock);
router.get('/logs/:productId', InventoryController.getInventoryLogs);

export default router;
