import { Router } from 'express';
import { getAboutUs, updateAboutUs } from '../controllers/aboutus.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route
router.get('/', getAboutUs);

// Protected admin route
router.put('/', authenticateToken, requireAdmin, updateAboutUs);

export default router;
