import { Request, Response } from 'express';
import { SiteSettings } from '../models/Settings';
import { fetchGA4Data } from '../services/googleAnalyticsService';

// ─── Existing endpoint (unchanged) ──────────────────────────────────────────
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
            propertyId: settings.googleAnalyticsId.replace('G-', ''),
        });
    } catch (error) {
        console.error('Error fetching analytics config:', error);
        res.status(500).json({ message: 'Failed to fetch analytics configuration' });
    }
};

// ─── New endpoint: fetch real GA4 data ──────────────────────────────────────
// GET /api/analytics/data?propertyId=123456789
// Admin-only. Calls the GA4 Data API via the service layer.
export const getAnalyticsData = async (req: Request, res: Response) => {
    try {
        const propertyId = (req.query.propertyId as string)?.trim();

        if (!propertyId) {
            return res.status(400).json({
                message: 'propertyId query parameter is required (e.g. ?propertyId=123456789)'
            });
        }

        // Validate: must be numeric
        if (!/^\d+$/.test(propertyId)) {
            return res.status(400).json({
                message: 'propertyId must be a numeric string (e.g. 123456789), not a Measurement ID (G-XXXXXXXX)'
            });
        }

        // Check service account credentials are configured
        if (!process.env.GA4_CLIENT_EMAIL || !process.env.GA4_PRIVATE_KEY) {
            return res.status(503).json({
                message: 'GA4 service account credentials are not configured on the server. Add GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY to your .env file.'
            });
        }

        console.log(`📊 Fetching GA4 data for property: ${propertyId}`);
        const data = await fetchGA4Data(propertyId);
        console.log(`✅ GA4 data fetched successfully for property: ${propertyId}`);

        res.json(data);
    } catch (error: any) {
        console.error('❌ GA4 data fetch error:', error.message);

        // Return helpful error messages for common issues
        if (error.message?.includes('PERMISSION_DENIED') || error.code === 403) {
            return res.status(403).json({
                message: 'Permission denied. Make sure the service account email is added as a Viewer in your GA4 property.'
            });
        }
        if (error.message?.includes('not found') || error.code === 404) {
            return res.status(404).json({
                message: 'GA4 property not found. Double-check your Property ID in GA4 Admin → Property Settings.'
            });
        }
        if (error.message?.includes('credentials') || error.message?.includes('UNAUTHENTICATED')) {
            return res.status(401).json({
                message: 'Invalid GA4 credentials. Check GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY in your .env file.'
            });
        }

        res.status(500).json({
            message: error.message || 'Failed to fetch analytics data from Google Analytics.'
        });
    }
};