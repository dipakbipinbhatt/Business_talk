import mongoose from 'mongoose';
import { config } from './env.js';

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
        const { User } = await import('../models/User.js');
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

// Seed sample podcasts if database is empty
async function seedSampleData() {
    try {
        const { Podcast } = await import('../models/Podcast.js');
        const count = await Podcast.countDocuments();

        if (count === 0) {
            console.log('📦 Seeding sample podcast data...');

            const samplePodcasts = [
                {
                    title: 'Strategic Innovation in the Digital Age',
                    description: 'An in-depth conversation about strategic innovation and how businesses can thrive in the rapidly evolving digital landscape.',
                    category: 'upcoming',
                    guestName: 'Dr. Sarah Mitchell',
                    guestTitle: 'Professor of Strategy',
                    guestInstitution: 'Harvard Business School',
                    guestImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                    episodeNumber: 25,
                    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    scheduledTime: '5:00 PM IST',
                    youtubeUrl: 'https://youtube.com/@businesstalkwithdeepakbhatt',
                    tags: ['Strategy', 'Innovation', 'Digital'],
                },
                {
                    title: 'The Future of Leadership',
                    description: 'Exploring modern leadership styles and what it takes to lead effectively in today\'s complex business environment.',
                    category: 'upcoming',
                    guestName: 'Prof. James Chen',
                    guestTitle: 'Dean of Business',
                    guestInstitution: 'Stanford Graduate School',
                    guestImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                    episodeNumber: 26,
                    scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    scheduledTime: '6:00 PM IST',
                    youtubeUrl: 'https://youtube.com/@businesstalkwithdeepakbhatt',
                    tags: ['Leadership', 'Management', 'Future'],
                },
                {
                    title: 'Entrepreneurship in Emerging Markets',
                    description: 'A discussion on the unique challenges and opportunities for entrepreneurs in developing economies.',
                    category: 'past',
                    guestName: 'Dr. Priya Sharma',
                    guestTitle: 'Director of Entrepreneurship',
                    guestInstitution: 'IIM Ahmedabad',
                    guestImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                    episodeNumber: 24,
                    scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    scheduledTime: '5:00 PM IST',
                    youtubeUrl: 'https://youtube.com/@businesstalkwithdeepakbhatt',
                    tags: ['Entrepreneurship', 'Emerging Markets', 'Startups'],
                },
                {
                    title: 'Digital Marketing Strategies for 2025',
                    description: 'Expert insights on cutting-edge digital marketing techniques and trends shaping the industry.',
                    category: 'past',
                    guestName: 'Maria Rodriguez',
                    guestTitle: 'CMO',
                    guestInstitution: 'TechGlobal Inc.',
                    guestImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
                    episodeNumber: 23,
                    scheduledDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                    scheduledTime: '5:00 PM IST',
                    youtubeUrl: 'https://youtube.com/@businesstalkwithdeepakbhatt',
                    tags: ['Marketing', 'Digital', 'Strategy'],
                },
                {
                    title: 'Sustainable Business Practices',
                    description: 'How companies can integrate sustainability into their core business strategy for long-term success.',
                    category: 'past',
                    guestName: 'Dr. Michael Green',
                    guestTitle: 'Professor of Sustainability',
                    guestInstitution: 'MIT Sloan',
                    guestImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                    episodeNumber: 22,
                    scheduledDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
                    scheduledTime: '5:00 PM IST',
                    youtubeUrl: 'https://youtube.com/@businesstalkwithdeepakbhatt',
                    tags: ['Sustainability', 'ESG', 'Business'],
                },
            ];

            await Podcast.insertMany(samplePodcasts);
            console.log('✅ Sample podcasts seeded successfully');
        } else {
            console.log(`📊 ${count} podcasts found in database`);
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
