// Test script to verify all admin panel endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('🧪 Testing Admin Panel Endpoints\n');
    console.log('='.repeat(50));

    const tests = [
        {
            name: 'Health Check',
            method: 'GET',
            url: '/health',
            auth: false
        },
        {
            name: 'MongoDB Clusters (GET)',
            method: 'GET',
            url: '/mongodb/clusters',
            auth: true
        },
        {
            name: 'MongoDB Clusters (POST)',
            method: 'POST',
            url: '/mongodb/clusters',
            auth: true,
            data: {}
        },
        {
            name: 'Settings Get',
            method: 'GET',
            url: '/settings',
            auth: true
        },
        {
            name: 'Podcasts Stats',
            method: 'GET',
            url: '/podcasts/stats',
            auth: false
        },
        {
            name: 'Blogs Stats',
            method: 'GET',
            url: '/blogs/admin/stats',
            auth: true
        },
        {
            name: 'About Us',
            method: 'GET',
            url: '/about',
            auth: false
        }
    ];

    // First, login to get token
    let token = null;
    try {
        console.log('\n🔐 Logging in as admin...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@businesstalk.com',
            password: 'Admin@123'
        });
        token = loginRes.data.accessToken;
        console.log('✅ Login successful\n');
    } catch (error) {
        console.log('❌ Login failed:', error.message);
        console.log('   Cannot test authenticated endpoints\n');
    }

    // Test each endpoint
    for (const test of tests) {
        try {
            const config = {
                method: test.method,
                url: `${BASE_URL}${test.url}`,
                headers: {}
            };

            if (test.auth && token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (test.data) {
                config.data = test.data;
            }

            const response = await axios(config);
            console.log(`✅ ${test.name}`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Response:`, JSON.stringify(response.data).substring(0, 100) + '...');
        } catch (error) {
            console.log(`❌ ${test.name}`);
            console.log(`   Status: ${error.response?.status || 'No response'}`);
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
        }
        console.log('');
    }

    console.log('='.repeat(50));
    console.log('✅ Testing complete!\n');
}

testEndpoints().catch(console.error);
