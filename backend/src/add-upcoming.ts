// Script to add upcoming podcasts from original site
// Run with: npx tsx src/add-upcoming.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';

// Upcoming podcasts from the original site (January 5, 2026 and later)
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
        description: "Stay tuned for this upcoming episode of Business Talk!",
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
        description: "Stay tuned for this upcoming episode of Business Talk!",
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

        // Also fix any podcasts that should be upcoming (no YouTube URL + future date)
        const now = new Date();
        const podcastsToFix = await Podcast.find({
            youtubeUrl: { $in: ['', null] },
            scheduledDate: { $gt: now }
        });

        let fixed = 0;
        for (const p of podcastsToFix) {
            if (p.category !== 'upcoming') {
                p.category = 'upcoming';
                await p.save();
                fixed++;
            }
        }

        console.log(`\n✅ Complete!`);
        console.log(`   Added: ${added}`);
        console.log(`   Skipped: ${skipped}`);
        console.log(`   Fixed category: ${fixed}`);

        // Final stats
        const upcomingCount = await Podcast.countDocuments({ category: 'upcoming' });
        const pastCount = await Podcast.countDocuments({ category: 'past' });
        console.log(`\n📊 Final database stats:`);
        console.log(`   Upcoming podcasts: ${upcomingCount}`);
        console.log(`   Past podcasts: ${pastCount}`);
        console.log(`   Total: ${upcomingCount + pastCount}`);

    } catch (error) {
        console.error('❌ Failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

addUpcomingPodcasts();
