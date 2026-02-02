import { Response } from 'express';
import { AboutUs } from '../models/AboutUs';
import { AuthRequest } from '../middleware/auth';
import { isDBConnected } from '../config/db';

// Default content for when DB is not available
const defaultContent = {
    title: 'About Business Talk',
    paragraphs: [
        'Business Talk is your premier podcast for cutting-edge trends, groundbreaking research, valuable insights from notable books, and engaging discussions from the realms of business and academia.',
        'Whether you\'re an academic scholar, researcher, business professional, or entrepreneur, our episodes will inspire you to question the status quo and spark actionable ideas. Our goal is to deliver valuable research insights from the world\'s renowned scholars, sharing their unique perspectives and expertise.',
    ],
};

// Get About Us content (public)
export const getAboutUs = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.json(defaultContent);
            return;
        }

        // Get the first (and should be only) About Us document
        let aboutUs = await AboutUs.findOne();

        // If no document exists, create one with default content
        if (!aboutUs) {
            aboutUs = await AboutUs.create(defaultContent);
        }

        res.json({
            title: aboutUs.title,
            paragraphs: aboutUs.paragraphs,
        });
    } catch (error) {
        console.error('Get About Us error:', error);
        res.status(500).json({ message: 'Server error fetching About Us content' });
    }
};

// Update About Us content (admin only)
export const updateAboutUs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available. Please start MongoDB.' });
            return;
        }

        const { title, paragraphs } = req.body;

        // Validate input
        if (!title || !paragraphs || !Array.isArray(paragraphs)) {
            res.status(400).json({ message: 'Title and paragraphs array are required' });
            return;
        }

        // Find and update, or create if doesn't exist
        let aboutUs = await AboutUs.findOne();

        if (aboutUs) {
            aboutUs.title = title;
            aboutUs.paragraphs = paragraphs;
            await aboutUs.save();
        } else {
            aboutUs = await AboutUs.create({ title, paragraphs });
        }

        res.json({
            message: 'About Us content updated successfully',
            aboutUs: {
                title: aboutUs.title,
                paragraphs: aboutUs.paragraphs,
            },
        });
    } catch (error) {
        console.error('Update About Us error:', error);
        res.status(500).json({ message: 'Server error updating About Us content' });
    }
};
