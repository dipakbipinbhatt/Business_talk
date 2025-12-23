import { Response } from 'express';
import { Podcast } from '../models/Podcast.js';
import { AuthRequest } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';

// Mock data for demo mode
const mockPodcasts = [
    {
        _id: '1',
        title: 'Building Sustainable Organizations: Dr. Tima Bansal on Leadership and Environmental Responsibility',
        description: 'Dr. Tima Bansal discusses how businesses can balance profitability with environmental sustainability.',
        category: 'upcoming',
        guestName: 'Dr. Tima Bansal',
        guestTitle: 'Professor of Strategy',
        guestInstitution: 'Ivey Business School',
        guestImage: '/uploads/default-avatar.png',
        thumbnailImage: 'https://static.wixstatic.com/media/70d1c9_c404612432ea4622a12c96c72d0e112d~mv2.png/v1/fill/w_646,h_365,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dr_%20Tima%20Bansal%20-%20YouTube%20%26%20Website.png',
        episodeNumber: 309,
        scheduledDate: '2025-01-08T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        tags: ['sustainability', 'leadership', 'strategy'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '2',
        title: 'The Art of Resilience: Dr. Andrew Bernstein on Overcoming Business Challenges',
        description: 'Insights on building resilient organizations and personal leadership skills.',
        category: 'upcoming',
        guestName: 'Dr. Andrew Bernstein',
        guestTitle: 'Founder & CEO',
        guestInstitution: 'ActivInsight',
        guestImage: '/uploads/default-avatar.png',
        thumbnailImage: 'https://static.wixstatic.com/media/70d1c9_70c7dfe6ada94d1aa99e76bb9e21823a~mv2.png/v1/fill/w_646,h_365,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dr_%20Andrew%20Bernstein%20-%20YouTube%20%26%20Website.png',
        episodeNumber: 277,
        scheduledDate: '2025-01-15T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        tags: ['resilience', 'leadership', 'psychology'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '3',
        title: 'Marketing in a Changing World: Dr. Amir Grinstein on Consumer Behavior and Innovation',
        description: 'Exploring how consumer behavior is evolving and what it means for marketing strategies.',
        category: 'upcoming',
        guestName: 'Dr. Amir Grinstein',
        guestTitle: 'Professor of Marketing',
        guestInstitution: 'Northeastern University',
        guestImage: '/uploads/default-avatar.png',
        thumbnailImage: 'https://static.wixstatic.com/media/70d1c9_37fc24c7ec40466287400670498484cb~mv2.png/v1/fill/w_646,h_365,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Dr_%20Amir%20Grinstein%20-%20YouTube%20%26%20Website.png',
        episodeNumber: 303,
        scheduledDate: '2025-01-22T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        tags: ['marketing', 'consumer behavior', 'innovation'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '4',
        title: "Creativity in the Age of AI: Prof. Jerry Wind's Toolkit for the Modern Mind",
        description: 'Learn how to leverage AI tools while maintaining human creativity.',
        category: 'past',
        guestName: 'Prof. Jerry Wind',
        guestTitle: 'Lauder Professor Emeritus of Marketing',
        guestInstitution: 'The Wharton School',
        guestImage: '/uploads/default-avatar.png',
        episodeNumber: 308,
        scheduledDate: '2024-12-18T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        youtubeUrl: 'https://www.youtube.com/watch?v=_oqimM070f0',
        spotifyUrl: 'https://open.spotify.com/show/businesstalk',
        applePodcastUrl: 'https://podcasts.apple.com/businesstalk',
        tags: ['AI', 'creativity', 'marketing'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '5',
        title: 'Teaching with Cases: Proven Methods from Dr. Urs Mueller',
        description: 'Master the art of case-based teaching with insights from a leading educator.',
        category: 'past',
        guestName: 'Dr. Urs Mueller',
        guestTitle: 'Professor of Strategy',
        guestInstitution: 'INSEAD',
        guestImage: '/uploads/default-avatar.png',
        episodeNumber: 307,
        scheduledDate: '2024-12-11T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        youtubeUrl: 'https://www.youtube.com/watch?v=Qb0QfdAj1B0',
        spotifyUrl: 'https://open.spotify.com/show/businesstalk',
        tags: ['education', 'case method', 'teaching'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '6',
        title: 'Why Anxiety Is Essential to Being Human | Dr. Samir Chopra',
        description: 'Exploring the role of anxiety in human experience and decision-making.',
        category: 'past',
        guestName: 'Dr. Samir Chopra',
        guestTitle: 'Professor of Philosophy',
        guestInstitution: 'Brooklyn College',
        guestImage: '/uploads/default-avatar.png',
        episodeNumber: 306,
        scheduledDate: '2024-12-04T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        youtubeUrl: 'https://www.youtube.com/watch?v=MZ2DI94Rleg',
        spotifyUrl: 'https://open.spotify.com/show/businesstalk',
        tags: ['philosophy', 'psychology', 'anxiety'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '7',
        title: 'How Great Leaders Reframe Decisions: Dr. Michael Gillespie on "Distancing"',
        description: 'Strategic decision-making techniques used by world-class leaders.',
        category: 'past',
        guestName: 'Dr. Michael Gillespie',
        guestTitle: 'Professor of Political Science',
        guestInstitution: 'Duke University',
        guestImage: '/uploads/default-avatar.png',
        episodeNumber: 305,
        scheduledDate: '2024-11-27T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        youtubeUrl: 'https://www.youtube.com/watch?v=yuISduFi3Ig',
        spotifyUrl: 'https://open.spotify.com/show/businesstalk',
        tags: ['leadership', 'decision-making', 'strategy'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '8',
        title: 'Who Should Regulate the Digital World? Research Insights from Dr. Cary Coglianese',
        description: 'A comprehensive look at digital regulation and governance challenges.',
        category: 'past',
        guestName: 'Dr. Cary Coglianese',
        guestTitle: 'Edward B. Shils Professor of Law',
        guestInstitution: 'University of Pennsylvania Law School',
        guestImage: '/uploads/default-avatar.png',
        episodeNumber: 304,
        scheduledDate: '2024-11-20T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        youtubeUrl: 'https://www.youtube.com/watch?v=Sk7zUeXHRyk',
        spotifyUrl: 'https://open.spotify.com/show/businesstalk',
        tags: ['regulation', 'digital', 'law'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        _id: '9',
        title: 'How Inflation Works - Insights from UC Berkeley Economist Dr. Martha Olney',
        description: 'Understanding inflation mechanics and its impact on the economy.',
        category: 'past',
        guestName: 'Dr. Martha Olney',
        guestTitle: 'Adjunct Professor of Economics',
        guestInstitution: 'UC Berkeley',
        guestImage: '/uploads/default-avatar.png',
        episodeNumber: 303,
        scheduledDate: '2024-11-13T00:00:00.000Z',
        scheduledTime: '10:00 AM EST',
        youtubeUrl: 'https://www.youtube.com/watch?v=rvWCquQDUcc',
        spotifyUrl: 'https://open.spotify.com/show/businesstalk',
        tags: ['economics', 'inflation', 'finance'],
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Get all podcasts (public)
export const getAllPodcasts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category, limit, page = 1 } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = limit ? parseInt(limit as string, 10) : 50;

        // Use mock data if DB not connected
        if (!isDBConnected()) {
            let filtered = [...mockPodcasts];
            if (category && (category === 'upcoming' || category === 'past')) {
                filtered = filtered.filter(p => p.category === category);
            }
            res.json({
                podcasts: filtered,
                pagination: {
                    total: filtered.length,
                    page: pageNum,
                    pages: 1,
                    limit: limitNum,
                },
            });
            return;
        }

        const query: Record<string, unknown> = {};
        if (category && (category === 'upcoming' || category === 'past')) {
            query.category = category;
        }

        const skip = (pageNum - 1) * limitNum;

        const [podcasts, total] = await Promise.all([
            Podcast.find(query)
                .sort({ scheduledDate: category === 'upcoming' ? 1 : -1 })
                .skip(skip)
                .limit(limitNum),
            Podcast.countDocuments(query),
        ]);

        res.json({
            podcasts,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                limit: limitNum,
            },
        });
    } catch (error) {
        console.error('Get podcasts error:', error);
        res.status(500).json({ message: 'Server error fetching podcasts' });
    }
};

// Get single podcast (public)
export const getPodcastById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            const podcast = mockPodcasts.find(p => p._id === req.params.id);
            if (!podcast) {
                res.status(404).json({ message: 'Podcast not found' });
                return;
            }
            res.json(podcast);
            return;
        }

        const podcast = await Podcast.findById(req.params.id);

        if (!podcast) {
            res.status(404).json({ message: 'Podcast not found' });
            return;
        }

        res.json(podcast);
    } catch (error) {
        console.error('Get podcast error:', error);
        res.status(500).json({ message: 'Server error fetching podcast' });
    }
};

// Create podcast (admin only)
export const createPodcast = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available. Please start MongoDB.' });
            return;
        }

        const podcast = await Podcast.create(req.body);
        res.status(201).json({
            message: 'Podcast created successfully',
            podcast,
        });
    } catch (error) {
        console.error('Create podcast error:', error);
        res.status(500).json({ message: 'Server error creating podcast' });
    }
};

// Update podcast (admin only)
export const updatePodcast = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available. Please start MongoDB.' });
            return;
        }

        const podcast = await Podcast.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!podcast) {
            res.status(404).json({ message: 'Podcast not found' });
            return;
        }

        res.json({
            message: 'Podcast updated successfully',
            podcast,
        });
    } catch (error) {
        console.error('Update podcast error:', error);
        res.status(500).json({ message: 'Server error updating podcast' });
    }
};

// Delete podcast (admin only)
export const deletePodcast = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            res.status(503).json({ message: 'Database not available. Please start MongoDB.' });
            return;
        }

        const podcast = await Podcast.findByIdAndDelete(req.params.id);

        if (!podcast) {
            res.status(404).json({ message: 'Podcast not found' });
            return;
        }

        res.json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        console.error('Delete podcast error:', error);
        res.status(500).json({ message: 'Server error deleting podcast' });
    }
};

// Upload image
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({
            message: 'Image uploaded successfully',
            imageUrl,
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ message: 'Server error uploading image' });
    }
};

// Get podcast statistics
export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!isDBConnected()) {
            const upcoming = mockPodcasts.filter(p => p.category === 'upcoming').length;
            const past = mockPodcasts.filter(p => p.category === 'past').length;
            res.json({
                total: mockPodcasts.length,
                upcoming,
                past,
            });
            return;
        }

        const [totalPodcasts, upcomingCount, pastCount] = await Promise.all([
            Podcast.countDocuments(),
            Podcast.countDocuments({ category: 'upcoming' }),
            Podcast.countDocuments({ category: 'past' }),
        ]);

        res.json({
            total: totalPodcasts,
            upcoming: upcomingCount,
            past: pastCount,
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};
