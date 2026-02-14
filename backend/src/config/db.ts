import mongoose from 'mongoose';
import { config } from './env';

let isConnected = false;
let disconnectTimer: NodeJS.Timeout | null = null;

// Configuration for connection handling
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds
const GRACE_PERIOD_MS = 30000; // 30 seconds to reconnect before killing process

const connectWithRetry = async (retryCount = 0): Promise<typeof mongoose | void> => {
    try {
        const uri = config.mongodb.uri;

        // For Node.js v24+ with OpenSSL 3.0, need to handle TLS differently
        // The connection string should include retryWrites and w=majority

            console.log('🔄 Attempting to connect to MongoDB...');
            console.log(`   URI: ${logUri}`);
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            // Mongoose 6+ defaults are good, but explicit is fine
            retryWrites: true,
            w: 'majority',
        });

        // Initialize connection state
        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);

        return conn;

    } catch (error: any) {
        console.error(`❌ MongoDB Connection Failed (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        console.error('   Error:', error.message);

        if (retryCount < MAX_RETRIES) {
            console.log(`⏳ Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
            return connectWithRetry(retryCount + 1);
        } else {
            console.error('🚨 Max retries reached. Database connection is critical.');
            // In production, we want to crash so Docker/Render restarts us
            if (config.server.nodeEnv === 'production') {
                console.error('🚨 Exiting process to trigger container restart...');
                process.exit(1);
            } else {
                console.warn('⚠️ Running in disconnected mode (Development only).');
                isConnected = false;
            }
        }
    }
};

export const connectDB = async (): Promise<void> => {
    mongoose.set('strictQuery', false);

    await connectWithRetry();

    if (isConnected) {
        await seedAdminUser();
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

// Connection Events
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected!');
    isConnected = false;

    // Set a "Dead Man's Switch"
    // If not reconnected within GRACE_PERIOD_MS, kill the process to force a restart
    if (!disconnectTimer && config.server.nodeEnv === 'production') {
        console.log(`⏳ Starting ${GRACE_PERIOD_MS / 1000}s grace period for reconnection...`);
        disconnectTimer = setTimeout(() => {
            console.error('🚨 MongoDB failed to reconnect within grace period. Exiting process to trigger restart...');
            process.exit(1);
        }, GRACE_PERIOD_MS);
    }
});

mongoose.connection.on('connected', () => {
    console.log('🔗 MongoDB connection established');
    isConnected = true;

    // Clear the "Dead Man's Switch" if it exists
    if (disconnectTimer) {
        console.log('✅ Reconnected! Clearing grace period timer.');
        clearTimeout(disconnectTimer);
        disconnectTimer = null;
    }
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
});

