// Speed test script
const http = require('http');

function testSpeed(path, description) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
            headers: {
                'Accept-Encoding': 'gzip, deflate'
            }
        };

        console.log(`\n🚀 Testing: ${description}`);
        console.log(`   URL: http://localhost:5000${path}`);

        const req = http.request(options, (res) => {
            let data = '';
            let dataSize = 0;

            res.on('data', (chunk) => {
                data += chunk;
                dataSize += chunk.length;
            });

            res.on('end', () => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                try {
                    const response = JSON.parse(data);
                    const count = response.podcasts?.length || 0;
                    const compressed = res.headers['content-encoding'] === 'gzip';
                    
                    console.log(`   ⏱️  Time: ${duration}ms`);
                    console.log(`   📦 Size: ${(dataSize / 1024).toFixed(2)} KB`);
                    console.log(`   🗜️  Compressed: ${compressed ? 'YES' : 'NO'}`);
                    console.log(`   📊 Podcasts: ${count}`);
                    
                    if (duration < 500) {
                        console.log(`   ✅ FAST!`);
                    } else if (duration < 1000) {
                        console.log(`   ⚠️  MODERATE`);
                    } else {
                        console.log(`   ❌ SLOW`);
                    }
                    
                    resolve({ duration, dataSize, count, compressed });
                } catch (error) {
                    console.log(`   ❌ Error: ${error.message}`);
                    resolve(null);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ❌ Request failed: ${error.message}`);
            resolve(null);
        });

        req.end();
    });
}

async function runTests() {
    console.log('⚡ SPEED TEST - Calendar API Optimization\n');
    console.log('='.repeat(60));

    // Test 1: Full data (with images)
    const test1 = await testSpeed(
        '/api/podcasts?limit=0',
        'Full data (WITH large images)'
    );

    // Test 2: Compact mode (without images)
    const test2 = await testSpeed(
        '/api/podcasts?limit=0&compact=true',
        'Compact mode (WITHOUT large images)'
    );

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 COMPARISON:\n');
    
    if (test1 && test2) {
        const speedup = ((test1.duration - test2.duration) / test1.duration * 100).toFixed(1);
        const sizeReduction = ((test1.dataSize - test2.dataSize) / test1.dataSize * 100).toFixed(1);
        
        console.log(`   Speed improvement: ${speedup}% faster`);
        console.log(`   Size reduction: ${sizeReduction}% smaller`);
        console.log(`   Time saved: ${test1.duration - test2.duration}ms`);
        console.log(`   Data saved: ${((test1.dataSize - test2.dataSize) / 1024).toFixed(2)} KB`);
        
        if (test2.compressed) {
            console.log(`\n   ✅ Compression is ENABLED!`);
        } else {
            console.log(`\n   ⚠️  Compression is NOT enabled`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
}

// Wait for server to start
setTimeout(runTests, 5000);
