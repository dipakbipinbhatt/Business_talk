
import mongoose from 'mongoose';
import { Podcast } from '../models/Podcast';
import { config } from '../config/env';

async function updateCategoriesByDate() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(config.mongodb.uri as string);
        console.log('✅ Connected to MongoDB');

        const now = new Date();
        console.log('Current Time:', now);

        // Find podcasts that are marked 'upcoming' but date is past
        const podcasts = await Podcast.find({});

        let updateCount = 0;

        for (const podcast of podcasts) {
            const scheduledDate = new Date(podcast.scheduledDate);
            let shouldUpdate = false;

            // If scheduled date BEFORE now, it should be PAST
            if (scheduledDate < now && podcast.category !== 'past') {
                console.log(`[PAST CHECK] Podcast "${podcast.title}" (Date: ${scheduledDate.toISOString()}) should be PAST. Updating...`);
                podcast.category = 'past';
                shouldUpdate = true;
            }
            // If scheduled date AFTER now, it should be UPCOMING
            else if (scheduledDate >= now && podcast.category !== 'upcoming') {
                console.log(`[UPCOMING CHECK] Podcast "${podcast.title}" (Date: ${scheduledDate.toISOString()}) should be UPCOMING. Updating...`);
                podcast.category = 'upcoming';
                shouldUpdate = true;
            }

            if (shouldUpdate) {
                await podcast.save();
                updateCount++;
            }
        }

        console.log(`✅ Updated ${updateCount} podcasts to correct categories.`);

        // Print "Dr. Anup Srivastava" details specifically
        const anup = await Podcast.findOne({
            $or: [
                { title: /Anup Srivastava/i },
                { guestName: /Anup Srivastava/i },
                { description: /Anup Srivastava/i }
            ]
        });

        if (anup) {
            console.log('\n--- Details for Dr. Anup Srivastava ---');
            console.log('Title:', anup.title);
            console.log('Date:', anup.scheduledDate);
            console.log('Category:', anup.category);
        } else {
            console.log('\n❌ Dr. Anup Srivastava podcast not found!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateCategoriesByDate();
