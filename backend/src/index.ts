import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';

import { config } from './config/env';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import podcastRoutes from './routes/podcast.routes';
import blogRoutes from './routes/blog.routes';
import categoryRoutes from './routes/category.routes';
import importRoutes from './routes/import.routes';
import aboutUsRoutes from './routes/aboutus.routes';
import renderRoutes from './routes/render.routes';
import mongoRoutes from './routes/mongodb.routes';
import settingsRoutes from './routes/settings.routes';
import analyticsRoutes from './routes/analytics.routes';

const app = express();

app.set('trust proxy', 1);
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

        // Allow EC2 IP address (with or without protocol)
        if (origin.includes('13.234.32.101')) {
            return callback(null, true);
        }

        // Allow Render.com deployments
        if (origin.includes('.onrender.com')) {
            return callback(null, true);
        }

        // Allow configured frontend URL (if set)
        if (config.cors.frontendUrl && config.cors.frontendUrl !== 'http://localhost:5173') {
            if (origin === config.cors.frontendUrl || 
                origin.replace(/^https?:\/\//, '') === config.cors.frontendUrl.replace(/^https?:\/\//, '')) {
                return callback(null, true);
            }
        }

        // Allow custom domains
        if (origin.includes('businesstalkabcdeepalabhatt.com') ||
            origin.includes('businesstalkwithdeepakbhatt.com') ||
            origin.includes('businesstalk.com')) {
            return callback(null, true);
        }

        // Allow Netlify and Vercel deployments
        if (origin.includes('.netlify.app') || origin.includes('.vercel.app')) {
            return callback(null, true);
        }

        // In production, allow any origin as fallback
        if (config.server.nodeEnv === 'production') {
            console.log(`CORS: Allowing origin in production mode: ${origin}`);
            return callback(null, true);
        }

        console.log(`CORS: Rejecting origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit for admin dashboard usage
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
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
            aboutUs: {
                get: 'GET /api/aboutus',
                update: 'PUT /api/aboutus (admin)',
            },
            render: {
                deployments: 'POST /api/render/deployments',
            }
        },
        documentation: 'See README.md for full API documentation',
    });
});

// Loader.io verification token
app.get('/loaderio-cfbb5ea2fbef73b0444dbbbe2f045bad.txt', (_req, res) => {
    res.type('text/plain').send('loaderio-cfbb5ea2fbef73b0444dbbbe2f045bad');
});

// Health check
app.get('/api/health', (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
            state: dbStatus[dbState] || 'unknown',
            host: mongoose.connection.host,
            name: mongoose.connection.name
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/import', importRoutes);
app.use('/api/about', aboutUsRoutes); // Changed '/api/aboutus' to '/api/about' as per instruction
app.use('/api/render', renderRoutes);
app.use('/api/mongodb', mongoRoutes); // Added mongodb routes
app.use('/api/settings', settingsRoutes); // Site settings routes
app.use('/api/analytics', analyticsRoutes); // Analytics routes

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
