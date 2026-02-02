// Fix ONE specific podcast episode
// Run with: node fix-one-episode.js EPISODE_NUMBER

const mongoose = require('mongoose');

// Get episode number from command line
const episodeNumber = process.argv[2];

if (!episodeNumber) {
    console.log('❌ Please provide episode number!');
    console.log('Usage: node fix-one-episode.js 285');
    process.exit(1);
}

// REPLACE WITH YOUR MONGODB URI FROM .env FILE
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

async function fixOneEpisode() {
    try {
        console.log(`Fixing Episode ${episodeNumber}...\n`);

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false }));

        // Find the specific episode
        const podcast = await Podcast.findOne({ episodeNumber: parseInt(episodeNumber) });

        if (!podcast) {
            console.log(`❌ Episode ${episodeNumber} not found in database!`);
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log(`Found: ${podcast.title}`);
        console.log(`Category: ${podcast.category}`);
        console.log(`\nCurrent Data:`);
        console.log(`  thumbnailImage: ${podcast.thumbnailImage || '(empty)'}`);
        console.log(`  guestImage: ${podcast.guestImage || '(empty)'}`);
        console.log(`  youtubeUrl: ${podcast.youtubeUrl || '(empty)'}`);

        // Check if thumbnailImage is valid
        const hasValidThumb = podcast.thumbnailImage &&
            podcast.thumbnailImage.trim() !== '' &&
            (podcast.thumbnailImage.startsWith('data:image') ||
                podcast.thumbnailImage.startsWith('http'));

        if (hasValidThumb) {
            console.log(`\n✅ Episode ${episodeNumber} already has valid thumbnailImage!`);
            console.log(`   No fix needed.`);
        } else {
            console.log(`\n⚠️  thumbnailImage is invalid or empty`);

            // Try to fix using guestImage
            if (podcast.guestImage && podcast.guestImage.trim() !== '') {
                if (podcast.guestImage.startsWith('data:image') ||
                    podcast.guestImage.startsWith('http')) {

                    console.log(`\n🔧 Fixing: Copying guestImage to thumbnailImage...`);
                    podcast.thumbnailImage = podcast.guestImage;
                    await podcast.save();
                    console.log(`✅ FIXED! Episode ${episodeNumber} now has thumbnailImage.`);
                } else {
                    console.log(`\n⚠️  guestImage is also a file path: ${podcast.guestImage}`);
                    console.log(`   Need to upload image via admin panel.`);
                }
            } else {
                console.log(`\n❌ No guestImage available to use as fallback.`);
                console.log(`   Need to upload image via admin panel.`);
            }
        }

        console.log(`\n✅ Done!\n`);
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixOneEpisode();
