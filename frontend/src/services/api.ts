import axios from 'axios';

const API_BASE_URL = '/api';

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
    getAll: (params?: { category?: string; limit?: number; page?: number }) =>
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

// Types
export interface Podcast {
    _id: string;
    title: string;
    description: string;
    category: 'upcoming' | 'past';
    guestName: string;
    guestTitle: string;
    guestInstitution: string;
    guestImage: string;
    episodeNumber: number;
    scheduledDate: string;
    scheduledTime: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastUrl?: string;
    amazonMusicUrl?: string;
    soundcloudUrl?: string;
    thumbnailImage?: string;
    tags: string[];
    isRescheduled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PodcastInput {
    title: string;
    description: string;
    category: 'upcoming' | 'past';
    guestName: string;
    guestTitle: string;
    guestInstitution?: string;
    guestImage?: string;
    episodeNumber: number;
    scheduledDate: string;
    scheduledTime?: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastUrl?: string;
    amazonMusicUrl?: string;
    soundcloudUrl?: string;
    thumbnailImage?: string;
    tags?: string[];
    isRescheduled?: boolean;
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

export default api;
