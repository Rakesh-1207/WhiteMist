import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:slug', CategoryController.getCategoryBySlug);

// Admin routes
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), CategoryController.createCategory);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), CategoryController.updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), CategoryController.deleteCategory);

export default router;
