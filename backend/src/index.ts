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

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/blogs', blogRoutes);

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
