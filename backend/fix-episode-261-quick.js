// Quick fix for Episode 261 - Check and Fix
const mongoose = require('mongoose');
require('dotenv').config();

async function fixEpisode261() {
    try {
        console.log('🔍 Connecting to MongoDB...\n');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!\n');

        const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false }));

        // Find Episode 261
        const podcast = await Podcast.findOne({ episodeNumber: 261 });

        if (!podcast) {
            console.log('❌ Episode 261 not found in database!');
            await mongoose.disconnect();
            return;
        }

        console.log('='.repeat(80));
        console.log('EPISODE 261 - CURRENT STATE');
        console.log('='.repeat(80));
        console.log(`Title: ${podcast.title}`);
        console.log(`Guest: ${podcast.guestName || 'N/A'}`);
        console.log();

        // Check current images
        const hasThumb = podcast.thumbnailImage && podcast.thumbnailImage.length > 0;
        const hasGuest = podcast.guestImage && podcast.guestImage.length > 0;

        console.log('📸 IMAGE STATUS:');
        console.log(`  thumbnailImage: ${hasThumb ? '✅ EXISTS (' + podcast.thumbnailImage.substring(0, 50) + '...)' : '❌ MISSING'}`);
        console.log(`  guestImage: ${hasGuest ? '✅ EXISTS (' + podcast.guestImage.substring(0, 50) + '...)' : '❌ MISSING'}`);
        console.log();

        // Diagnosis
        if (hasThumb) {
            console.log('✅ Episode 261 HAS a thumbnailImage');
            console.log('   The issue might be:');
            console.log('   1. Browser cache - try Ctrl+Shift+F5 to hard refresh');
            console.log('   2. Invalid image data - check if it\'s a valid base64 or URL');
            console.log();

            // Check if it's valid
            const isBase64 = podcast.thumbnailImage.startsWith('data:image');
            const isURL = podcast.thumbnailImage.startsWith('http');
            const isPath = podcast.thumbnailImage.startsWith('/uploads');

            console.log('   Image type:', isBase64 ? 'Base64 ✅' : isURL ? 'URL ✅' : isPath ? 'File Path ⚠️' : 'Unknown ❌');

        } else if (hasGuest) {
            console.log('⚠️  Episode 261 is MISSING thumbnailImage');
            console.log('   But HAS guestImage - this is why it shows the guest photo!');
            console.log();
            console.log('🔧 FIXING NOW...');
            console.log('   Copying guestImage to thumbnailImage...');

            // Copy guestImage to thumbnailImage
            podcast.thumbnailImage = podcast.guestImage;
            await podcast.save();

            console.log('   ✅ FIXED! Episode 261 now has thumbnailImage');
            console.log();
            console.log('📢 ACTION REQUIRED:');
            console.log('   1. Hard refresh your browser (Ctrl + Shift + F5)');
            console.log('   2. Or open in incognito mode');
            console.log('   3. Episode 261 should now show the image!');

        } else {
            console.log('❌ Episode 261 has NO images at all');
            console.log('   You need to upload an image via admin panel');
        }

        console.log();
        console.log('='.repeat(80));
        await mongoose.disconnect();
        console.log('✅ Done!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    }
}

fixEpisode261();
