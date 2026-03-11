import { Response } from 'express';
import { PodcastType } from '../models/PodcastType';
import { AuthRequest } from '../middleware/auth';
import { isDBConnected } from '../config/db';

// Default categories for seeding
const defaultCategories = [
    'Book', 'Research'
];

// Get all categories
export const getAllPodcastTypes = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.json(defaultCategories.map((name, i) => ({ _id: String(i), name, slug: name.toLowerCase() })));
            return;
        }

        let types = await PodcastType.find().sort({ name: 1 });

        if (types.length === 0) {
            const seeded = await PodcastType.insertMany(
                defaultCategories.map(name => ({
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-')
                }))
            );
            types = seeded;
        }

        res.json(types);
    } catch (error) {
        console.error('Get Podcast Type error:', error);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
};

// Create Podcast Type (admin only)
export const createPodcastType = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available' });
            return;
        }

        const { name } = req.body;
        if (!name || !name.trim()) {
            res.status(400).json({ message: 'Podcast Type name is required' });
            return;
        }

        const existing = await PodcastType.findOne({ name: name.trim() });
        if (existing) {
            res.status(400).json({ message: 'Category already exists' });
            return;
        }

        const category = await PodcastType.create({ name: name.trim() });
        res.status(201).json({ message: 'Podcast Type created', category });
    } catch (error) {
        console.error('Create Podcast Type error:', error);
        res.status(500).json({ message: 'Server error creating category' });
    }
};

// Delete Podcast Type (admin only)
export const deletePodcastType = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available' });
            return;
        }

        const type = await PodcastType.findByIdAndDelete(req.params.id);
        if (!type) {
            res.status(404).json({ message: 'Podcast Type not found' });
            return;
        }

        res.json({ message: 'Podcasat Type deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Server error deleting category' });
    }
};
