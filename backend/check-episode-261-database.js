// Check what's actually saved in database for Episode 261
// Run with: node check-episode-261-database.js

const mongoose = require('mongoose');

// Get MongoDB URI from environment or replace with your actual URI
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

async function checkEpisode261() {
    try {
        console.log('Connecting to MongoDB...\n');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false }));

        // Find Episode 261
        const podcast = await Podcast.findOne({ episodeNumber: 261 });

        if (!podcast) {
            console.log('❌ Episode 261 not found in database!');
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log('='.repeat(80));
        console.log('EPISODE 261 - DATABASE CONTENT');
        console.log('='.repeat(80));
        console.log(`\nTitle: ${podcast.title}`);
        console.log(`Episode Number: ${podcast.episodeNumber}`);
        console.log(`Category: ${podcast.category}`);
        console.log(`Guest: ${podcast.guestName}`);

        console.log('\n--- IMAGE DATA ---');

        // Check thumbnailImage
        if (podcast.thumbnailImage) {
            const thumbType = podcast.thumbnailImage.startsWith('data:image') ? 'Base64' :
                podcast.thumbnailImage.startsWith('http') ? 'HTTP URL' :
                    podcast.thumbnailImage.startsWith('/uploads') ? 'File Path' :
                        'Unknown';
            const thumbLength = podcast.thumbnailImage.length;
            const thumbPreview = podcast.thumbnailImage.substring(0, 100);

            console.log(`\nthumbnailImage:`);
            console.log(`  Type: ${thumbType}`);
            console.log(`  Length: ${thumbLength} characters`);
            console.log(`  Preview: ${thumbPreview}...`);

            if (thumbType === 'Base64') {
                console.log(`  ✅ VALID - Base64 image stored`);
            } else if (thumbType === 'HTTP URL') {
                console.log(`  ✅ VALID - HTTP URL`);
            } else if (thumbType === 'File Path') {
                console.log(`  ⚠️  WARNING - File path (may not exist)`);
            }
        } else {
            console.log(`\nthumbnailImage: (empty or null)`);
            console.log(`  ❌ NO THUMBNAIL IMAGE`);
        }

        // Check guestImage
        if (podcast.guestImage) {
            const guestType = podcast.guestImage.startsWith('data:image') ? 'Base64' :
                podcast.guestImage.startsWith('http') ? 'HTTP URL' :
                    podcast.guestImage.startsWith('/uploads') ? 'File Path' :
                        'Unknown';
            const guestLength = podcast.guestImage.length;
            const guestPreview = podcast.guestImage.substring(0, 100);

            console.log(`\nguestImage:`);
            console.log(`  Type: ${guestType}`);
            console.log(`  Length: ${guestLength} characters`);
            console.log(`  Preview: ${guestPreview}...`);

            if (guestType === 'Base64') {
                console.log(`  ✅ Available as fallback`);
            }
        } else {
            console.log(`\nguestImage: (empty or null)`);
        }

        // Check youtubeUrl
        console.log(`\nyoutubeUrl: ${podcast.youtubeUrl || '(empty)'}`);

        console.log('\n--- DIAGNOSIS ---\n');

        const hasValidThumb = podcast.thumbnailImage &&
            (podcast.thumbnailImage.startsWith('data:image') ||
                podcast.thumbnailImage.startsWith('http'));

        const hasValidGuest = podcast.guestImage &&
            (podcast.guestImage.startsWith('data:image') ||
                podcast.guestImage.startsWith('http'));

        if (hasValidThumb) {
            console.log('✅ Episode 261 HAS valid thumbnailImage');
            console.log('   Should display promotional thumbnail on website');
            console.log('\n   If still showing guest photo:');
            console.log('   1. Clear browser cache completely');
            console.log('   2. Try incognito mode');
            console.log('   3. Check browser console for errors');
        } else if (hasValidGuest) {
            console.log('⚠️  Episode 261 has NO valid thumbnailImage');
            console.log('   But HAS valid guestImage');
            console.log('   Will show guest photo as fallback');
            console.log('\n   TO FIX:');
            console.log('   1. Go to admin panel');
            console.log('   2. Edit Episode 261');
            console.log('   3. Upload promotional thumbnail');
            console.log('   4. Make sure to click SAVE');
            console.log('   5. Check this script again to verify');
        } else {
            console.log('❌ Episode 261 has NO valid images');
            console.log('   Will show logo placeholder');
        }

        console.log('\n' + '='.repeat(80));
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkEpisode261();
