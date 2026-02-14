
import mongoose from 'mongoose';
import { Podcast } from '../models/Podcast';
import { config } from '../config/env';

async function forceFix() {
    try {
        console.log('Connecting to DB...', config.mongodb.uri);
        await mongoose.connect(config.mongodb.uri as string);
        console.log('Connected.');

        // 1. Find the specific podcast
        // Using a broad regex to ensure we catch it
        const query = {
            $or: [
                { title: /Anup Srivastava/i },
                { guestName: /Anup Srivastava/i }
            ]
        };

        const podcast = await Podcast.findOne(query);

        if (!podcast) {
            console.log('❌ Could not find "Anup Srivastava" podcast!');
        } else {
            console.log('\n--- Found Podcast ---');
            console.log(`Title: ${podcast.title}`);
            console.log(`Current Category: ${podcast.category}`);
            console.log(`Scheduled Date: ${podcast.scheduledDate}`);

            // 2. Force Update to PAST
            if (podcast.category !== 'past') {
                console.log('👉 Changing category to "past"...');
                podcast.category = 'past';
                // Ensure date is correct just in case (Jan 21, 2026)
                // podcast.scheduledDate = new Date('2026-01-21T10:00:00.000Z'); 
                await podcast.save();
                console.log('✅ Updated successfully.');
            } else {
                console.log('✅ Already set to "past".');
            }
        }

        // 3. Verify Sort Order of Past Episodes
        console.log('\n--- Top 5 Past Episodes (Expected Order) ---');
        const pastPodcasts = await Podcast.find({ category: 'past' })
            .sort({ scheduledDate: -1, episodeNumber: -1 })
            .limit(5)
            .select('title scheduledDate episodeNumber category');

        pastPodcasts.forEach((p, i) => {
            console.log(`${i + 1}. [${p.scheduledDate.toISOString().split('T')[0]}] ${p.title} (${p.category})`);
        });

        if (pastPodcasts.length > 0 && pastPodcasts[0].title.includes('Anup Srivastava')) {
            console.log('\n✅ SUCCESS: Anup Srivastava is #1 in the list.');
        } else {
            console.log('\n⚠️ WARNING: Anup Srivastava is NOT #1. Check date sorting.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

forceFix();
