import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.js';

const router = Router();

router.get('/', ReviewController.getReviews);
router.post('/', ReviewController.submitReview);

export default router;
