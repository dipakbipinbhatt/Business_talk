import { Response } from 'express';
import { SiteSettings } from '../models/Settings';
import { AuthRequest } from '../middleware/auth';

// Default settings
const DEFAULT_SETTINGS = {
    upcomingInitialLoad: 4,
    upcomingBatchSize: 4,
    pastInitialLoad: 4,
    pastBatchSize: 6,
};

// Get site settings (public)
export const getSettings = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        let settings = await SiteSettings.findOne({ key: 'site-settings' });

        if (!settings) {
            // Create default settings if none exist
            settings = await SiteSettings.create({
                key: 'site-settings',
                ...DEFAULT_SETTINGS
            });
        }

        res.json({
            upcomingInitialLoad: settings.upcomingInitialLoad,
            upcomingBatchSize: settings.upcomingBatchSize,
            pastInitialLoad: settings.pastInitialLoad,
            pastBatchSize: settings.pastBatchSize,
            googleAnalyticsId: settings.googleAnalyticsId,
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        // Return defaults on error
        res.json(DEFAULT_SETTINGS);
    }
};

// Update site settings (admin only)
export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { upcomingInitialLoad, upcomingBatchSize, pastInitialLoad, pastBatchSize, googleAnalyticsId } = req.body;

        // Validate inputs
        const validateNumber = (val: any, name: string): number => {
            const num = parseInt(val, 10);
            if (isNaN(num) || num < 1 || num > 50) {
                throw new Error(`${name} must be between 1 and 50`);
            }
            return num;
        };

        const updates: any = {};

        if (upcomingInitialLoad !== undefined) {
            updates.upcomingInitialLoad = validateNumber(upcomingInitialLoad, 'Upcoming Initial Load');
        }
        if (upcomingBatchSize !== undefined) {
            updates.upcomingBatchSize = validateNumber(upcomingBatchSize, 'Upcoming Batch Size');
        }
        if (pastInitialLoad !== undefined) {
            updates.pastInitialLoad = validateNumber(pastInitialLoad, 'Past Initial Load');
        }
        if (pastBatchSize !== undefined) {
            updates.pastBatchSize = validateNumber(pastBatchSize, 'Past Batch Size');
        }
        if (googleAnalyticsId !== undefined) {
            updates.googleAnalyticsId = googleAnalyticsId;
        }

        // Update or create settings
        const settings = await SiteSettings.findOneAndUpdate(
            { key: 'site-settings' },
            { $set: updates },
            { new: true, upsert: true }
        );

        res.json({
            message: 'Settings updated successfully',
            settings: {
                upcomingInitialLoad: settings.upcomingInitialLoad,
                upcomingBatchSize: settings.upcomingBatchSize,
                pastInitialLoad: settings.pastInitialLoad,
                pastBatchSize: settings.pastBatchSize,
                googleAnalyticsId: settings.googleAnalyticsId,
            },
        });
    } catch (error: any) {
        console.error('Error updating settings:', error);
        res.status(400).json({ message: error.message || 'Failed to update settings' });
    }
};
