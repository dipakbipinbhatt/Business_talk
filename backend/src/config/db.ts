import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);

        // Parse the connection string and add necessary options
        let uri = config.mongodb.uri;

        // For Node.js v24+ with OpenSSL 3.0, need to handle TLS differently
        // The connection string should include retryWrites and w=majority

        console.log('🔄 Attempting to connect to MongoDB...');
        console.log(`   URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority',
        });

        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);

        // Seed admin user if not exists
        await seedAdminUser();

    } catch (error: any) {
        console.error('❌ MongoDB Connection Failed!');
        console.error('   Error Type:', error.name);
        console.error('   Error Message:', error.message);
        console.warn('\n⚠️ Running in DEMO MODE with mock data.');
        console.warn('   The API will return sample podcasts instead of database content.\n');

        if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.warn('📝 SSL/TLS Error Detected!');
            console.warn('   This is a known issue with Node.js v24 and MongoDB Atlas.');
            console.warn('   Solutions:');
            console.warn('   1. Whitelist your IP address in MongoDB Atlas');
            console.warn('   2. Use Node.js v20 LTS instead of v24');
            console.warn('   3. Check your MongoDB Atlas cluster TLS version\n');
        }

        if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            console.warn('📝 Network/Connection Error Detected!');
            console.warn('   Possible causes:');
            console.warn('   1. MongoDB server is not running (if using local MongoDB)');
            console.warn('   2. Incorrect connection string');
            console.warn('   3. Network/firewall blocking the connection');
            console.warn('   4. MongoDB Atlas cluster is paused\n');
        }

        isConnected = false;
    }
};

export const isDBConnected = () => isConnected;

// Seed admin user
async function seedAdminUser() {
    try {
        const { User } = await import('../models/User');
        const existingAdmin = await User.findOne({ email: config.admin.email });

        if (!existingAdmin) {
            const admin = new User({
                email: config.admin.email,
                password: config.admin.password,
                name: 'Admin',
                role: 'admin',
            });
            await admin.save();
            console.log('✅ Admin user created:', config.admin.email);
        } else {
            console.log('✅ Admin user exists:', config.admin.email);
        }
    } catch (error: any) {
        console.warn('⚠️ Could not seed admin user:', error.message);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
    isConnected = false;
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
});

mongoose.connection.on('connected', () => {
    console.log('🔗 MongoDB connection established');
});
