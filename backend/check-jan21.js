const mongoose = require('mongoose');
require('dotenv').config();

const podcastSchema = new mongoose.Schema({}, { strict: false });
const Podcast = mongoose.model('Podcast', podcastSchema);

async function checkJan21() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check for January 21, 2026 podcasts
        const jan21Podcasts = await Podcast.find({
            scheduledDate: {
                $gte: new Date('2026-01-21T00:00:00.000Z'),
                $lt: new Date('2026-01-22T00:00:00.000Z')
            }
        }).sort({ scheduledDate: -1 });

        console.log('\n=== January 21, 2026 Podcasts ===');
        console.log(`Found ${jan21Podcasts.length} podcast(s)`);
        jan21Podcasts.forEach(p => {
            console.log(`- Episode ${p.episodeNumber}: ${p.title}`);
            console.log(`  Date: ${p.scheduledDate}`);
            console.log(`  Category: ${p.category}`);
        });

        // Get most recent 10 podcasts
        const recentPodcasts = await Podcast.find({})
            .sort({ scheduledDate: -1, episodeNumber: -1 })
            .limit(10);

        console.log('\n=== Most Recent 10 Podcasts (by scheduledDate) ===');
        recentPodcasts.forEach((p, i) => {
            console.log(`${i + 1}. Episode ${p.episodeNumber}: ${p.title}`);
            console.log(`   Date: ${p.scheduledDate} | Category: ${p.category}`);
        });

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkJan21();
