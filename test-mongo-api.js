const axios = require('axios');

async function testMongoAPI() {
    console.log('Testing MongoDB Clusters API...\n');
    
    try {
        // First login
        console.log('1. Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@businesstalk.com',
            password: 'Admin@123'
        });
        
        const token = loginRes.data.accessToken;
        console.log('✅ Login successful\n');
        
        // Test POST method
        console.log('2. Testing POST /api/mongodb/clusters...');
        const postRes = await axios.post('http://localhost:5000/api/mongodb/clusters', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ POST Response:', JSON.stringify(postRes.data, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testMongoAPI();
