import { Router } from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/category.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public route - get all categories
router.get('/', getAllCategories);

// Admin routes
router.post('/', authenticateToken, createCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;
