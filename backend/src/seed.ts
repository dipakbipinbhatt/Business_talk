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
            // Upcoming podcasts from the original Business Talk site
            {
                title: 'Seeing Beyond the Here and Now: How Corporate Purpose Combats Corporate Myopia',
                description: 'Research insights on how corporate purpose helps companies look beyond short-term pressures and embrace long-term sustainability.',
                category: 'upcoming',
                guestName: 'Dr. Tima Bansal',
                guestTitle: 'Professor of Sustainability & Strategy, Canada Research Chair in Business Sustainability',
                guestInstitution: 'Ivey Business School, Western University',
                guestImage: 'https://static.wixstatic.com/media/70d1c9_c404612432ea4622a12c96c72d0e112d~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tima%20bansal.png',
                thumbnailImage: 'https://static.wixstatic.com/media/70d1c9_c404612432ea4622a12c96c72d0e112d~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/tima%20bansal.png',
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
                guestInstitution: 'Lewis & Clark',
                guestImage: 'https://static.wixstatic.com/media/70d1c9_70c7dfe6ada94d1aa99e76bb9e21823a~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Andrew%20Bernstein.png',
                thumbnailImage: 'https://static.wixstatic.com/media/70d1c9_70c7dfe6ada94d1aa99e76bb9e21823a~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Andrew%20Bernstein.png',
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
                guestImage: 'https://static.wixstatic.com/media/70d1c9_3f5e4a5b8c9d4e8a9b2c1d3e4f5a6b7c~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/amir%20grinstein.png',
                thumbnailImage: 'https://static.wixstatic.com/media/70d1c9_3f5e4a5b8c9d4e8a9b2c1d3e4f5a6b7c~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/amir%20grinstein.png',
                episodeNumber: 303,
                scheduledDate: new Date('2026-01-05'),
                scheduledTime: '11:30 PM IST',
                tags: ['social change', 'marketing', 'interventions'],
            },
            {
                title: "Unveiling Wisdom: Essential Lessons from Notable Books - The Leader's Checklist",
                description: 'Insights on leadership principles and mission-critical practices from the renowned Wharton professor and leadership expert.',
                category: 'upcoming',
                guestName: 'Dr. Michael Useem',
                guestTitle: 'William and Jacalyn Egan Professor of Management, Director, Wharton Center for Leadership and Change Management',
                guestInstitution: 'The Wharton School',
                guestImage: 'https://static.wixstatic.com/media/70d1c9_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/michael%20useem.png',
                thumbnailImage: 'https://static.wixstatic.com/media/70d1c9_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6~mv2.png/v1/fill/w_196,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/michael%20useem.png',
                episodeNumber: 279,
                scheduledDate: new Date('2026-01-06'),
                scheduledTime: '10:00 PM IST',
                tags: ['leadership', 'books', 'management'],
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
