import { Router } from 'express';
import { getAnalyticsConfig, getAnalyticsData } from '../controllers/analytics.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get analytics configuration (protected - admin only) — existing, unchanged
router.get('/config', authenticateToken, getAnalyticsConfig);

// NEW: Fetch real GA4 metrics via Data API (protected - admin only)
// Usage: GET /api/analytics/data?propertyId=123456789
router.get('/data', authenticateToken, getAnalyticsData);

export default router;