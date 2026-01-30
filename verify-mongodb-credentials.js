#!/usr/bin/env node
/**
 * MongoDB Atlas Credentials Verification Script
 * Run this on your EC2 instance to verify credentials are loaded correctly
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
require('dotenv').config({ path: require('path').resolve(__dirname, 'backend/.env') });

console.log('\n🔍 MongoDB Atlas Credentials Check\n');
console.log('=' .repeat(50));

const credentials = {
    'MONGO_PUBLIC_KEY': process.env.MONGO_PUBLIC_KEY,
    'MONGO_PRIVATE_KEY': process.env.MONGO_PRIVATE_KEY,
    'MONGO_PROJECT_ID': process.env.MONGO_PROJECT_ID,
    'MONGODB_URI': process.env.MONGODB_URI
};

let allPresent = true;

for (const [key, value] of Object.entries(credentials)) {
    const present = !!value;
    const icon = present ? '✅' : '❌';
    
    if (!present) allPresent = false;
    
    if (key === 'MONGO_PRIVATE_KEY' && value) {
        // Mask private key for security
        console.log(`${icon} ${key}: ${value.substring(0, 8)}...${value.substring(value.length - 4)}`);
    } else if (key === 'MONGODB_URI' && value) {
        // Mask password in URI
        const masked = value.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        console.log(`${icon} ${key}: ${masked}`);
    } else if (value) {
        console.log(`${icon} ${key}: ${value}`);
    } else {
        console.log(`${icon} ${key}: NOT SET`);
    }
}

console.log('=' .repeat(50));

if (allPresent) {
    console.log('\n✅ All MongoDB credentials are configured!\n');
    console.log('Next steps:');
    console.log('1. Rebuild backend: cd backend && npm run build');
    console.log('2. Restart backend service');
    console.log('3. Test API: curl http://localhost:5000/api/mongodb/clusters\n');
} else {
    console.log('\n❌ Some credentials are missing!\n');
    console.log('Solutions:');
    console.log('1. Copy .env to backend: cp .env backend/.env');
    console.log('2. Or set environment variables directly in your service manager');
    console.log('3. See EC2_MONGODB_CLUSTER_FIX.md for detailed instructions\n');
    process.exit(1);
}
