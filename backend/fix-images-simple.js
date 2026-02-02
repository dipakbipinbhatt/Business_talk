// Simple script to fix ALL podcast images at once
// This copies guestImage to thumbnailImage for any podcast missing it
// Run with: node fix-images-simple.js

const mongoose = require('mongoose');

// REPLACE WITH YOUR MONGODB URI FROM .env FILE
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

async function fixAllImages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        // Get all past podcasts (the ones showing logos)
        const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false }));

        const pastPodcasts = await Podcast.find({ category: 'past' });
        console.log(`Found ${pastPodcasts.length} past podcasts\n`);

        let fixed = 0;
        let alreadyOk = 0;

        for (const podcast of pastPodcasts) {
            const title = podcast.title?.substring(0, 60) || 'Untitled';
            const ep = podcast.episodeNumber || '?';

            // Check if has valid thumbnailImage
            const hasValidThumb = podcast.thumbnailImage &&
                podcast.thumbnailImage.trim() !== '' &&
                (podcast.thumbnailImage.startsWith('data:image') ||
                    podcast.thumbnailImage.startsWith('http'));

            if (!hasValidThumb) {
                console.log(`Episode ${ep}: ${title}`);
                console.log(`  Current: ${podcast.thumbnailImage || '(empty)'}`);

                // Try to use guestImage
                if (podcast.guestImage && podcast.guestImage.trim() !== '') {
                    podcast.thumbnailImage = podcast.guestImage;
                    await podcast.save();
                    console.log(`  ✅ FIXED - Used guestImage\n`);
                    fixed++;
                } else {
                    console.log(`  ⚠️  No guestImage available\n`);
                }
            } else {
                alreadyOk++;
            }
        }

        console.log('='.repeat(60));
        console.log(`\n📊 SUMMARY:`);
        console.log(`  Total: ${pastPodcasts.length}`);
        console.log(`  Fixed: ${fixed}`);
        console.log(`  Already OK: ${alreadyOk}`);
        console.log(`\n✅ Done! Refresh your browser now.\n`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixAllImages();
