
import mongoose from 'mongoose';
import { Podcast } from './models/Podcast';
import { config } from './config/env';

async function checkAnup() {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('Connected to DB');

        const podcast = await Podcast.findOne({
            $or: [
                { title: /Anup Srivastava/i },
                { guestName: /Anup Srivastava/i }
            ]
        });

        if (podcast) {
            console.log('Found Podcast:');
            console.log('Title:', podcast.title);
            console.log('Date:', podcast.scheduledDate);
            console.log('Category:', podcast.category);
            console.log('ID:', podcast._id);

            const now = new Date();
            const pDate = new Date(podcast.scheduledDate);
            console.log('Current Date:', now);
            console.log('Is Past?', pDate < now);

            if (pDate < now && podcast.category === 'upcoming') {
                console.log('MISMATCH: Date is past but category is UPCOMING.');
                console.log('Updating category to PAST...');
                podcast.category = 'past';
                await podcast.save();
                console.log('Updated successfully.');
            } else {
                console.log('Category seems correct relative to date.');
            }

        } else {
            console.log('Podcast not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkAnup();
