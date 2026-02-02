// Script to properly fix upcoming podcasts based on original site
// Run with: npx tsx src/fix-upcoming-proper.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';

async function fixUpcomingProper() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB');

        // Delete all existing upcoming podcasts
        console.log('\n🗑️ Removing existing upcoming podcasts...');
        const deleted = await Podcast.deleteMany({ category: 'upcoming' });
        console.log(`   Deleted: ${deleted.deletedCount} podcasts`);

        // Add proper upcoming podcasts matching the original site exactly
        const upcomingPodcasts = [
            {
                title: "Seeing Beyond the Here and Now: Rethinking Corporate Purpose with Dr. Tima Bansal",
                guestName: "Dr. Tima Bansal",
                guestTitle: "Professor of Sustainability & Strategy",
                guestInstitution: "Ivey Business School, Western University",
                category: "upcoming",
                scheduledDate: new Date("2026-01-05"),
                scheduledTime: "10:00 PM IST",
                youtubeUrl: "",
                thumbnailImage: "https://static.wixstatic.com/media/b077eb_6b06dc82bb3c47d08c8ed4b925f9e77a~mv2.jpg",
                guestImage: "https://static.wixstatic.com/media/b077eb_6b06dc82bb3c47d08c8ed4b925f9e77a~mv2.jpg",
                description: "Research insights on how corporate purpose helps companies look beyond short-term pressures.",
                episodeNumber: 400,
                tags: ["sustainability", "strategy", "corporate purpose"],
            },
            {
                title: "Upcoming Episode - January 5, 2026",
                guestName: "TBA",
                guestTitle: "Guest Speaker",
                guestInstitution: "To Be Announced",
                category: "upcoming",
                scheduledDate: new Date("2026-01-05"),
                scheduledTime: "11:30 PM IST",
                youtubeUrl: "",
                thumbnailImage: "",
                guestImage: "",
                description: "Stay tuned for this upcoming episode of Business Talk!",
                episodeNumber: 401,
                tags: [],
            },
        ];

        console.log(`\n📦 Adding ${upcomingPodcasts.length} proper upcoming podcasts...`);

        for (const p of upcomingPodcasts) {
            await Podcast.create(p);
            console.log(`   ✅ Added: ${p.guestName} - ${p.scheduledDate.toDateString()}`);
        }

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

fixUpcomingProper();
