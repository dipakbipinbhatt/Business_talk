import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);

        // Parse the connection string and add necessary options
        let uri = config.mongodb.uri;

        // For Node.js v24+ with OpenSSL 3.0, need to handle TLS differently
        // The connection string should include retryWrites and w=majority

        console.log('🔄 Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority',
        });

        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Seed admin user if not exists
        await seedAdminUser();

        // Seed sample data if database is empty
        await seedSampleData();

    } catch (error: any) {
        console.warn('⚠️ MongoDB not available. Running in demo mode with mock data.');
        console.warn('   Error:', error.message);

        if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.warn('\n📝 SSL/TLS Error Detected!');
            console.warn('   This is a known issue with Node.js v24 and MongoDB Atlas.');
            console.warn('   Solutions:');
            console.warn('   1. Whitelist your IP address in MongoDB Atlas');
            console.warn('   2. Use Node.js v20 LTS instead of v24');
            console.warn('   3. Check your MongoDB Atlas cluster TLS version\n');
        }

        isConnected = false;
    }
};

export const isDBConnected = () => isConnected;

// Seed admin user
async function seedAdminUser() {
    try {
        const { User } = await import('../models/User');
        const existingAdmin = await User.findOne({ email: config.admin.email });

        if (!existingAdmin) {
            const admin = new User({
                email: config.admin.email,
                password: config.admin.password,
                name: 'Admin',
                role: 'admin',
            });
            await admin.save();
            console.log('✅ Admin user created:', config.admin.email);
        } else {
            console.log('✅ Admin user exists:', config.admin.email);
        }
    } catch (error: any) {
        console.warn('⚠️ Could not seed admin user:', error.message);
    }
}

// Seed sample podcasts - uses local images from frontend/public/uploads
async function seedSampleData() {
    try {
        const { Podcast } = await import('../models/Podcast');
        const count = await Podcast.countDocuments();

        // Check if any podcasts have broken image URLs (wixstatic, unsplash, etc.)
        const brokenImagePodcasts = await Podcast.countDocuments({
            $or: [
                { guestImage: { $regex: 'wixstatic|unsplash', $options: 'i' } },
                { thumbnailImage: { $regex: 'wixstatic|unsplash', $options: 'i' } },
            ]
        });

        // Force reseed if we have broken images
        if (brokenImagePodcasts > 0) {
            console.log(`⚠️ Found ${brokenImagePodcasts} podcasts with broken image URLs. Force reseeding...`);
            await Podcast.deleteMany({});
        }

        const currentCount = await Podcast.countDocuments();

        if (currentCount === 0) {
            console.log('📦 Seeding podcast data with local images...');

            // Sample podcasts with LOCAL images (from frontend/public/uploads/)
            const samplePodcasts = [
                {
                    title: 'Seeing Beyond the Here and Now: How Corporate Purpose Combats Corporate Myopia',
                    description: 'Research insights on how corporate purpose helps companies look beyond short-term pressures and embrace long-term sustainability.',
                    category: 'upcoming',
                    guestName: 'Dr. Tima Bansal',
                    guestTitle: 'Professor of Sustainability & Strategy, Canada Research Chair in Business Sustainability',
                    guestInstitution: 'Ivey Business School, Western University',
                    guestImage: '/uploads/ep309-tima-bansal-promo.jpg',
                    thumbnailImage: '/uploads/ep309-tima-bansal-promo.jpg',
                    episodeNumber: 309,
                    scheduledDate: new Date('2025-12-22'),
                    scheduledTime: '10:00 PM IST',
                    tags: ['sustainability', 'strategy', 'corporate purpose'],
                },
                {
                    title: 'FUJI: A Mountain in the Making - Japanese History & Environment',
                    description: 'An exploration of how Mount Fuji shaped Japanese culture, history, and environmental consciousness over centuries.',
                    category: 'upcoming',
                    guestName: 'Dr. Andrew Bernstein',
                    guestTitle: 'Professor of Modern Japanese History',
                    guestInstitution: 'Lewis & Clark College',
                    guestImage: '/uploads/ep277-andrew-bernstein-promo.jpg',
                    thumbnailImage: '/uploads/ep277-andrew-bernstein-promo.jpg',
                    episodeNumber: 277,
                    scheduledDate: new Date('2026-01-05'),
                    scheduledTime: '10:00 PM IST',
                    tags: ['history', 'Japan', 'environment'],
                },
                {
                    title: 'Creating Social Change: From i-level to g-level Interventions',
                    description: 'Research on effective interventions for social change, from individual behavior to global policy.',
                    category: 'upcoming',
                    guestName: 'Dr. Amir Grinstein',
                    guestTitle: 'Patrick F. & Helen C. Walsh Research Professor',
                    guestInstitution: "Northeastern University D'Amore-McKim School of Business",
                    guestImage: '/uploads/ep303-amir-grinstein-promo.jpg',
                    thumbnailImage: '/uploads/ep303-amir-grinstein-promo.jpg',
                    episodeNumber: 303,
                    scheduledDate: new Date('2026-01-05'),
                    scheduledTime: '11:30 PM IST',
                    tags: ['social change', 'marketing', 'research'],
                },
                {
                    title: "Creativity in the Age of AI: Prof. Jerry Wind's Toolkit",
                    description: 'Learn how to leverage AI tools while maintaining human creativity and strategic thinking.',
                    category: 'past',
                    guestName: 'Prof. Jerry Wind',
                    guestTitle: 'Lauder Professor Emeritus of Marketing',
                    guestInstitution: 'The Wharton School',
                    guestImage: '',
                    thumbnailImage: '',
                    episodeNumber: 310,
                    scheduledDate: new Date('2024-12-18'),
                    scheduledTime: '10:00 AM EST',
                    youtubeUrl: 'https://www.youtube.com/watch?v=_oqimM070f0',
                    tags: ['AI', 'creativity', 'marketing'],
                },
                {
                    title: 'Teaching with Cases: Methods from Dr. Urs Mueller',
                    description: 'Master the art of case-based teaching from one of the leading experts in business education.',
                    category: 'past',
                    guestName: 'Dr. Urs Mueller',
                    guestTitle: 'Professor of Strategy',
                    guestInstitution: 'INSEAD',
                    guestImage: '',
                    thumbnailImage: '',
                    episodeNumber: 308,
                    scheduledDate: new Date('2024-12-11'),
                    scheduledTime: '10:00 AM EST',
                    youtubeUrl: 'https://www.youtube.com/watch?v=Qb0QfdAj1B0',
                    tags: ['education', 'case method', 'teaching'],
                },
                {
                    title: 'Building Resilient Supply Chains Post-Pandemic',
                    description: 'Strategies for creating supply chains that can withstand global disruptions.',
                    category: 'past',
                    guestName: 'Dr. Lisa Chen',
                    guestTitle: 'Professor of Operations Management',
                    guestInstitution: 'MIT Sloan School of Management',
                    guestImage: '',
                    thumbnailImage: '',
                    episodeNumber: 307,
                    scheduledDate: new Date('2024-12-04'),
                    scheduledTime: '10:00 AM EST',
                    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    tags: ['supply chain', 'operations', 'strategy'],
                },
            ];

            await Podcast.insertMany(samplePodcasts);
            console.log('✅ Sample podcasts seeded with local images');
        } else {
            console.log(`📊 ${currentCount} podcasts found in database`);
        }
    } catch (error: any) {
        console.warn('⚠️ Could not seed sample data:', error.message);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
    isConnected = false;
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
});

mongoose.connection.on('connected', () => {
    console.log('🔗 MongoDB connection established');
});
