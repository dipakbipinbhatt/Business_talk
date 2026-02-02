// Test script to verify Calendar API returns all podcasts
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/podcasts?limit=0',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('🧪 Testing Calendar API with limit=0...\n');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            console.log('✅ API Response:');
            console.log(`   Total Podcasts: ${response.data?.podcasts?.length || 0}`);
            console.log(`   Pagination Total: ${response.data?.pagination?.total || 0}`);
            console.log(`   Pagination Pages: ${response.data?.pagination?.pages || 0}`);
            console.log(`   Pagination Limit: ${response.data?.pagination?.limit || 0}`);
            
            if (response.data?.podcasts?.length > 300) {
                console.log('\n✅ SUCCESS: Calendar is loading ALL podcasts!');
            } else {
                console.log('\n❌ ISSUE: Calendar is not loading all podcasts');
            }
        } catch (error) {
            console.error('❌ Error parsing response:', error.message);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
});

req.end();
