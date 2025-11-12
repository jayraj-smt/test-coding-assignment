import { Router } from 'express';
import {
  createGenerationController,
  getGenerationsController,
} from '../controllers/generationController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { createGenerationSchema } from '../validators/generationValidator';

const router = Router();

router.post(
  '/',
  authenticate,
  upload.single('image'),
  validate(createGenerationSchema),
  createGenerationController
);

router.get('/', authenticate, getGenerationsController);

export default router;
