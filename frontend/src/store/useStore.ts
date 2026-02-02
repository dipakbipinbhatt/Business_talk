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

// Podcast Store with persistent caching
interface PodcastState {
    podcasts: Podcast[];
    upcomingPodcasts: Podcast[];
    pastPodcasts: Podcast[];
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null; // Timestamp of last fetch
    setPodcasts: (podcasts: Podcast[]) => void;
    setUpcomingPodcasts: (upcoming: Podcast[]) => void;
    setPastPodcasts: (past: Podcast[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addPodcast: (podcast: Podcast) => void;
    updatePodcast: (id: string, podcast: Podcast) => void;
    removePodcast: (id: string) => void;
    shouldRefetch: () => boolean;
    clearCache: () => void;
}

// Cache duration: 5 minutes (in-memory only, no localStorage)
const CACHE_DURATION = 5 * 60 * 1000;

export const usePodcastStore = create<PodcastState>((set, get) => ({
    podcasts: [],
    upcomingPodcasts: [],
    pastPodcasts: [],
    isLoading: false,
    error: null,
    lastFetched: null,

    setPodcasts: (podcasts) =>
        set({
            podcasts,
            upcomingPodcasts: podcasts.filter((p) => p.category === 'upcoming'),
            pastPodcasts: podcasts.filter((p) => p.category === 'past'),
            lastFetched: Date.now(),
        }),

    setUpcomingPodcasts: (upcoming: Podcast[]) => {
        console.log('[Store] Setting upcoming podcasts:', upcoming.length);
        set(() => ({
            upcomingPodcasts: upcoming,
            lastFetched: Date.now(), // Update timestamp when setting data
        }));
    },

    setPastPodcasts: (past: Podcast[]) => {
        console.log('[Store] Setting past podcasts:', past.length);
        set(() => ({
            pastPodcasts: past,
            lastFetched: Date.now(), // Update timestamp when setting data
        }));
    },

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    // Check if data should be refetched (cache expired or no timestamp)
    shouldRefetch: () => {
        const { lastFetched } = get();
        // Always refetch if no timestamp (first load or cache cleared)
        if (!lastFetched) {
            console.log('[Store] No cache timestamp, should refetch');
            return true;
        }
        // Refetch if cache expired (5 minutes)
        const cacheAge = Date.now() - lastFetched;
        const isExpired = cacheAge > CACHE_DURATION;
        console.log('[Store] Cache check:', {
            ageSeconds: Math.floor(cacheAge / 1000),
            maxSeconds: CACHE_DURATION / 1000,
            isExpired
        });
        return isExpired;
    },

    // Clear cache to force refetch
    clearCache: () => set({ lastFetched: null, podcasts: [], upcomingPodcasts: [], pastPodcasts: [] }),

    addPodcast: (podcast) => {
        // Optimistic update
        set((state) => {
            if (podcast.category === 'upcoming') {
                return { upcomingPodcasts: [...state.upcomingPodcasts, podcast] };
            } else {
                return { pastPodcasts: [podcast, ...state.pastPodcasts] };
            }
        });
    },

    updatePodcast: (id, updatedPodcast) => {
        set((state) => ({
            upcomingPodcasts: state.upcomingPodcasts.map((p) => p._id === id ? updatedPodcast : p),
            pastPodcasts: state.pastPodcasts.map((p) => p._id === id ? updatedPodcast : p),
        }));
    },

    removePodcast: (id) => {
        set((state) => ({
            upcomingPodcasts: state.upcomingPodcasts.filter((p) => p._id !== id),
            pastPodcasts: state.pastPodcasts.filter((p) => p._id !== id),
        }));
    },
}));

