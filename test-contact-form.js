// Test script to verify contact form is working
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testContactForm() {
    console.log('🧪 Testing Contact Form Submission...\n');

    try {
        // Test 1: Submit a test message
        console.log('📝 Submitting test message...');
        const response = await axios.post(`${API_URL}/contact/submit`, {
            name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message to verify the contact form is working correctly.'
        });

        console.log('✅ Message submitted successfully!');
        console.log('Response:', response.data);
        console.log('\n');

        // Test 2: Check if we can fetch messages (requires admin login)
        console.log('📧 Attempting to fetch messages (will fail without auth - this is expected)...');
        try {
            const messagesResponse = await axios.get(`${API_URL}/contact/messages`);
            console.log('Messages:', messagesResponse.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('⚠️  Authentication required (expected) - Messages are protected');
            } else {
                console.log('❌ Error:', error.message);
            }
        }

        console.log('\n✅ Contact form is working correctly!');
        console.log('📊 To view messages:');
        console.log('   1. Go to http://localhost:5173/admin/dashboard');
        console.log('   2. Login with admin credentials');
        console.log('   3. Click on "Inbox" tab');
        console.log('   4. You should see the test message');

    } catch (error) {
        console.error('❌ Error testing contact form:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
        console.log('\n⚠️  Make sure the backend server is running on http://localhost:5000');
    }
}

testContactForm();
