/**
 * Image URL utility - handles all image path types
 * Works for both local development and Render deployment
 */

/**
 * Convert image path to full URL
 * @param path - Image path (can be /uploads/xxx, http://xxx, data:xxx, or empty)
 * @returns Full URL or null if no valid path
 */
export const getImageUrl = (path: string | undefined | null): string | null => {
    if (!path || path.trim() === '') {
        return null;
    }

    const trimmedPath = path.trim();

    // Ignore placeholder paths that don't exist
    if (trimmedPath === '/default-avatar.png' || trimmedPath.includes('default-avatar')) {
        return null;
    }

    // Base64 data URL - return as-is (important for MongoDB stored images!)
    if (trimmedPath.startsWith('data:')) {
        return trimmedPath;
    }

    // Already a full HTTP URL - return as-is
    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
        return trimmedPath;
    }

    // Local /uploads/ path - these are served from the frontend's public folder
    // No need to prepend backend URL since promotional images are in frontend/public/uploads/
    if (trimmedPath.startsWith('/uploads/')) {
        return trimmedPath;
    }

    // Any other path - return as-is
    return trimmedPath;
};

/**
 * Get YouTube thumbnail URL from video ID
 */
export const getYoutubeThumbnail = (videoId: string, quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'maxres'): string => {
    const qualityMap = {
        default: 'default',
        mq: 'mqdefault',
        hq: 'hqdefault',
        sd: 'sddefault',
        maxres: 'maxresdefault'
    };
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

/**
 * Extract YouTube video ID from URL
 */
export const extractYoutubeId = (url: string | undefined): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
};
