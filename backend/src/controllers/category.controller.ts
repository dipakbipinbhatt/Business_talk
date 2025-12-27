import { Response } from 'express';
import { Category } from '../models/Category';
import { AuthRequest } from '../middleware/auth';
import { isDBConnected } from '../config/db';

// Default categories for seeding
const defaultCategories = [
    'Education', 'Leadership', 'Technology', 'Psychology',
    'Sustainability', 'Marketing', 'Business', 'Innovation'
];

// Get all categories
export const getAllCategories = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.json(defaultCategories.map((name, i) => ({ _id: String(i), name, slug: name.toLowerCase() })));
            return;
        }

        let categories = await Category.find().sort({ name: 1 });

        // Seed default categories if none exist
        if (categories.length === 0) {
            const seeded = await Category.insertMany(
                defaultCategories.map(name => ({
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-')
                }))
            );
            categories = seeded;
        }

        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
};

// Create category (admin only)
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available' });
            return;
        }

        const { name } = req.body;
        if (!name || !name.trim()) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }

        const existing = await Category.findOne({ name: name.trim() });
        if (existing) {
            res.status(400).json({ message: 'Category already exists' });
            return;
        }

        const category = await Category.create({ name: name.trim() });
        res.status(201).json({ message: 'Category created', category });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Server error creating category' });
    }
};

// Delete category (admin only)
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available' });
            return;
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Server error deleting category' });
    }
};
