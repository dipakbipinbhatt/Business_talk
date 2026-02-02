
import { request } from 'urllib';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const publicKey = process.env.MONGO_PUBLIC_KEY;
const privateKey = process.env.MONGO_PRIVATE_KEY;
const projectId = process.env.MONGO_PROJECT_ID;

console.log('Testing MongoDB Atlas API Connection...');
console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey ? '****' + privateKey.slice(-4) : 'MISSING');
console.log('Project ID:', projectId);

async function testConnection() {
    if (!publicKey || !privateKey || !projectId) {
        console.error('Missing credentials in .env');
        return;
    }

    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters`;

    try {
        console.log(`Connecting to: ${url}`);
        const { status, data, headers } = await request(url, {
            digestAuth: `${publicKey}:${privateKey}`,
            dataType: 'json',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            timeout: 10000
        });

        console.log('Status:', status);

        if (status === 200) {
            console.log('SUCCESS!');
            console.log('Clusters found:', data.results?.length);
            if (data.results?.length > 0) {
                console.log('First cluster:', data.results[0].name);
            }
        } else {
            console.error('FAILED');
            console.error('Error Data:', JSON.stringify(data, null, 2));
            console.log('Headers:', headers);

            if (status === 401) {
                console.log('\nPossible causes for 401 Unauthorized:');
                console.log('1. Invalid Public/Private key.');
                console.log('2. IP Address is not whitelisted in the API Key Access List (NOT Database Access List).');
                console.log('3. API Key does not have "Project Owner" or "Project Read Only" permissions.');
            }
        }

    } catch (error: any) {
        console.error('Exception:', error.message);
    }
}

testConnection();
