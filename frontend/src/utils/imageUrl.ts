/**
 * Image URL utility - handles all image path types
 * Works for both local development and Render deployment
 */

// Get the backend URL from environment or use a default
const getBackendUrl = (): string => {
    // Check for VITE_API_URL environment variable
    const apiUrl = import.meta.env.VITE_API_URL || '';

    if (apiUrl) {
        // Remove /api suffix to get base backend URL
        return apiUrl.replace(/\/api$/, '');
    }

    // Fallback: try to construct from window location for development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000';
    }

    // For production on Render - you need to set VITE_API_URL
    // But as a fallback, return empty string (images won't work but won't break)
    return '';
};

/**
 * Convert image path to full URL
 * @param path - Image path (can be /uploads/xxx, http://xxx, or empty)
 * @returns Full URL or null if no valid path
 */
export const getImageUrl = (path: string | undefined | null): string | null => {
    if (!path || path.trim() === '') {
        return null;
    }

    const trimmedPath = path.trim();

    // Already a full HTTP URL - return as-is
    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
        return trimmedPath;
    }

    // Local /uploads/ path - needs backend URL prepended
    if (trimmedPath.startsWith('/uploads/')) {
        const backendUrl = getBackendUrl();
        if (backendUrl) {
            return `${backendUrl}${trimmedPath}`;
        }
        // If no backend URL, the path might still work if served from same domain
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
