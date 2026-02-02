import { Request, Response } from 'express';
import { SiteSettings } from '../models/Settings';

// Get Google Analytics configuration for frontend embed
export const getAnalyticsConfig = async (req: Request, res: Response) => {
    try {
        const settings = await (SiteSettings as any).getSettings();

        if (!settings.googleAnalyticsId) {
            return res.status(404).json({
                message: 'Google Analytics not configured',
                configured: false
            });
        }

        // Return the GA ID for the frontend to use with the embed API
        res.json({
            configured: true,
            measurementId: settings.googleAnalyticsId,
            // Property ID is derived from measurement ID (G-XXXXXXXXXX -> XXXXXXXXXX)
            propertyId: settings.googleAnalyticsId.replace('G-', ''),
        });
    } catch (error) {
        console.error('Error fetching analytics config:', error);
        res.status(500).json({ message: 'Failed to fetch analytics configuration' });
    }
};

// Note: For full GA4 Data API integration, you would need:
// 1. A Google Cloud Service Account with GA4 access
// 2. The @google-analytics/data package
// 3. More complex authentication setup
//
// For now, we're using the Embed API approach which is simpler
// and allows authenticated users to view their analytics directly.
