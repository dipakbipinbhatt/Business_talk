// Script to add upcoming podcasts and fix categorization
// Run with: npx tsx src/add-upcoming.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';

// Upcoming podcasts from the original site (January 5, 2026)
// These are episodes scheduled but not yet recorded (no YouTube URL)
const upcomingPodcasts = [
    {
        title: "Upcoming Episode - January 5, 2026 (Guest TBA)",
        guestName: "To Be Announced",
        guestTitle: "Guest Speaker",
        guestInstitution: "TBA",
        category: "upcoming",
        scheduledDate: "2026-01-05",
        scheduledTime: "10:00 PM IST",
        youtubeUrl: "",
        description: "Stay tuned for this upcoming episode of Business Talk! Guest details will be announced soon.",
        episodeNumber: 400,
    },
    {
        title: "Upcoming Episode - January 5, 2026 (Guest TBA) - Session 2",
        guestName: "To Be Announced",
        guestTitle: "Guest Speaker",
        guestInstitution: "TBA",
        category: "upcoming",
        scheduledDate: "2026-01-05",
        scheduledTime: "11:30 PM IST",
        youtubeUrl: "",
        description: "Stay tuned for this upcoming episode of Business Talk! Guest details will be announced soon.",
        episodeNumber: 401,
    },
];

async function addUpcomingPodcasts() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB');

        // First, let's check what upcoming podcasts already exist
        const existingUpcoming = await Podcast.find({ category: 'upcoming' });
        console.log(`\n📊 Current upcoming podcasts: ${existingUpcoming.length}`);
        existingUpcoming.forEach(p => {
            console.log(`   - ${p.title} (${p.guestName})`);
        });

        // FIX 1: Move podcasts with YouTube URLs from 'upcoming' to 'past'
        console.log('\n🔧 Fixing miscategorized podcasts...');
        const miscategorized = await Podcast.find({
            category: 'upcoming',
            youtubeUrl: { $exists: true, $nin: ['', null] }
        });

        let fixed = 0;
        for (const p of miscategorized) {
            if (p.youtubeUrl && p.youtubeUrl.trim() !== '') {
                console.log(`   📝 Moving to 'past': ${p.title}`);
                p.category = 'past';
                await p.save();
                fixed++;
            }
        }
        console.log(`   ✅ Fixed ${fixed} miscategorized podcasts`);

        // FIX 2: Ensure podcasts WITHOUT YouTube URLs and with future dates are 'upcoming'
        const now = new Date();
        const shouldBeUpcoming = await Podcast.find({
            category: 'past',
            $or: [
                { youtubeUrl: { $exists: false } },
                { youtubeUrl: '' },
                { youtubeUrl: null }
            ],
            scheduledDate: { $gt: now }
        });

        let madeUpcoming = 0;
        for (const p of shouldBeUpcoming) {
            console.log(`   📝 Moving to 'upcoming': ${p.title}`);
            p.category = 'upcoming';
            await p.save();
            madeUpcoming++;
        }
        console.log(`   ✅ Fixed ${madeUpcoming} podcasts that should be upcoming`);

        // Add new upcoming podcasts if they don't exist
        console.log(`\n📦 Adding ${upcomingPodcasts.length} upcoming podcasts...`);

        let added = 0;
        let skipped = 0;

        for (const p of upcomingPodcasts) {
            // Check if similar podcast already exists
            const existing = await Podcast.findOne({
                $or: [
                    { title: p.title },
                    { episodeNumber: p.episodeNumber }
                ]
            });

            if (existing) {
                console.log(`   ⏭️ Skipped: ${p.title} (already exists)`);
                skipped++;
                continue;
            }

            await Podcast.create({
                title: p.title,
                description: p.description,
                guestName: p.guestName,
                guestTitle: p.guestTitle,
                guestInstitution: p.guestInstitution,
                guestImage: '',
                thumbnailImage: '',
                category: p.category,
                scheduledDate: new Date(p.scheduledDate),
                scheduledTime: p.scheduledTime,
                youtubeUrl: p.youtubeUrl,
                episodeNumber: p.episodeNumber,
                tags: [],
            });
            console.log(`   ✅ Added: ${p.title}`);
            added++;
        }

        console.log(`\n✅ Complete!`);
        console.log(`   Added: ${added}`);
        console.log(`   Skipped: ${skipped}`);
        console.log(`   Fixed (moved to past): ${fixed}`);
        console.log(`   Fixed (moved to upcoming): ${madeUpcoming}`);

        // Final stats
        const upcomingCount = await Podcast.countDocuments({ category: 'upcoming' });
        const pastCount = await Podcast.countDocuments({ category: 'past' });
        console.log(`\n📊 Final database stats:`);
        console.log(`   Upcoming podcasts: ${upcomingCount}`);
        console.log(`   Past podcasts: ${pastCount}`);
        console.log(`   Total: ${upcomingCount + pastCount}`);

        // List all upcoming podcasts
        const allUpcoming = await Podcast.find({ category: 'upcoming' }).sort({ scheduledDate: 1 });
        console.log(`\n📅 All upcoming podcasts:`);
        allUpcoming.forEach(p => {
            const hasYouTube = p.youtubeUrl && p.youtubeUrl.trim() !== '' ? ' ⚠️ HAS YOUTUBE URL' : '';
            console.log(`   - ${p.title} (${p.guestName}) - ${p.scheduledDate?.toISOString().split('T')[0]}${hasYouTube}`);
        });

    } catch (error) {
        console.error('❌ Failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

addUpcomingPodcasts();
