// Detailed test script to verify Calendar API
const http = require('http');

function testAPI(path, description) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log(`\n🧪 Testing: ${description}`);
        console.log(`   URL: http://localhost:5000${path}`);

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log(`   Status: ${res.statusCode}`);
                    console.log(`   Podcasts returned: ${response.data?.podcasts?.length || response.podcasts?.length || 0}`);
                    console.log(`   Total in DB: ${response.data?.pagination?.total || response.pagination?.total || 0}`);
                    resolve(response);
                } catch (error) {
                    console.error(`   ❌ Error parsing response:`, error.message);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`   ❌ Request failed:`, error.message);
            reject(error);
        });

        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting Calendar API Tests...\n');
    console.log('=' .repeat(60));

    try {
        // Test 1: limit=0 (unlimited)
        await testAPI('/api/podcasts?limit=0', 'Unlimited mode (limit=0)');

        // Test 2: No limit parameter
        await testAPI('/api/podcasts', 'No limit parameter');

        // Test 3: limit=10 (paginated)
        await testAPI('/api/podcasts?limit=10&page=1', 'Paginated mode (limit=10)');

        // Test 4: limit=0 with category
        await testAPI('/api/podcasts?limit=0&category=past', 'Unlimited past podcasts');

        console.log('\n' + '='.repeat(60));
        console.log('✅ All tests completed!');
    } catch (error) {
        console.log('\n' + '='.repeat(60));
        console.log('❌ Tests failed!');
    }
}

runTests();
