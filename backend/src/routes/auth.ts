import { Router } from 'express';
import { signupController, loginController } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../validators/authValidator';

const router = Router();

router.post('/signup', validate(signupSchema), signupController);
router.post('/login', validate(loginSchema), loginController);

export default router;
