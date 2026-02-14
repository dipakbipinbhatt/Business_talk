const axios = require('axios');

async function testAPI() {
    try {
        // Get all podcasts
        const response = await axios.get('http://localhost:5000/api/podcasts?limit=10');
        
        console.log('=== First 10 Podcasts from API ===');
        console.log(`Total: ${response.data.pagination.total}`);
        console.log('\nPodcasts:');
        
        response.data.podcasts.forEach((p, i) => {
            console.log(`${i + 1}. Episode ${p.episodeNumber}: ${p.title}`);
            console.log(`   Date: ${p.scheduledDate} | Category: ${p.category}`);
        });

        // Search for January 21
        console.log('\n=== Searching for January 21, 2026 ===');
        const jan21Response = await axios.get('http://localhost:5000/api/podcasts?search=january 21');
        console.log(`Found ${jan21Response.data.podcasts.length} results`);
        jan21Response.data.podcasts.forEach(p => {
            console.log(`- Episode ${p.episodeNumber}: ${p.title}`);
            console.log(`  Date: ${p.scheduledDate}`);
        });

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testAPI();
