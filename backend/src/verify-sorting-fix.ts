
import fetch from 'node-fetch'; // or built-in in newer node
// Using built-in fetch if available, otherwise might need install. 
// Since it is tsx, it might have fetch global if using node 18+.
// Let's assume global fetch or use 'urllib' which is in package.json

import { request } from 'urllib';

const API_URL = 'http://localhost:5000/api/podcasts';

async function testSorting() {
    console.log('Testing Podcast Sorting Basic Logic...');

    try {
        // Test Upcoming
        console.log('\n--- Testing Upcoming (Should be Ascending: Soonest First) ---');
        const upcomingRes = await request(`${API_URL}?category=upcoming&limit=10`, {
            dataType: 'json'
        });

        if (upcomingRes.status !== 200) {
            console.error('Failed to fetch upcoming:', upcomingRes.status);
        } else {
            const podcasts = (upcomingRes.data as any).podcasts;
            console.log(`Fetched ${podcasts.length} upcoming podcasts.`);
            if (podcasts.length > 0) {
                let isAscending = true;
                for (let i = 0; i < podcasts.length - 1; i++) {
                    const d1 = new Date(podcasts[i].scheduledDate).getTime();
                    const d2 = new Date(podcasts[i + 1].scheduledDate).getTime();
                    console.log(`Comparing ${podcasts[i].scheduledDate} <= ${podcasts[i + 1].scheduledDate}`);
                    if (d1 > d2) {
                        isAscending = false;
                        console.error(`FAIL: ${podcasts[i].title} is AFTER ${podcasts[i + 1].title}`);
                    }
                }
                if (isAscending) console.log('✅ Upcoming is sorted ASCENDING (Correct!)');
                else console.log('❌ Upcoming is NOT sorted ascending.');
            }
        }

        // Test Past
        console.log('\n--- Testing Past (Should be Descending: Newest First) ---');
        const pastRes = await request(`${API_URL}?category=past&limit=10`, {
            dataType: 'json'
        });

        if (pastRes.status !== 200) {
            console.error('Failed to fetch past:', pastRes.status);
        } else {
            const podcasts = (pastRes.data as any).podcasts;
            console.log(`Fetched ${podcasts.length} past podcasts.`);
            if (podcasts.length > 0) {
                let isDescending = true;
                for (let i = 0; i < podcasts.length - 1; i++) {
                    const d1 = new Date(podcasts[i].scheduledDate).getTime();
                    const d2 = new Date(podcasts[i + 1].scheduledDate).getTime();
                    console.log(`Comparing ${podcasts[i].scheduledDate} >= ${podcasts[i + 1].scheduledDate}`);
                    if (d1 < d2) {
                        isDescending = false;
                        console.error(`FAIL: ${podcasts[i].title} is BEFORE ${podcasts[i + 1].title}`);
                    }
                }
                if (isDescending) console.log('✅ Past is sorted DESCENDING (Correct!)');
                else console.log('❌ Past is NOT sorted descending.');
            }
        }

    } catch (err: any) {
        console.error('Error running test:', err.message);
        console.log('Is the backend server running?');
    }
}

testSorting();
