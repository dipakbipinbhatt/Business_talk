
import mongoose from 'mongoose';
import { Podcast } from '../models/Podcast';
import { config } from '../config/env';

async function fixFuturePast() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(config.mongodb.uri as string);
        const now = new Date();
        console.log('Current Time:', now);

        // 1. Find 'past' podcasts that are actually in the future
        const wrongPast = await Podcast.find({
            category: 'past',
            scheduledDate: { $gt: now }
        });

        console.log(`\nFound ${wrongPast.length} podcasts marked as PAST but are in FUTURE:`);
        for (const p of wrongPast) {
            console.log(`- [${p.scheduledDate.toISOString().split('T')[0]}] ${p.title} (ID: ${p._id})`);
            // Fix it
            p.category = 'upcoming';
            await p.save();
            console.log('  -> FIXED: Moved to UPCOMING');
        }

        // 2. Double check 'upcoming' that should be 'past' (re-verify)
        const wrongUpcoming = await Podcast.find({
            category: 'upcoming',
            scheduledDate: { $lt: now }
        });

        console.log(`\nFound ${wrongUpcoming.length} podcasts marked as UPCOMING but are in PAST:`);
        for (const p of wrongUpcoming) {
            console.log(`- [${p.scheduledDate.toISOString().split('T')[0]}] ${p.title} (ID: ${p._id})`);
            // Fix it
            p.category = 'past';
            await p.save();
            console.log('  -> FIXED: Moved to PAST');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

fixFuturePast();
