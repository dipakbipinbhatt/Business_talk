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

// CORS
app.use(cors({
    origin: [config.cors.frontendUrl, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/blogs', blogRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
