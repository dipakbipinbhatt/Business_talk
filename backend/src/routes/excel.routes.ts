import { Router } from 'express';
import { exportPodcastsToExcel } from '../controllers/excel.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Protected admin route for Excel export
router.get('/export', authenticateToken, requireAdmin, exportPodcastsToExcel);

export default router;
