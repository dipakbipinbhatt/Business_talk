import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { config } from './config/env';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import podcastRoutes from './routes/podcast.routes';
import blogRoutes from './routes/blog.routes';
import categoryRoutes from './routes/category.routes';

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS - Allow frontend and all Render deployments
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        // Allow Render.com deployments
        if (origin.includes('.onrender.com')) {
            return callback(null, true);
        }

        // Allow configured frontend URL
        if (origin === config.cors.frontendUrl) {
            return callback(null, true);
        }

        // Allow Netlify and Vercel deployments
        if (origin.includes('.netlify.app') || origin.includes('.vercel.app')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

// Body parsing - increased limit for Base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route - API documentation
app.get('/', (_req, res) => {
    res.json({
        message: 'Business Talk API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register',
                refresh: 'POST /api/auth/refresh',
                me: 'GET /api/auth/me',
            },
            podcasts: {
                getAll: 'GET /api/podcasts',
                getOne: 'GET /api/podcasts/:id',
                create: 'POST /api/podcasts (admin)',
                update: 'PUT /api/podcasts/:id (admin)',
                delete: 'DELETE /api/podcasts/:id (admin)',
            },
            blogs: {
                getAll: 'GET /api/blogs',
                getOne: 'GET /api/blogs/:id',
                create: 'POST /api/blogs (admin)',
                update: 'PUT /api/blogs/:id (admin)',
                delete: 'DELETE /api/blogs/:id (admin)',
            },
        },
        documentation: 'See README.md for full API documentation',
    });
});

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed endpoint - trigger database seed from browser
// Access: /api/admin/seed?key=businesstalk2024
app.get('/api/admin/seed', async (req, res) => {
    const secretKey = req.query.key;

    // Simple key protection
    if (secretKey !== 'businesstalk2024') {
        return res.status(401).json({ error: 'Unauthorized. Provide correct key.' });
    }

    try {
        const { User } = await import('./models/User');
        const { Podcast } = await import('./models/Podcast');

        // Clear existing data
        await User.deleteMany({});
        await Podcast.deleteMany({});

        // Create admin user
        const admin = await User.create({
            email: config.admin.email,
            password: config.admin.password,
            name: 'Admin',
            role: 'admin',
        });

        // Create sample podcasts with local images
        const samplePodcasts = [
            {
                title: 'Seeing Beyond the Here and Now: How Corporate Purpose Combats Corporate Myopia',
                description: 'Research insights on how corporate purpose helps companies look beyond short-term pressures.',
                category: 'upcoming',
                guestName: 'Dr. Tima Bansal',
                guestTitle: 'Professor of Sustainability & Strategy',
                guestInstitution: 'Ivey Business School',
                guestImage: '/uploads/ep309-tima-bansal-promo.jpg',
                thumbnailImage: '/uploads/ep309-tima-bansal-promo.jpg',
                episodeNumber: 309,
                scheduledDate: new Date('2025-12-22'),
                scheduledTime: '10:00 PM IST',
                tags: ['sustainability', 'strategy'],
            },
            {
                title: 'FUJI: A Mountain in the Making - Japanese History & Environment',
                description: 'Exploring Japanese History through Mount Fuji.',
                category: 'upcoming',
                guestName: 'Dr. Andrew Bernstein',
                guestTitle: 'Professor of History',
                guestInstitution: 'Lewis & Clark College',
                guestImage: '/uploads/ep277-andrew-bernstein-promo.jpg',
                thumbnailImage: '/uploads/ep277-andrew-bernstein-promo.jpg',
                episodeNumber: 277,
                scheduledDate: new Date('2026-01-05'),
                scheduledTime: '10:00 PM IST',
                tags: ['history', 'Japan'],
            },
            {
                title: 'Creating Social Change: From i-level to g-level Interventions',
                description: 'Research on effective interventions for social change.',
                category: 'upcoming',
                guestName: 'Dr. Amir Grinstein',
                guestTitle: 'Patrick F. & Helen C. Walsh Research Professor',
                guestInstitution: "Northeastern University",
                guestImage: '/uploads/ep303-amir-grinstein-promo.jpg',
                thumbnailImage: '/uploads/ep303-amir-grinstein-promo.jpg',
                episodeNumber: 303,
                scheduledDate: new Date('2026-01-05'),
                scheduledTime: '11:30 PM IST',
                tags: ['social change', 'marketing'],
            },
            {
                title: "Creativity in the Age of AI: Prof. Jerry Wind's Toolkit",
                description: 'Learn how to leverage AI tools while maintaining human creativity.',
                category: 'past',
                guestName: 'Prof. Jerry Wind',
                guestTitle: 'Lauder Professor Emeritus of Marketing',
                guestInstitution: 'The Wharton School',
                guestImage: '',
                episodeNumber: 310,
                scheduledDate: new Date('2024-12-18'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=_oqimM070f0',
                tags: ['AI', 'creativity'],
            },
            {
                title: 'Teaching with Cases: Methods from Dr. Urs Mueller',
                description: 'Master the art of case-based teaching.',
                category: 'past',
                guestName: 'Dr. Urs Mueller',
                guestTitle: 'Professor of Strategy',
                guestInstitution: 'INSEAD',
                guestImage: '',
                episodeNumber: 308,
                scheduledDate: new Date('2024-12-11'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=Qb0QfdAj1B0',
                tags: ['education', 'case method'],
            },
        ];

        await Podcast.insertMany(samplePodcasts);

        res.json({
            success: true,
            message: 'Database seeded successfully!',
            admin: { email: admin.email },
            podcasts: samplePodcasts.length,
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Seed failed', details: String(error) });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Environment: ${config.server.nodeEnv}`);
});

export default app;
