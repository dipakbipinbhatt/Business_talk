
import mongoose from 'mongoose';
import { Podcast } from '../models/Podcast';
import { config } from '../config/env';

async function revertRecentPastToUpcoming() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(config.mongodb.uri as string);

        // Define a "recent" threshold. 
        // The user complained about Jan 30 episodes being in 'past'.
        // Let's look for anything marked 'past' that is >= Jan 25, 2026.
        const recentDate = new Date('2026-01-25T00:00:00.000Z');

        console.log(`Searching for 'past' podcasts scheduled after ${recentDate.toISOString()}...`);

        const candidates = await Podcast.find({
            category: 'past',
            scheduledDate: { $gte: recentDate }
        });

        console.log(`Found ${candidates.length} candidates.`);

        for (const p of candidates) {
            console.log(`- Checking: [${p.scheduledDate.toISOString().split('T')[0]}] ${p.title}`);

            // Logic: If it has no YouTube URL, it's almost certainly not "released" properly, 
            // so putting it in Previous is confusing (shows "Coming Soon").
            // Even if it has a URL, if the user complains, maybe we should revert it.
            // But let's verify if there is a URL.

            const hasLink = !!p.youtubeUrl;
            console.log(`  > Has YouTube Link? ${hasLink}`);

            if (!hasLink) {
                console.log('  > No link. It definitely looks like an upcoming/unreleased episode.');
                console.log('  > ACTION: Reverting to "upcoming".');
                p.category = 'upcoming';
                await p.save();
                console.log('  > Done.');
            } else {
                console.log('  > Has link. Leaving as "past" (assumed released).');
                // Optional: Uncomment below if user wants EVERYTHING reverted regardless of link
                // p.category = 'upcoming'; 
                // await p.save();
            }
        }

        // Also check specifically for episodes 301 and 302 mentioned in screenshot
        console.log('\n--- Specific Check for Ep 301 & 302 ---');
        const specific = await Podcast.find({ episodeNumber: { $in: [301, 302] } });
        for (const p of specific) {
            if (p.category === 'past' && !p.youtubeUrl) {
                console.log(`- Reverting Ep ${p.episodeNumber} to upcoming explicitly.`);
                p.category = 'upcoming';
                await p.save();
            } else {
                console.log(`- Ep ${p.episodeNumber} is ${p.category} (YouTube: ${!!p.youtubeUrl}). No change.`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

revertRecentPastToUpcoming();
