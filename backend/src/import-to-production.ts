// Script to import podcasts to PRODUCTION database
// Run with: MONGODB_URI="your_production_uri" npx tsx src/import-to-production.ts

import mongoose from 'mongoose';
import { Podcast } from './models/Podcast';

// Get production MongoDB URI from environment variable
const PRODUCTION_MONGODB_URI = process.env.MONGODB_URI || process.env.PROD_MONGODB_URI;

if (!PRODUCTION_MONGODB_URI) {
    console.error('❌ ERROR: Please set MONGODB_URI environment variable');
    console.error('Example: MONGODB_URI="mongodb+srv://..." npx tsx src/import-to-production.ts');
    process.exit(1);
}

// All past podcasts to import
const pastPodcasts = [
    { title: "Seeing Beyond the Here and Now: Rethinking Corporate Purpose with Dr. Tima Bansal", guestName: "Dr. Tima Bansal", youtubeUrl: "https://www.youtube.com/watch?v=bdM3lx_o5TE" },
    { title: "From Stores to 'Everywhere': What Dr. Santiago Gallino Reveals About the Future of Retail", guestName: "Dr. Santiago Gallino", youtubeUrl: "https://www.youtube.com/watch?v=O70-Im-e2oY" },
    { title: "When Measurement Goes Wrong: Dr. Robert Austin Explains Performance Dysfunction", guestName: "Dr. Robert Austin", youtubeUrl: "https://www.youtube.com/watch?v=_l8BWNdevMo" },
    { title: "How We Hear: Dr. Laurie Heller Explains the Future of Intelligent Audio", guestName: "Dr. Laurie Heller", youtubeUrl: "https://youtu.be/XM3-BW3u3NU" },
    { title: "Bioethics in Action: Protecting Participants Through Data Safety Monitoring Boards", guestName: "Guest", youtubeUrl: "https://www.youtube.com/watch?v=IVCgW0IvLow" },
    // Add first 10 for quick test - you can add all 151 later
];

async function importToProduction() {
    try {
        console.log('🔄 Connecting to PRODUCTION MongoDB...');
        console.log(`📍 URI: ${PRODUCTION_MONGODB_URI.substring(0, 30)}...`);

        await mongoose.connect(PRODUCTION_MONGODB_URI);
        console.log('✅ Connected to PRODUCTION database');

        // Check current count
        const currentCount = await Podcast.countDocuments({ category: 'past' });
        console.log(`📊 Current past podcasts in database: ${currentCount}`);

        console.log(`\n📦 Importing ${pastPodcasts.length} past podcasts...`);

        let imported = 0;
        let skipped = 0;

        for (let i = 0; i < pastPodcasts.length; i++) {
            const p = pastPodcasts[i];

            // Check if podcast already exists
            const existing = await Podcast.findOne({ title: p.title });
            if (existing) {
                console.log(`⏭️  Skipped (exists): ${p.title.substring(0, 50)}...`);
                skipped++;
                continue;
            }

            // Create podcast
            await Podcast.create({
                title: p.title,
                description: p.title,
                guestName: p.guestName,
                guestTitle: 'Guest Speaker',
                guestInstitution: '',
                category: 'past',
                scheduledDate: new Date('2024-01-01'),
                scheduledTime: '10:00 PM IST',
                youtubeUrl: p.youtubeUrl,
                episodeNumber: pastPodcasts.length - i,
                tags: [],
            });
            console.log(`✅ Imported: ${p.title.substring(0, 50)}...`);
            imported++;
        }

        const finalCount = await Podcast.countDocuments({ category: 'past' });

        console.log(`\n✅ Import complete!`);
        console.log(`   Imported: ${imported}`);
        console.log(`   Skipped (duplicates): ${skipped}`);
        console.log(`   Total past podcasts now: ${finalCount}`);
        console.log(`\n🎉 Your production site should now show previous episodes!`);
        console.log(`   Visit: https://businesstalkwithdeepakbhatt.com/`);
        console.log(`   Hard refresh (Ctrl+Shift+R) to see the changes`);

    } catch (error) {
        console.error('❌ Import failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
    }
}

importToProduction();
