// Complete verification script
const http = require('http');

console.log('🔍 VERIFICATION SCRIPT\n');
console.log('=' .repeat(60));

// Test 1: Backend API
function testBackend() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/podcasts?limit=0',
            method: 'GET'
        };

        console.log('\n1️⃣ Testing Backend API...');
        console.log('   URL: http://localhost:5000/api/podcasts?limit=0');

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    const count = response.podcasts?.length || 0;
                    const total = response.pagination?.total || 0;
                    
                    if (count === 363 && total === 363) {
                        console.log('   ✅ Backend API: WORKING');
                        console.log(`   ✅ Podcasts returned: ${count}`);
                        console.log(`   ✅ Total in DB: ${total}`);
                        resolve(true);
                    } else {
                        console.log('   ❌ Backend API: ISSUE');
                        console.log(`   ❌ Expected 363, got ${count}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log('   ❌ Backend API: ERROR');
                    console.log(`   ❌ ${error.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.log('   ❌ Backend API: NOT RUNNING');
            console.log(`   ❌ ${error.message}`);
            resolve(false);
        });

        req.end();
    });
}

// Test 2: Frontend Server
function testFrontend() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5173,
            path: '/',
            method: 'GET'
        };

        console.log('\n2️⃣ Testing Frontend Server...');
        console.log('   URL: http://localhost:5173/');

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                console.log('   ✅ Frontend Server: RUNNING');
                console.log(`   ✅ Status: ${res.statusCode}`);
                resolve(true);
            } else {
                console.log('   ❌ Frontend Server: ISSUE');
                console.log(`   ❌ Status: ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (error) => {
            console.log('   ❌ Frontend Server: NOT RUNNING');
            console.log(`   ❌ ${error.message}`);
            resolve(false);
        });

        req.end();
    });
}

// Run all tests
async function runTests() {
    const backendOK = await testBackend();
    const frontendOK = await testFrontend();

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 SUMMARY:\n');
    
    if (backendOK && frontendOK) {
        console.log('✅ ALL SYSTEMS WORKING!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Open browser to: http://localhost:5173/admin/calendar');
        console.log('   2. Press Ctrl+Shift+R to hard refresh (clear cache)');
        console.log('   3. You should see ALL 363 podcasts!');
        console.log('   4. Inbox tab should be visible in navigation');
    } else {
        console.log('❌ SOME SYSTEMS NOT WORKING');
        console.log('\n📝 Fix Steps:');
        if (!backendOK) {
            console.log('   - Backend: cd backend && npm run dev');
        }
        if (!frontendOK) {
            console.log('   - Frontend: cd frontend && npm run dev');
        }
    }
    
    console.log('\n' + '='.repeat(60));
}

runTests();
