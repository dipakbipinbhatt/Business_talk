import mongoose from 'mongoose';
import { config } from '../config/env';
import { Podcast } from '../models/Podcast';

// Correct episode data extracted from thumbnails
const correctPodcastData = [
    // UPCOMING EPISODES (from thumbnails)
    {
        episodeNumber: 447,
        title: 'Business Talk with Prof. Robin Landa, MFA',
        description: 'Branding as a Cultural Force - Distinguished Professor at Kean University discusses groundbreaking insights on branding.',
        category: 'upcoming',
        guestName: 'Prof. Robin Landa, MFA',
        guestTitle: 'Distinguished Professor',
        guestInstitution: 'Kean University',
        scheduledDate: '2025-06-28T00:00:00.000Z', // June 28, 2025 from thumbnail
        scheduledTime: '10:00 PM IST',
        tags: ['branding', 'design', 'marketing'],
    },
    {
        episodeNumber: 446,
        title: 'Business Talk with Prof. Ravi Bapna & Prof. Anindya Ghose',
        description: 'Thrive: Maximizing Well-Being in the Age of AI - Professors of Information Systems discuss technology and human well-being.',
        category: 'upcoming',
        guestName: 'Prof. Ravi Bapna & Prof. Anindya Ghose',
        guestTitle: 'Professors of Information Systems',
        guestInstitution: 'University of Minnesota & NYU Stern',
        scheduledDate: '2025-06-25T00:00:00.000Z', // June 25, 2025 from thumbnail
        scheduledTime: '10:00 PM IST',
        tags: ['AI', 'well-being', 'technology'],
    },
    {
        episodeNumber: 445,
        title: 'Business Talk with Prof. Michael Useem',
        description: 'The Leader Checklist: Lessons from Management 100 - William and Jacalyn Egan Professor of Management.',
        category: 'upcoming',
        guestName: 'Prof. Michael Useem',
        guestTitle: 'Professor of Management',
        guestInstitution: 'The Wharton School',
        scheduledDate: '2025-06-21T00:00:00.000Z', // June 21, 2025 from thumbnail
        scheduledTime: '10:00 PM IST',
        tags: ['leadership', 'management', 'checklist'],
    },
    {
        episodeNumber: 444,
        title: 'Business Talk with Prof. Michael Nagler',
        description: 'The Search for a Nonviolent Future - Professor Emeritus of Classics and Comparative Literature.',
        category: 'upcoming',
        guestName: 'Prof. Michael Nagler',
        guestTitle: 'Professor of Economics',
        guestInstitution: 'Lehman College, CUNY',
        scheduledDate: '2025-06-18T00:00:00.000Z', // June 18, 2025 from thumbnail
        scheduledTime: '10:00 PM IST',
        tags: ['economics', 'nonviolence', 'philosophy'],
    },
    {
        episodeNumber: 443,
        title: 'Business Talk with Prof. Mark Huselid',
        description: 'The HR Scorecard - Strategic HRM insights from distinguished professor.',
        category: 'upcoming',
        guestName: 'Prof. Mark Huselid',
        guestTitle: 'Distinguished Professor',
        guestInstitution: 'Rutgers University',
        scheduledDate: '2025-06-14T00:00:00.000Z', // June 14, 2025 from thumbnail (estimated)
        scheduledTime: '10:00 PM IST',
        tags: ['HR', 'analytics', 'strategy'],
    },
    {
        episodeNumber: 442,
        title: 'Business Talk with Prof. Gemma Anne Calvert',
        description: 'Multisensory Neuromarketing in the Age of AI - Professor of Applied Neuroimaging.',
        category: 'upcoming',
        guestName: 'Prof. Gemma Anne Calvert',
        guestTitle: 'Professor of Applied Neuroimaging',
        guestInstitution: 'Nanyang Business School, NTU',
        scheduledDate: '2025-06-11T00:00:00.000Z', // June 11, 2025 from thumbnail (estimated)
        scheduledTime: '10:00 PM IST',
        tags: ['neuromarketing', 'AI', 'neuroscience'],
    },
];

async function updatePodcasts() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(config.mongodb.uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB');

        console.log('🔄 Updating podcast data...');

        for (const podcastData of correctPodcastData) {
            const result = await Podcast.findOneAndUpdate(
                { episodeNumber: podcastData.episodeNumber },
                {
                    $set: {
                        ...podcastData,
                        updatedAt: new Date(),
                    }
                },
                { upsert: true, new: true }
            );
            console.log(`✅ Updated/Created Episode ${podcastData.episodeNumber}: ${podcastData.title}`);
        }

        console.log('✅ All podcasts updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating podcasts:', error);
        process.exit(1);
    }
}

updatePodcasts();

