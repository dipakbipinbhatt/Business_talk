// DIRECT FIX: Update Episode 261 in database
// This bypasses the admin panel authentication issue
// Run with: node fix-episode-261-direct.js

const mongoose = require('mongoose');

// Get MongoDB URI from environment or paste your actual URI here
const MONGODB_URI = process.env.MONGODB_URI || 'paste-your-mongodb-uri-here';

async function fixEpisode261Direct() {
    try {
        console.log('Connecting to MongoDB...\n');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        const Podcast = mongoose.model('Podcast', new mongoose.Schema({}, { strict: false }));

        // Find Episode 261
        const podcast = await Podcast.findOne({ episodeNumber: 261 });

        if (!podcast) {
            console.log('❌ Episode 261 not found!');
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log('Found Episode 261:', podcast.title);
        console.log('\nCurrent state:');
        console.log(`  thumbnailImage: ${podcast.thumbnailImage ? (podcast.thumbnailImage.substring(0, 50) + '...') : '(empty)'}`);
        console.log(`  guestImage: ${podcast.guestImage ? (podcast.guestImage.substring(0, 50) + '...') : '(empty)'}`);

        // Check if guestImage exists and is Base64
        if (podcast.guestImage && podcast.guestImage.startsWith('data:image')) {
            console.log('\n🔧 Copying guestImage to thumbnailImage...');

            podcast.thumbnailImage = podcast.guestImage;
            await podcast.save();

            console.log('✅ FIXED!');
            console.log('\nEpisode 261 now has:');
            console.log(`  thumbnailImage: ${podcast.thumbnailImage.substring(0, 50)}...`);
            console.log('\n📢 Now refresh your website (Ctrl + Shift + F5)');
            console.log('   Episode 261 should show the image!');
        } else {
            console.log('\n⚠️  No valid guestImage to copy.');
            console.log('   You need to upload the image manually.');
        }

        await mongoose.disconnect();
        console.log('\n✅ Done!\n');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixEpisode261Direct();
