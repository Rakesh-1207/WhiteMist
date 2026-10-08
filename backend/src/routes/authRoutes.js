import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { registerValidation, loginValidation, changePasswordValidation } from '../validators/authValidator.js';

const router = Router();

router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', loginValidation, validate, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/change-password', authenticate, changePasswordValidation, validate, AuthController.changePassword);
router.get('/me', authenticate, AuthController.me);

export default router;
