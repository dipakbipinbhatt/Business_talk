// Script to check and fix all podcast images
// Run with: npx tsx src/check-and-fix-images.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';

async function checkAndFixImages() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB\n');

        // Get all upcoming podcasts
        const podcasts = await Podcast.find({ category: 'upcoming' })
            .select('title episodeNumber thumbnailImage youtubeUrl guestImage')
            .sort({ episodeNumber: 1 });

        console.log(`📊 Found ${podcasts.length} upcoming podcasts\n`);
        console.log('='.repeat(80));

        let hasImage = 0;
        let noImage = 0;
        let fixed = 0;

        for (const podcast of podcasts) {
            const ep = podcast.episodeNumber || '???';
            const title = podcast.title?.substring(0, 50) || 'Untitled';

            console.log(`\nEpisode ${ep}: ${title}`);
            console.log(`  thumbnailImage: ${podcast.thumbnailImage || '(empty)'}`);
            console.log(`  youtubeUrl: ${podcast.youtubeUrl || '(empty)'}`);
            console.log(`  guestImage: ${podcast.guestImage || '(empty)'}`);

            // Check if has valid thumbnail
            if (podcast.thumbnailImage &&
                podcast.thumbnailImage.trim() !== '' &&
                !podcast.thumbnailImage.includes('placeholder')) {

                // Check if it's a Base64 image or valid path
                if (podcast.thumbnailImage.startsWith('data:image') ||
                    podcast.thumbnailImage.startsWith('/uploads/') ||
                    podcast.thumbnailImage.startsWith('http')) {
                    console.log(`  ✅ HAS IMAGE`);
                    hasImage++;
                } else {
                    console.log(`  ⚠️  Invalid image path`);
                    noImage++;
                }
            } else {
                console.log(`  ❌ NO IMAGE`);
                noImage++;

                // Try to fix by using guestImage if available
                if (podcast.guestImage && podcast.guestImage.trim() !== '') {
                    console.log(`  🔧 Copying guestImage to thumbnailImage...`);
                    podcast.thumbnailImage = podcast.guestImage;
                    await podcast.save({ validateBeforeSave: false });
                    console.log(`  ✅ FIXED!`);
                    fixed++;
                }
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('\n📈 SUMMARY:');
        console.log(`  Total podcasts: ${podcasts.length}`);
        console.log(`  With images: ${hasImage}`);
        console.log(`  Without images: ${noImage}`);
        console.log(`  Fixed: ${fixed}`);
        console.log(`  Still need fixing: ${noImage - fixed}`);

        if (noImage - fixed > 0) {
            console.log('\n⚠️  Some podcasts still need images!');
            console.log('   Upload them via admin panel or add to /uploads/ folder');
        }

        await mongoose.disconnect();
        console.log('\n✅ Done!\n');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAndFixImages();
