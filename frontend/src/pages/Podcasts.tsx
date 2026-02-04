import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2 } from 'lucide-react';
import { podcastAPI, Podcast, settingsAPI, SiteSettings } from '../services/api';
import StayUpdated from '../components/layout/StayUpdated';
import PodcastCard from '../components/podcast/PodcastCard';

export default function Podcasts() {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Dynamic settings from API - same as Home page
    const [settings, setSettings] = useState<SiteSettings>({
        upcomingInitialLoad: 4,
        upcomingBatchSize: 4,
        pastInitialLoad: 4,
        pastBatchSize: 4,
    });
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | Podcasts";
    }, []);

    // Fetch settings FIRST - same as Home page
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsAPI.get();
                setSettings(response.data);
                console.log('[Podcasts] Settings loaded:', response.data);
            } catch (error) {
                console.log('[Podcasts] Using default settings');
            } finally {
                setSettingsLoaded(true);
            }
        };
        fetchSettings();
    }, []);

    // Initial fetch - ONLY PAST episodes - same as Home page
    const fetchInitial = useCallback(async (query: string = '') => {
        if (!settingsLoaded) return;

        setIsLoading(true);
        setError(null);
        setPage(1);
        try {
            // Use same initial load as Home page
            const limit = settings.pastInitialLoad;
            console.log(`[Podcasts] Fetching past podcasts - page 1, limit ${limit}`);
            const response = await podcastAPI.getAll({
                category: 'past',
                limit,
                page: 1,
                search: query,
                // Note: thumbnailImage is included to show uploaded promotional images
            });

            const newPodcasts = response.data.podcasts || [];

            // Remove duplicates based on _id
            const uniquePodcasts = newPodcasts.filter((podcast: Podcast, index: number, self: Podcast[]) =>
                index === self.findIndex((p: Podcast) => p._id === podcast._id)
            );

            setPodcasts(uniquePodcasts);
            console.log(`[Podcasts] Got ${uniquePodcasts.length}/${response.data.pagination?.total} past podcasts (removed ${newPodcasts.length - uniquePodcasts.length} duplicates)`);

            // If we got fewer than limit, we reached the end
            setHasMore(newPodcasts.length >= limit && response.data.pagination.page < response.data.pagination.pages);
        } catch (err) {
            console.error('[Podcasts] Error fetching podcasts:', err);
            setError('Failed to load podcasts. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [settingsLoaded, settings.pastInitialLoad]);

    // Load More fetch - ONLY PAST episodes - same batch size as Home page
    const loadMoreItems = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const limit = settings.pastBatchSize; // Use same batch size as Home page
            console.log(`[Podcasts] Loading more past - page ${nextPage}, limit ${limit}`);

            // IMPORTANT: Only fetch PAST episodes - upcoming should NOT appear here
            const response = await podcastAPI.getAll({
                category: 'past',
                limit,
                page: nextPage,
                search: searchTerm,
                // Note: thumbnailImage is included to show uploaded promotional images
            });

            const newPodcasts = response.data.podcasts || [];

            // Merge with existing and remove duplicates
            setPodcasts(prev => {
                const combined = [...prev, ...newPodcasts];
                return combined.filter((podcast: Podcast, index: number, self: Podcast[]) =>
                    index === self.findIndex((p: Podcast) => p._id === podcast._id)
                );
            });
            setPage(nextPage);
            console.log(`[Podcasts] Added ${newPodcasts.length} more past podcasts`);

            setHasMore(newPodcasts.length === limit && response.data.pagination.page < response.data.pagination.pages);
        } catch (err) {
            console.error('[Podcasts] Error loading more podcasts:', err);
            // Don't set main error, just stop loading more
        } finally {
            setIsLoadingMore(false);
        }
    }, [page, hasMore, searchTerm, isLoadingMore, settings.pastBatchSize]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInitial(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, fetchInitial]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasMore, isLoading, isLoadingMore, loadMoreItems]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Hero Section */}
            <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-r from-maroon-900 to-maroon-800">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Previous <span className="text-gold-400">Episodes</span>
                        </h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Explore our complete collection of past conversations with world-renowned scholars and thought leaders.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-6 px-4 bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by guest name, title, or topic..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 transition-all outline-none"
                        />
                    </div>
                </div>
            </section>

            {isLoading ? (
                <div className="py-16 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-maroon-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading podcasts...</p>
                </div>
            ) : error ? (
                <div className="py-16 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchInitial(searchTerm)}
                        className="px-6 py-3 bg-maroon-700 text-white font-semibold rounded-lg hover:bg-maroon-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* Podcasts Grid */}
                    {podcasts.length > 0 ? (
                        <section className="py-12 px-4 bg-gray-50">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            {searchTerm ? 'Search Results' : 'Latest Episodes'}
                                        </h2>
                                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                            {searchTerm ? `Found ${podcasts.length} matching episodes` : 'Watch our conversations'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {podcasts.map((podcast: Podcast) => (
                                        <PodcastCard key={podcast._id} podcast={podcast} variant="grid" />
                                    ))}
                                </div>

                                {/* Load More Sentinel for Infinite Scroll */}
                                {hasMore && (
                                    <div
                                        ref={loadMoreRef}
                                        className="flex flex-col items-center justify-center py-12"
                                    >
                                        {isLoadingMore ? (
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="w-6 h-6 text-maroon-600 animate-spin" />
                                                <span className="text-gray-600">Loading more episodes...</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={loadMoreItems}
                                                className="px-6 py-3 bg-maroon-700 text-white font-semibold rounded-full hover:bg-maroon-800 transition-colors flex items-center space-x-2"
                                            >
                                                <span>Load More Episodes</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* All Loaded Message */}
                                {!hasMore && podcasts.length > 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">All episodes loaded</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    ) : (
                        <div className="py-16 text-center">
                            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No podcasts found</h3>
                            <p className="text-gray-500">
                                {searchTerm
                                    ? `No results for "${searchTerm}". Try a different search term.`
                                    : 'No podcasts available.'}
                            </p>
                        </div>
                    )}
                </>
            )}

            <StayUpdated />
        </div>
    );
}
