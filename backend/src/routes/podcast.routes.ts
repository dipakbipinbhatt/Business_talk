import { Router } from 'express';
import {
    getAllPodcasts,
    getPodcastById,
    createPodcast,
    updatePodcast,
    deletePodcast,
    uploadImage,
    getStats,
} from '../controllers/podcast.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllPodcasts);
router.get('/stats', getStats);
router.get('/:id', getPodcastById);

// Protected admin routes
router.post('/', authenticateToken, requireAdmin, createPodcast);
router.put('/:id', authenticateToken, requireAdmin, updatePodcast);
router.delete('/:id', authenticateToken, requireAdmin, deletePodcast);
router.post(
    '/upload',
    authenticateToken,
    requireAdmin,
    upload.single('image'),
    uploadImage
);

export default router;
