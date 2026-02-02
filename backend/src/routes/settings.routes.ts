import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route - get settings
router.get('/', getSettings);

// Admin only - update settings
router.put('/', authenticateToken, requireAdmin, updateSettings);

export default router;
