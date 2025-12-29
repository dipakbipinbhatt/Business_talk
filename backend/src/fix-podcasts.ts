// Script to fix upcoming podcasts and add YouTube thumbnails
// Run with: npx tsx src/fix-podcasts.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';

// Function to extract YouTube video ID and generate thumbnail URL
function getYouTubeThumbnail(youtubeUrl: string): string {
    if (!youtubeUrl) return '';

    // Extract video ID from various YouTube URL formats
    let videoId = '';

    if (youtubeUrl.includes('youtu.be/')) {
        videoId = youtubeUrl.split('youtu.be/')[1]?.split(/[?&]/)[0] || '';
    } else if (youtubeUrl.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(youtubeUrl.split('?')[1]);
        videoId = urlParams.get('v') || '';
    }

    if (videoId) {
        // Use high quality thumbnail
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    return '';
}

async function fixPodcasts() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB');

        // Get all podcasts
        const podcasts = await Podcast.find({});
        console.log(`📦 Found ${podcasts.length} podcasts to update...`);

        let updatedCount = 0;
        let upcomingFixed = 0;

        for (const podcast of podcasts) {
            let needsUpdate = false;

            // Fix thumbnail if empty but has YouTube URL
            if (!podcast.thumbnailImage && podcast.youtubeUrl) {
                const thumbnail = getYouTubeThumbnail(podcast.youtubeUrl);
                if (thumbnail) {
                    podcast.thumbnailImage = thumbnail;
                    podcast.guestImage = thumbnail;
                    needsUpdate = true;
                }
            }

            // Fix upcoming category - if scheduledDate is in the future and no YouTube URL
            const now = new Date();
            if (podcast.scheduledDate && new Date(podcast.scheduledDate) > now && !podcast.youtubeUrl) {
                if (podcast.category !== 'upcoming') {
                    podcast.category = 'upcoming';
                    upcomingFixed++;
                    needsUpdate = true;
                }
            }

            // If has YouTube URL, it's a past podcast
            if (podcast.youtubeUrl && podcast.category === 'upcoming') {
                podcast.category = 'past';
                needsUpdate = true;
            }

            if (needsUpdate) {
                await podcast.save();
                updatedCount++;
            }
        }

        console.log(`\n✅ Fix complete!`);
        console.log(`   Updated thumbnails: ${updatedCount}`);
        console.log(`   Fixed upcoming category: ${upcomingFixed}`);

        // Show stats
        const upcomingCount = await Podcast.countDocuments({ category: 'upcoming' });
        const pastCount = await Podcast.countDocuments({ category: 'past' });
        console.log(`\n📊 Database stats:`);
        console.log(`   Upcoming podcasts: ${upcomingCount}`);
        console.log(`   Past podcasts: ${pastCount}`);
        console.log(`   Total: ${upcomingCount + pastCount}`);

    } catch (error) {
        console.error('❌ Fix failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

fixPodcasts();
