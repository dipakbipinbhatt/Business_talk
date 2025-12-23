import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { User } from './models/User.js';
import { Podcast } from './models/Podcast.js';

const seedData = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting database seed...');

        // Clear existing data
        await User.deleteMany({});
        await Podcast.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create admin user
        const admin = await User.create({
            email: config.admin.email,
            password: config.admin.password,
            name: 'Admin',
            role: 'admin',
        });
        console.log(`✅ Admin user created: ${admin.email}`);

        // Create sample podcasts
        const samplePodcasts = [
            // Upcoming podcasts
            {
                title: 'From Stores to "Everywhere": What Dr. Santiago Gallino Reveals About the Future of Retail',
                description: 'Exploring the transformation of retail in the digital age with insights from Wharton.',
                category: 'upcoming',
                guestName: 'Dr. Santiago Gallino',
                guestTitle: 'Associate Professor of Operations',
                guestInstitution: 'The Wharton School, University of Pennsylvania',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 310,
                scheduledDate: new Date('2025-01-15'),
                scheduledTime: '10:00 AM EST',
                tags: ['retail', 'digital transformation', 'business'],
            },
            {
                title: 'When Measurement Goes Wrong: Dr. Robert Austin Explains Performance Dysfunction',
                description: 'Understanding the pitfalls of performance measurement and how to avoid them.',
                category: 'upcoming',
                guestName: 'Dr. Robert Austin',
                guestTitle: 'Professor of Information Systems',
                guestInstitution: 'Ivey Business School',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 311,
                scheduledDate: new Date('2025-01-22'),
                scheduledTime: '10:00 AM EST',
                tags: ['performance', 'management', 'measurement'],
            },
            {
                title: 'How We Hear: Dr. Laurie Heller Explains the Future of Intelligent Audio',
                description: 'A deep dive into auditory perception and AI audio technologies.',
                category: 'upcoming',
                guestName: 'Dr. Laurie Heller',
                guestTitle: 'Professor of Psychology',
                guestInstitution: 'Carnegie Mellon University',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 312,
                scheduledDate: new Date('2025-01-29'),
                scheduledTime: '10:00 AM EST',
                tags: ['audio', 'AI', 'psychology'],
            },
            // Past podcasts
            {
                title: 'Creativity in the Age of AI: Prof. Jerry Wind\'s Toolkit for the Modern Mind',
                description: 'Learn how to leverage AI tools while maintaining human creativity.',
                category: 'past',
                guestName: 'Prof. Jerry Wind',
                guestTitle: 'Lauder Professor Emeritus of Marketing',
                guestInstitution: 'The Wharton School',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 309,
                scheduledDate: new Date('2024-12-18'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=_oqimM070f0',
                spotifyUrl: 'https://open.spotify.com/show/businesstalk',
                applePodcastUrl: 'https://podcasts.apple.com/businesstalk',
                tags: ['AI', 'creativity', 'marketing'],
            },
            {
                title: 'Teaching with Cases: Proven Methods from Dr. Urs Mueller',
                description: 'Master the art of case-based teaching with insights from a leading educator.',
                category: 'past',
                guestName: 'Dr. Urs Mueller',
                guestTitle: 'Professor of Strategy',
                guestInstitution: 'INSEAD',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 308,
                scheduledDate: new Date('2024-12-11'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=Qb0QfdAj1B0',
                spotifyUrl: 'https://open.spotify.com/show/businesstalk',
                tags: ['education', 'case method', 'teaching'],
            },
            {
                title: 'Why Anxiety Is Essential to Being Human | Dr. Samir Chopra',
                description: 'Exploring the role of anxiety in human experience and decision-making.',
                category: 'past',
                guestName: 'Dr. Samir Chopra',
                guestTitle: 'Professor of Philosophy',
                guestInstitution: 'Brooklyn College',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 307,
                scheduledDate: new Date('2024-12-04'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=MZ2DI94Rleg',
                spotifyUrl: 'https://open.spotify.com/show/businesstalk',
                tags: ['philosophy', 'psychology', 'anxiety'],
            },
            {
                title: 'How Great Leaders Reframe Decisions: Dr. Michael Gillespie on "Distancing"',
                description: 'Strategic decision-making techniques used by world-class leaders.',
                category: 'past',
                guestName: 'Dr. Michael Gillespie',
                guestTitle: 'Professor of Political Science',
                guestInstitution: 'Duke University',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 306,
                scheduledDate: new Date('2024-11-27'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=yuISduFi3Ig',
                spotifyUrl: 'https://open.spotify.com/show/businesstalk',
                tags: ['leadership', 'decision-making', 'strategy'],
            },
            {
                title: 'Who Should Regulate the Digital World? Research Insights from Dr. Cary Coglianese',
                description: 'A comprehensive look at digital regulation and governance challenges.',
                category: 'past',
                guestName: 'Dr. Cary Coglianese',
                guestTitle: 'Edward B. Shils Professor of Law',
                guestInstitution: 'University of Pennsylvania Law School',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 305,
                scheduledDate: new Date('2024-11-20'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=Sk7zUeXHRyk',
                spotifyUrl: 'https://open.spotify.com/show/businesstalk',
                tags: ['regulation', 'digital', 'law'],
            },
            {
                title: 'How Inflation Works - Insights from UC Berkeley Economist Dr. Martha Olney',
                description: 'Understanding inflation mechanics and its impact on the economy.',
                category: 'past',
                guestName: 'Dr. Martha Olney',
                guestTitle: 'Adjunct Professor of Economics',
                guestInstitution: 'UC Berkeley',
                guestImage: '/uploads/default-avatar.png',
                episodeNumber: 304,
                scheduledDate: new Date('2024-11-13'),
                scheduledTime: '10:00 AM EST',
                youtubeUrl: 'https://www.youtube.com/watch?v=rvWCquQDUcc',
                spotifyUrl: 'https://open.spotify.com/show/businesstalk',
                tags: ['economics', 'inflation', 'finance'],
            },
        ];

        await Podcast.insertMany(samplePodcasts);
        console.log(`✅ Created ${samplePodcasts.length} sample podcasts`);

        console.log('\n🎉 Database seeded successfully!');
        console.log(`\n📧 Admin Login:\n   Email: ${config.admin.email}\n   Password: ${config.admin.password}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
