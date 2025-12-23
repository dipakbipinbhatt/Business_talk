import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.mongodb.uri, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn('⚠️ MongoDB not available. Running in demo mode with mock data.');
        console.warn('   To use with real data, start MongoDB or use MongoDB Atlas.');
        isConnected = false;
    }
};

export const isDBConnected = () => isConnected;

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
    isConnected = false;
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
});
