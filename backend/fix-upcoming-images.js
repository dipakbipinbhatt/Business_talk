// Fix UPCOMING podcast images
// This copies guestImage to thumbnailImage for upcoming podcasts
// Run with: node fix-upcoming-images.js

const mongoose = require('mongoose');

// REPLACE WITH YOUR MONGODB URI FROM .env FILE
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

async function fixUpcomingImages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        // Get all UPCOMING podcasts (the ones showing logos)
        const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false }));

        const upcomingPodcasts = await Podcast.find({ category: 'upcoming' })
            .sort({ scheduledDate: 1 });

        console.log(`Found ${upcomingPodcasts.length} upcoming podcasts\n`);
        console.log('='.repeat(70));

        let fixed = 0;
        let alreadyOk = 0;
        let noFallback = 0;

        for (const podcast of upcomingPodcasts) {
            const title = podcast.title?.substring(0, 50) || 'Untitled';
            const ep = podcast.episodeNumber || '?';

            console.log(`\nEpisode ${ep}: ${title}`);
            console.log(`  thumbnailImage: ${podcast.thumbnailImage || '(empty)'}`);
            console.log(`  guestImage: ${podcast.guestImage || '(empty)'}`);

            // Check if has valid thumbnailImage (Base64 or HTTP URL)
            const hasValidThumb = podcast.thumbnailImage &&
                podcast.thumbnailImage.trim() !== '' &&
                (podcast.thumbnailImage.startsWith('data:image') ||
                    podcast.thumbnailImage.startsWith('http'));

            if (!hasValidThumb) {
                // Try to use guestImage
                if (podcast.guestImage && podcast.guestImage.trim() !== '') {
                    // Check if guestImage is valid (Base64 or HTTP)
                    if (podcast.guestImage.startsWith('data:image') ||
                        podcast.guestImage.startsWith('http')) {

                        podcast.thumbnailImage = podcast.guestImage;
                        await podcast.save();
                        console.log(`  ✅ FIXED - Copied guestImage to thumbnailImage`);
                        fixed++;
                    } else {
                        console.log(`  ⚠️  guestImage is file path, not Base64`);
                        // Clear invalid path so it shows logo instead of 404
                        podcast.thumbnailImage = '';
                        await podcast.save();
                        noFallback++;
                    }
                } else {
                    console.log(`  ⚠️  No guestImage available`);
                    // Clear invalid path
                    podcast.thumbnailImage = '';
                    await podcast.save();
                    noFallback++;
                }
            } else {
                console.log(`  ✓ Already has valid thumbnailImage`);
                alreadyOk++;
            }
        }

        console.log('\n' + '='.repeat(70));
        console.log(`\n📊 SUMMARY:`);
        console.log(`  Total upcoming podcasts: ${upcomingPodcasts.length}`);
        console.log(`  Fixed (copied guestImage): ${fixed}`);
        console.log(`  Already OK: ${alreadyOk}`);
        console.log(`  Need manual upload: ${noFallback}`);

        if (noFallback > 0) {
            console.log(`\n⚠️  ${noFallback} podcasts still need images!`);
            console.log(`   Upload them via admin panel:`);
            console.log(`   1. Go to admin panel`);
            console.log(`   2. Edit each podcast`);
            console.log(`   3. Upload thumbnail image`);
            console.log(`   4. Save`);
        }

        console.log(`\n✅ Done! Refresh your browser now.\n`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

fixUpcomingImages();
