import dotenv from 'dotenv';
dotenv.config();

interface Config {
    mongodb: {
        uri: string;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    server: {
        port: number;
        nodeEnv: string;
    };
    cors: {
        frontendUrl: string;
    };
    admin: {
        email: string;
        password: string;
    };
}

export const config: Config = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/business-talk',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    server: {
        port: parseInt(process.env.PORT || '5000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    cors: {
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    },
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@businesstalk.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
    },
};
