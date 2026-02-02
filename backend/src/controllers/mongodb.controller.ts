import { Request, Response } from 'express';
import { request } from 'urllib';

export const getClusters = async (req: Request, res: Response) => {
    try {
        // Use env vars first, fallback to request body for backward compatibility
        const publicKey = process.env.MONGO_PUBLIC_KEY || req.body.publicKey;
        const privateKey = process.env.MONGO_PRIVATE_KEY || req.body.privateKey;
        const projectId = process.env.MONGO_PROJECT_ID || req.body.projectId;

        console.log('[MongoDB Controller] Checking credentials...');
        console.log('[MongoDB Controller] Public Key present:', !!publicKey);
        console.log('[MongoDB Controller] Private Key present:', !!privateKey);
        console.log('[MongoDB Controller] Project ID:', projectId);

        if (!publicKey || !privateKey || !projectId) {
            console.error('[MongoDB Controller] Missing credentials');
            return res.status(400).json({
                message: 'MongoDB Atlas credentials are not configured',
                missing: {
                    publicKey: !publicKey,
                    privateKey: !privateKey,
                    projectId: !projectId
                }
            });
        }

        // MongoDB Atlas API Endpoint (v1.0 API)
        const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/clusters`;
        console.log('[MongoDB Controller] Fetching from URL:', url);

        // Use urllib for Digest Authentication
        const { status, data } = await request(url, {
            digestAuth: `${publicKey}:${privateKey}`,
            dataType: 'json',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            timeout: 15000, // 15 second timeout
        });

        console.log('[MongoDB Controller] API Response Status:', status);

        if (status !== 200) {
            console.error('[MongoDB Controller] API Error:', data);
            return res.status(status).json({
                message: `MongoDB Atlas API Error: ${status}`,
                details: data
            });
        }

        console.log('[MongoDB Controller] Successfully fetched clusters:', data?.results?.length || 0);
        res.json(data);

    } catch (error: any) {
        console.error('[MongoDB Controller] Error:', error.message);
        console.error('[MongoDB Controller] Full error:', error);
        res.status(500).json({
            message: 'Failed to fetch clusters',
            error: error.message,
            hint: 'Check if the MongoDB Atlas API credentials are correct and have proper permissions'
        });
    }
};
