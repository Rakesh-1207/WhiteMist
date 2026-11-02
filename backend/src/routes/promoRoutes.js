import { Router } from 'express';
import { PromoController } from '../controllers/promoController.js';

const router = Router();

router.get('/', PromoController.getAllPromos);
router.post('/validate', PromoController.validatePromo);

export default router;
