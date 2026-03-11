import { Router } from 'express';
import { getAllPodcastTypes, createPodcastType, deletePodcastType } from '../controllers/podcastType.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public route - get all Podcast Types
router.get('/', getAllPodcastTypes);

// Admin routes
router.post('/', authenticateToken, createPodcastType);
router.delete('/:id', authenticateToken, deletePodcastType);

export default router;
