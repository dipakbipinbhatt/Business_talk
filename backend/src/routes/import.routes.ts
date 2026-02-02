import { Router, Request, Response } from 'express';
import { Podcast } from '../models/Podcast';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Bulk import podcasts
router.post('/podcasts', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { podcasts } = req.body;

        if (!Array.isArray(podcasts) || podcasts.length === 0) {
            return res.status(400).json({
                error: 'Invalid data. Expected an array of podcasts.'
            });
        }

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[],
            imported: [] as any[]
        };

        for (let i = 0; i < podcasts.length; i++) {
            const podcastData = podcasts[i];

            try {
                // Validate required fields
                if (!podcastData.title) {
                    results.failed++;
                    results.errors.push(`Row ${i + 1}: Missing title`);
                    continue;
                }

                // Use the category explicitly provided in the import data
                // No automatic date-based conversion - only admin can set category
                const category = podcastData.category || 'past';

                // Check for duplicate by title or episode number
                const existingPodcast = await Podcast.findOne({
                    $or: [
                        { title: podcastData.title },
                        ...(podcastData.episodeNumber ? [{ episodeNumber: podcastData.episodeNumber }] : [])
                    ]
                });

                if (existingPodcast) {
                    results.failed++;
                    results.errors.push(`Row ${i + 1}: Duplicate podcast "${podcastData.title}"`);
                    continue;
                }

                // Create podcast
                const newPodcast = new Podcast({
                    title: podcastData.title,
                    description: podcastData.description || '',
                    category,
                    guestName: podcastData.guestName || 'TBA',
                    guestTitle: podcastData.guestTitle || '',
                    guestInstitution: podcastData.guestInstitution || '',
                    guestImage: podcastData.guestImage || '',
                    thumbnailImage: podcastData.thumbnailImage || '',
                    episodeNumber: podcastData.episodeNumber || 0,
                    scheduledDate: podcastData.scheduledDate ? new Date(podcastData.scheduledDate) : new Date(),
                    scheduledTime: podcastData.scheduledTime || '10:00 PM IST',
                    youtubeUrl: podcastData.youtubeUrl || '',
                    tags: podcastData.tags || [],
                });

                await newPodcast.save();
                results.success++;
                results.imported.push({
                    title: newPodcast.title,
                    episodeNumber: newPodcast.episodeNumber,
                    category: newPodcast.category
                });

            } catch (error: any) {
                results.failed++;
                results.errors.push(`Row ${i + 1}: ${error.message}`);
            }
        }

        res.json({
            message: `Import complete. ${results.success} podcasts imported, ${results.failed} failed.`,
            ...results
        });

    } catch (error: any) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Import failed', details: error.message });
    }
});

// Get sample import format
router.get('/sample', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
    res.json({
        format: 'JSON array of podcast objects',
        sample: [
            {
                title: 'Example Podcast Title',
                description: 'Description of the episode',
                guestName: 'Dr. John Doe',
                guestTitle: 'Professor of Business',
                guestInstitution: 'Harvard Business School',
                youtubeUrl: 'https://www.youtube.com/watch?v=VIDEO_ID',
                category: 'past',
                scheduledDate: '2024-12-15',
                scheduledTime: '10:00 PM IST',
                episodeNumber: 310,
                tags: ['business', 'leadership']
            }
        ]
    });
});

export default router;
