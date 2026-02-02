import { connectDB } from './config/db';
import { config } from './config/env';
import { User } from './models/User';
import { Podcast } from './models/Podcast';

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
            // Upcoming podcasts - with promotional images stored locally
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
                title: 'Unveiling Wisdom: Essential Lessons from Notable Books - FUJI: A Mountain in the Making',
                description: 'Exploring Japanese History and Environmental History through the lens of Mount Fuji and its cultural significance.',
                category: 'upcoming',
                guestName: 'Dr. Andrew Bernstein',
                guestTitle: 'Professor of History, Specialty: Japanese History & Environmental History',
                guestInstitution: 'Lewis & Clark College',
                guestImage: '/uploads/ep277-andrew-bernstein-promo.jpg',
                thumbnailImage: '/uploads/ep277-andrew-bernstein-promo.jpg',
                episodeNumber: 277,
                scheduledDate: new Date('2026-01-05'),
                scheduledTime: '10:00 PM IST',
                tags: ['history', 'books', 'Japan', 'environment'],
            },
            {
                title: 'Creating Social Change by Moving from i-level to g-level and s-level Interventions',
                description: 'Research insights on effective interventions for creating meaningful social change through marketing and business strategies.',
                category: 'upcoming',
                guestName: 'Dr. Amir Grinstein',
                guestTitle: 'Patrick F. & Helen C. Walsh Research Professor, Thomas E. Moore Faculty Fellow, Marketing',
                guestInstitution: "Northeastern University's D'Amore-McKim School of Business",
                guestImage: '/uploads/ep303-amir-grinstein-promo.jpg',
                thumbnailImage: '/uploads/ep303-amir-grinstein-promo.jpg',
                episodeNumber: 303,
                scheduledDate: new Date('2026-01-05'),
                scheduledTime: '11:30 PM IST',
                tags: ['social change', 'marketing', 'interventions'],
            },
            // Past podcasts
            {
                title: "Creativity in the Age of AI: Prof. Jerry Wind's Toolkit for the Modern Mind",
                description: 'Learn how to leverage AI tools while maintaining human creativity.',
                category: 'past',
                guestName: 'Prof. Jerry Wind',
                guestTitle: 'Lauder Professor Emeritus of Marketing',
                guestInstitution: 'The Wharton School',
                guestImage: '',
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
                guestImage: '',
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
                guestImage: '',
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
                guestImage: '',
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
                guestImage: '',
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
                guestImage: '',
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
