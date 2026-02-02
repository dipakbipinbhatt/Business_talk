// Check and fix Episode 285 specifically
// Run with: node check-episode-285.js

const mongoose = require('mongoose');

// REPLACE WITH YOUR MONGODB URI FROM .env FILE
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

async function checkEpisode285() {
    try {
        console.log('Checking Episode 285...\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false }));

        // Find Episode 285
        const podcast = await Podcast.findOne({ episodeNumber: 285 });

        if (!podcast) {
            console.log('❌ Episode 285 not found!');
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log('='.repeat(70));
        console.log('EPISODE 285 DETAILS:');
        console.log('='.repeat(70));
        console.log(`Title: ${podcast.title}`);
        console.log(`Category: ${podcast.category}`);
        console.log(`Guest: ${podcast.guestName}`);
        console.log(`\nIMAGE DATA:`);
        console.log(`thumbnailImage: ${podcast.thumbnailImage ? (podcast.thumbnailImage.substring(0, 100) + '...') : '(empty)'}`);
        console.log(`guestImage: ${podcast.guestImage ? (podcast.guestImage.substring(0, 100) + '...') : '(empty)'}`);
        console.log(`youtubeUrl: ${podcast.youtubeUrl || '(empty)'}`);

        // Check if thumbnailImage is valid
        const hasValidThumb = podcast.thumbnailImage &&
            podcast.thumbnailImage.trim() !== '' &&
            (podcast.thumbnailImage.startsWith('data:image') ||
                podcast.thumbnailImage.startsWith('http'));

        console.log(`\nVALIDATION:`);
        console.log(`Has valid thumbnailImage: ${hasValidThumb ? 'YES ✅' : 'NO ❌'}`);

        if (!hasValidThumb) {
            console.log(`\n🔧 ATTEMPTING FIX...`);

            // Check if guestImage is valid
            if (podcast.guestImage && podcast.guestImage.trim() !== '') {
                if (podcast.guestImage.startsWith('data:image') ||
                    podcast.guestImage.startsWith('http')) {

                    console.log(`Copying guestImage to thumbnailImage...`);
                    podcast.thumbnailImage = podcast.guestImage;
                    await podcast.save();
                    console.log(`✅ FIXED! Episode 285 now has thumbnailImage.`);
                    console.log(`\nRefresh your browser to see the change.`);
                } else {
                    console.log(`⚠️  guestImage is a file path: ${podcast.guestImage}`);
                    console.log(`\nSOLUTION: Upload image via admin panel:`);
                    console.log(`1. Go to admin panel`);
                    console.log(`2. Find Episode 285`);
                    console.log(`3. Click Edit`);
                    console.log(`4. Upload thumbnail image`);
                    console.log(`5. Click Save`);
                }
            } else {
                console.log(`❌ No guestImage available.`);
                console.log(`\nSOLUTION: Upload image via admin panel:`);
                console.log(`1. Go to admin panel`);
                console.log(`2. Find Episode 285`);
                console.log(`3. Click Edit`);
                console.log(`4. Upload thumbnail image`);
                console.log(`5. Click Save`);
            }
        } else {
            console.log(`\n✅ Episode 285 already has valid thumbnailImage!`);
            console.log(`If still showing logo on website, try:`);
            console.log(`1. Hard refresh: Ctrl + Shift + R`);
            console.log(`2. Clear browser cache completely`);
            console.log(`3. Try incognito mode`);
        }

        console.log('\n' + '='.repeat(70));
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

checkEpisode285();
