import { Router } from 'express';
import { getAnalyticsConfig } from '../controllers/analytics.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get analytics configuration (protected - admin only)
router.get('/config', authenticateToken, getAnalyticsConfig);

export default router;
