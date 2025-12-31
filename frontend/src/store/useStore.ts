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

    setUpcomingPodcasts: (upcoming: Podcast[]) =>
        set(() => ({
            upcomingPodcasts: upcoming,
        })),

    setPastPodcasts: (past: Podcast[]) =>
        set(() => ({
            pastPodcasts: past,
        })),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    // Check if data should be refetched (cache expired or no data)
    shouldRefetch: () => {
        const { lastFetched, upcomingPodcasts, pastPodcasts } = get();
        // If we have no data at all, refetch
        if (upcomingPodcasts.length === 0 && pastPodcasts.length === 0) return true;
        // If cache is expired
        if (lastFetched && Date.now() - lastFetched > CACHE_DURATION) return true;
        // Otherwise valid
        return false;
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

