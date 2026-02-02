import { v2 as cloudinary } from 'cloudinary';
import { config as envConfig } from './env';

// Initialize Cloudinary
// Get your credentials at: https://cloudinary.com/console
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const uploadToCloudinary = async (filePath: string): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'business-talk',
            resource_type: 'image',
            transformation: [
                { width: 1280, height: 720, crop: 'fill', quality: 'auto' }
            ]
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const uploadBufferToCloudinary = async (buffer: Buffer, filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'business-talk',
                resource_type: 'image',
                public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('No result from Cloudinary'));
                }
            }
        );
        uploadStream.end(buffer);
    });
};

export const isCloudinaryConfigured = (): boolean => {
    return !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );
};

export default cloudinary;
