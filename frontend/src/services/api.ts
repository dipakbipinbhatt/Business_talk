import axios from 'axios';

// Use environment variable in production, fallback to /api for local dev with proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Log error for debugging
        if (error.response) {
            console.error('API Error Response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                url: error.config?.url,
                data: error.response.data
            });
        } else if (error.request) {
            console.error('API No Response:', {
                url: error.config?.url,
                message: 'No response received from server. Is the backend running?'
            });
        } else {
            console.error('API Request Error:', error.message);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/admin/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (email: string, password: string, name: string) =>
        api.post('/auth/register', { email, password, name }),

    logout: () => api.post('/auth/logout'),

    getMe: () => api.get('/auth/me'),
};

// Podcast API
export const podcastAPI = {
    getAll: (params?: { category?: string; limit?: number; page?: number; search?: string; compact?: boolean }) =>
        api.get('/podcasts', { params }),

    getById: (id: string) => api.get(`/podcasts/${id}`),

    getStats: () => api.get('/podcasts/stats'),

    create: (data: PodcastInput) => api.post('/podcasts', data),

    update: (id: string, data: Partial<PodcastInput>) =>
        api.put(`/podcasts/${id}`, data),

    delete: (id: string) => api.delete(`/podcasts/${id}`),

    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/podcasts/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// Podcast Type API
export const podcastTypeAPI = {
    getAll: () => api.get<PodcastType[]>('/podcast-types'),
    create: (name: string) => api.post<{ message: string; category: PodcastType }>('/podcast-types', { name }),
    delete: (id: string) => api.delete(`/podcast-types/${id}`),
};

// Blog API
export const blogAPI = {
    getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
        api.get('/blogs', { params }),

    getById: (id: string) => api.get(`/blogs/${id}`),

    getAdminById: (id: string) => api.get(`/blogs/admin/${id}`),

    getAdminAll: () => api.get('/blogs/admin/all'),

    getStats: () => api.get('/blogs/admin/stats'),

    create: (data: BlogInput) => api.post('/blogs', data),

    update: (id: string, data: Partial<BlogInput>) =>
        api.put(`/blogs/${id}`, data),

    delete: (id: string) => api.delete(`/blogs/${id}`),
};

// Types
export interface Podcast {
    _id: string;
    title: string;
    description: string;
    category: 'upcoming' | 'past';
    // Legacy single guest fields (for backward compatibility)
    guestName?: string;
    guestTitle?: string;
    guestInstitution?: string;
    guestImage?: string;
    guestGender?: string;
    // New multi-guest support
    guests?: Guest[];
    episodeNumber: number;
    scheduledDate: string;
    scheduledTime: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastUrl?: string;
    amazonMusicUrl?: string;
    audibleUrl?: string;
    soundcloudUrl?: string;
    researchUrl?: string;
    thumbnailImage?: string;
    tags: string[];
    isRescheduled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Guest {
    name: string;
    title: string;
    institution?: string;
    image?: string;
    gender?: string;
}

export interface PodcastType {
    _id: string;
    name: string;
    slug: string;
}

export interface PodcastInput {
    title?: string;
    description?: string;
    category: 'upcoming' | 'past';
    podcastType?: string;
    // Legacy single guest fields (for backward compatibility)
    guestName?: string;
    guestTitle?: string;
    guestInstitution?: string;
    guestImage?: string;
    guestGender?: string;
    // New multi-guest support
    guests?: Guest[];
    episodeNumber?: number;
    scheduledDate?: string;
    scheduledTime?: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastUrl?: string;
    amazonMusicUrl?: string;
    audibleUrl?: string;
    soundcloudUrl?: string;
    researchUrl?: string;
    thumbnailImage?: string;
    tags?: string[];
    isRescheduled?: boolean;
}

export interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    image: string;
    readTime: string;
    tags: string[];
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BlogInput {
    title: string;
    excerpt: string;
    content: string;
    author?: string;
    category: string;
    image?: string;
    readTime?: string;
    tags?: string[];
    isPublished?: boolean;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
}

// Category API
export const categoryAPI = {
    getAll: () => api.get<Category[]>('/categories'),
    create: (name: string) => api.post<{ category: Category }>('/categories', { name }),
    delete: (id: string) => api.delete(`/categories/${id}`),
};

// Import API
export const importAPI = {
    importPodcasts: (podcasts: PodcastInput[]) =>
        api.post('/import/podcasts', { podcasts }),
    getSampleFormat: () => api.get('/import/sample'),
};

// About Us Types
export interface AboutUsContent {
    title: string;
    paragraphs: string[];
}

// About Us API
export const aboutUsAPI = {
    get: () => api.get<AboutUsContent>('/about'),
    update: (data: AboutUsContent) => api.put<{ message: string; aboutUs: AboutUsContent }>('/about', data),
};

// Render API
export const renderAPI = {
    getConfig: () => api.get<{ frontendServiceId: string; backendServiceId: string }>('/render/config'),
    getDeployments: (serviceId: string) =>
        api.post('/render/deployments', { serviceId }),
};

// System Health API
export const systemHealthAPI = {
    check: () => api.get('/health'),
};

export const mongoAPI = {
    getClusters: () => api.post('/mongodb/clusters', {}),
};

// Site Settings Types
export interface SiteSettings {
    upcomingInitialLoad: number;
    upcomingBatchSize: number;
    pastInitialLoad: number;
    pastBatchSize: number;
    googleAnalyticsId?: string;
}

// Settings API
export const settingsAPI = {
    get: () => api.get<SiteSettings>('/settings'),
    update: (settings: Partial<SiteSettings>) => api.put<{ message: string; settings: SiteSettings }>('/settings', settings),
};

// Analytics API
export interface AnalyticsConfig {
    configured: boolean;
    measurementId?: string;
    propertyId?: string;
}

// Types for real GA4 Data API response
export interface GA4MetricRow {
    date: string;
    sessions: number;
    activeUsers: number;
    pageViews: number;
    eventCount: number;
}

export interface TopPage {
    pagePath: string;
    pageTitle: string;
    screenPageViews: number;
}

export interface CountryRow {
    country: string;
    activeUsers: number;
}

export interface GA4AnalyticsData {
    totalSessions: number;
    totalUsers: number;
    totalPageViews: number;
    totalEventCount: number;
    avgSessionDuration: string;
    bounceRate: string;
    newUsers: number;
    activeUsersRightNow: number;
    sevenDayTrend: GA4MetricRow[];
    dailyTrend: GA4MetricRow[];
    topPages: TopPage[];
    topCountries: CountryRow[];
    propertyId: string;
    fetchedAt: string;
}

export const analyticsAPI = {
    getConfig: () => api.get<AnalyticsConfig>('/analytics/config'),

    // NEW: fetch real GA4 metrics — propertyId is numeric (e.g. "123456789")
    getData: (propertyId: string) =>
        api.get<GA4AnalyticsData>(`/analytics/data?propertyId=${propertyId}`),
};

export default api;

// Contact Message Types
export interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    message: string;
    status: 'unread' | 'read' | 'archived';
    createdAt: string;
    readAt?: string;
}

export interface ContactStats {
    total: number;
    unread: number;
    read: number;
    archived: number;
}

// Contact API
export const contactAPI = {
    // Public - Submit contact form
    submit: (data: { name: string; email: string; message: string }) =>
        api.post('/contact/submit', data),

    // Admin - Get all messages
    getMessages: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get<{
            messages: ContactMessage[];
            pagination: { total: number; page: number; limit: number; pages: number };
            unreadCount: number;
        }>('/contact/messages', { params }),

    // Admin - Get single message
    getMessage: (id: string) =>
        api.get<{ message: ContactMessage }>(`/contact/messages/${id}`),

    // Admin - Mark as read
    markAsRead: (id: string) =>
        api.patch<{ message: string; data: ContactMessage }>(`/contact/messages/${id}/read`),

    // Admin - Update status
    updateStatus: (id: string, status: 'unread' | 'read' | 'archived') =>
        api.patch<{ message: string; data: ContactMessage }>(`/contact/messages/${id}/status`, { status }),

    // Admin - Delete message
    delete: (id: string) =>
        api.delete(`/contact/messages/${id}`),

    // Admin - Get stats
    getStats: () =>
        api.get<{ stats: ContactStats }>('/contact/stats'),
};