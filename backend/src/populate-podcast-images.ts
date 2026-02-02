// Updated script to populate database with Base64 images
// This eliminates file path dependencies
// Run with: npx tsx src/populate-podcast-images.ts

import mongoose from 'mongoose';
import { config } from './config/env';
import { Podcast } from './models/Podcast';
import fs from 'fs';
import path from 'path';

async function populatePodcastImages() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB\n');

        // Get all upcoming podcasts
        const podcasts = await Podcast.find({ category: 'upcoming' });
        console.log(`Found ${podcasts.length} upcoming podcasts\n`);

        let updated = 0;
        let skipped = 0;
        let errors = 0;

        for (const podcast of podcasts) {
            console.log(`\nProcessing: ${podcast.title}`);

            // Check if already has Base64 image
            if (podcast.thumbnailImage && podcast.thumbnailImage.startsWith('data:image')) {
                console.log('  ✓ Already has Base64 image');
                skipped++;
                continue;
            }

            // Check if has file path
            if (podcast.thumbnailImage && podcast.thumbnailImage.startsWith('/uploads/')) {
                const filename = podcast.thumbnailImage.replace('/uploads/', '');
                const filepath = path.join(__dirname, '../../frontend/public/uploads', filename);

                // Check if file exists
                if (fs.existsSync(filepath)) {
                    try {
                        // Read file and convert to Base64
                        const imageBuffer = fs.readFileSync(filepath);
                        const base64 = imageBuffer.toString('base64');
                        const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
                        const dataUrl = `data:${mimeType};base64,${base64}`;

                        // Update podcast
                        podcast.thumbnailImage = dataUrl;
                        await podcast.save({ validateBeforeSave: false });

                        console.log(`  ✅ Converted to Base64 (${Math.round(base64.length / 1024)}KB)`);
                        updated++;
                    } catch (err) {
                        console.log(`  ❌ Error converting: ${err.message}`);
                        errors++;
                    }
                } else {
                    console.log(`  ⚠️  File not found: ${filename}`);
                    // Use guestImage as fallback
                    if (podcast.guestImage) {
                        if (podcast.guestImage.startsWith('data:image')) {
                            podcast.thumbnailImage = podcast.guestImage;
                            await podcast.save({ validateBeforeSave: false });
                            console.log(`  ✅ Used guestImage (Base64)`);
                            updated++;
                        } else if (podcast.guestImage.startsWith('/uploads/')) {
                            const guestFilename = podcast.guestImage.replace('/uploads/', '');
                            const guestFilepath = path.join(__dirname, '../../frontend/public/uploads', guestFilename);

                            if (fs.existsSync(guestFilepath)) {
                                try {
                                    const imageBuffer = fs.readFileSync(guestFilepath);
                                    const base64 = imageBuffer.toString('base64');
                                    const mimeType = guestFilename.endsWith('.png') ? 'image/png' : 'image/jpeg';
                                    const dataUrl = `data:${mimeType};base64,${base64}`;

                                    podcast.thumbnailImage = dataUrl;
                                    await podcast.save({ validateBeforeSave: false });
                                    console.log(`  ✅ Used guestImage file (${Math.round(base64.length / 1024)}KB)`);
                                    updated++;
                                } catch (err) {
                                    console.log(`  ❌ Error with guest image: ${err.message}`);
                                    errors++;
                                }
                            } else {
                                console.log(`  ❌ Guest image file also not found`);
                                errors++;
                            }
                        }
                    } else {
                        console.log(`  ❌ No fallback available`);
                        errors++;
                    }
                }
            } else if (podcast.guestImage) {
                // No thumbnailImage, try guestImage
                if (podcast.guestImage.startsWith('data:image')) {
                    podcast.thumbnailImage = podcast.guestImage;
                    await podcast.save({ validateBeforeSave: false });
                    console.log(`  ✅ Copied guestImage (Base64)`);
                    updated++;
                } else {
                    console.log(`  ⚠️  Has guestImage path but no file`);
                    skipped++;
                }
            } else {
                console.log(`  ⚠️  No image data available`);
                skipped++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`\n📊 SUMMARY:`);
        console.log(`  Total: ${podcasts.length}`);
        console.log(`  Updated: ${updated}`);
        console.log(`  Skipped: ${skipped}`);
        console.log(`  Errors: ${errors}`);
        console.log('\n✅ Done!\n');

        await mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

populatePodcastImages();
