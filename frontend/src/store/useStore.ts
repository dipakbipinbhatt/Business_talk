import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Podcast } from '../services/api';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

interface PodcastState {
    podcasts: Podcast[];
    upcomingPodcasts: Podcast[];
    pastPodcasts: Podcast[];
    isLoading: boolean;
    error: string | null;
    setPodcasts: (podcasts: Podcast[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addPodcast: (podcast: Podcast) => void;
    updatePodcast: (id: string, podcast: Podcast) => void;
    removePodcast: (id: string) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            login: (user, accessToken, refreshToken) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                set({ user, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);

// Podcast Store
export const usePodcastStore = create<PodcastState>((set, get) => ({
    podcasts: [],
    upcomingPodcasts: [],
    pastPodcasts: [],
    isLoading: false,
    error: null,

    setPodcasts: (podcasts) =>
        set({
            podcasts,
            upcomingPodcasts: podcasts.filter((p) => p.category === 'upcoming'),
            pastPodcasts: podcasts.filter((p) => p.category === 'past'),
        }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    addPodcast: (podcast) => {
        const podcasts = [...get().podcasts, podcast];
        set({
            podcasts,
            upcomingPodcasts: podcasts.filter((p) => p.category === 'upcoming'),
            pastPodcasts: podcasts.filter((p) => p.category === 'past'),
        });
    },

    updatePodcast: (id, updatedPodcast) => {
        const podcasts = get().podcasts.map((p) =>
            p._id === id ? updatedPodcast : p
        );
        set({
            podcasts,
            upcomingPodcasts: podcasts.filter((p) => p.category === 'upcoming'),
            pastPodcasts: podcasts.filter((p) => p.category === 'past'),
        });
    },

    removePodcast: (id) => {
        const podcasts = get().podcasts.filter((p) => p._id !== id);
        set({
            podcasts,
            upcomingPodcasts: podcasts.filter((p) => p.category === 'upcoming'),
            pastPodcasts: podcasts.filter((p) => p.category === 'past'),
        });
    },
}));
