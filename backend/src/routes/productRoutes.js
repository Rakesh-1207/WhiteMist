import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { productCreateValidation } from '../validators/productValidator.js';

const router = Router();

// Public routes
router.get('/', ProductController.getProducts);
router.get('/:idOrSlug', ProductController.getProductBySlugOrId);

// Admin routes
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), productCreateValidation, validate, ProductController.createProduct);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ProductController.updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), ProductController.deleteProduct);

export default router;
