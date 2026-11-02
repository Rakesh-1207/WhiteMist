import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = Router();

router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile', authenticate, UserController.updateProfile);
router.get('/addresses', authenticate, UserController.getAddresses);
router.post('/addresses', authenticate, UserController.addAddress);
router.delete('/addresses/:id', authenticate, UserController.deleteAddress);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), UserController.getAllUsers);

export default router;
