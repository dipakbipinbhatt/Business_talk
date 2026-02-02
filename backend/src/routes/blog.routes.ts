import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllBlogs,
    getAdminBlogs,
    getBlogById,
    getAdminBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogStats,
    seedBlogs,
} from '../controllers/blog.controller';

const router = Router();

// Protected routes (admin only) - MUST come before /:id to avoid conflicts
router.get('/admin/all', authenticateToken, getAdminBlogs);
router.get('/admin/stats', authenticateToken, getBlogStats);
router.post('/admin/seed', authenticateToken, seedBlogs);  // Seed sample blogs
router.get('/admin/:id', authenticateToken, getAdminBlogById);  // Admin can view any blog including drafts
router.post('/', authenticateToken, createBlog);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);

// Public routes - dynamic :id route MUST come last
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

export default router;
