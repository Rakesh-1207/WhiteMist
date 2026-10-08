import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import quoteRoutes from './quoteRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import warrantyRoutes from './warrantyRoutes.js';
import orderRoutes from './orderRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import contactRoutes from './contactRoutes.js';
import newsletterRoutes from './newsletterRoutes.js';
import adminRoutes from './adminRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import healthRoutes from './healthRoutes.js';
import docsRoutes from './docsRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/quotes', quoteRoutes);
router.use('/services', serviceRoutes);
router.use('/warranties', warrantyRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/admin', adminRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/docs', docsRoutes);

export default router;
