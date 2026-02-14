const axios = require('axios');

async function checkJanuaryEpisodes() {
    try {
        console.log('=== Checking January 2026 Episodes ===\n');
        
        // Get all podcasts (no limit)
        const response = await axios.get('http://localhost:5000/api/podcasts?limit=1000');
        const allPodcasts = response.data.podcasts;
        
        // Filter for January 2026
        const januaryPodcasts = allPodcasts.filter(p => {
            const date = new Date(p.scheduledDate);
            return date.getMonth() === 0 && date.getFullYear() === 2026;
        });
        
        // Sort by date
        januaryPodcasts.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
        
        console.log(`Found ${januaryPodcasts.length} episodes in January 2026:\n`);
        
        januaryPodcasts.forEach(p => {
            const date = new Date(p.scheduledDate);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            console.log(`Episode ${p.episodeNumber} - ${dateStr} - [${p.category.toUpperCase()}]`);
            console.log(`  Title: ${p.title}`);
            console.log(`  Guest: ${p.guestName}`);
            console.log('');
        });
        
        // Check specifically for Jan 21
        const jan21 = januaryPodcasts.filter(p => {
            const date = new Date(p.scheduledDate);
            return date.getDate() === 21;
        });
        
        if (jan21.length === 0) {
            console.log('❌ NO EPISODE FOUND FOR JANUARY 21, 2026');
        } else {
            console.log(`✅ Found ${jan21.length} episode(s) for January 21:`);
            jan21.forEach(p => {
                console.log(`   Episode ${p.episodeNumber}: ${p.title} [${p.category}]`);
            });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkJanuaryEpisodes();
