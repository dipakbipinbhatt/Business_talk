import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2 } from 'lucide-react';
import { podcastAPI, Podcast } from '../services/api';
import { usePodcastStore } from '../store/useStore';
import StayUpdated from '../components/layout/StayUpdated';
import PodcastCard from '../components/podcast/PodcastCard';

// Number of items per row (3 on desktop) * 2 rows = 6 items initially
const ITEMS_PER_LOAD = 6;

export default function Podcasts() {
    const { upcomingPodcasts, pastPodcasts, setPodcasts, setLoading, isLoading, shouldRefetch, clearCache } = usePodcastStore();
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const handleRetry = () => {
        clearCache();
        setError(null);
        setRetryCount(prev => prev + 1);
    };

    useEffect(() => {
        const fetchPodcasts = async () => {
            // Only fetch if cache is expired, empty, OR simply partially loaded (from Home page)
            // Heuristic: if we have very few past podcasts (< 10) but likely have more, we should refetch
            const isPartialCache = pastPodcasts.length > 0 && pastPodcasts.length < 10;

            if (!shouldRefetch() && !isPartialCache && retryCount === 0) {
                return;
            }

            setLoading(true);
            try {
                // Fetch ALL podcasts for the dedicated page
                const response = await podcastAPI.getAll({ limit: 500 });
                setPodcasts(response.data.podcasts);
                setError(null);
            } catch (err) {
                console.error('Error fetching podcasts:', err);
                setError('Failed to load podcasts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPodcasts();
    }, [setPodcasts, setLoading, shouldRefetch, pastPodcasts.length, retryCount, clearCache]);

    // Reset display count when search term changes
    useEffect(() => {
        setDisplayCount(ITEMS_PER_LOAD);
    }, [searchTerm]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !isLoadingMore) {
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
    }, [displayCount, isLoadingMore]);

    // Load more items function
    const loadMoreItems = useCallback(() => {
        setIsLoadingMore(true);
        // Simulate a small delay for smooth UX
        setTimeout(() => {
            setDisplayCount(prev => prev + ITEMS_PER_LOAD);
            setIsLoadingMore(false);
        }, 300);
    }, []);

    // Filter podcasts based on search
    const filterBySearch = (podcastList: Podcast[]) => {
        if (!searchTerm.trim()) return podcastList;

        const search = searchTerm.toLowerCase();
        return podcastList.filter(
            (podcast) =>
                podcast.title.toLowerCase().includes(search) ||
                podcast.guestName?.toLowerCase().includes(search) ||
                podcast.description.toLowerCase().includes(search) ||
                podcast.guestTitle?.toLowerCase().includes(search) ||
                podcast.guestInstitution?.toLowerCase().includes(search) ||
                podcast.guests?.some(guest =>
                    guest.name.toLowerCase().includes(search) ||
                    guest.title.toLowerCase().includes(search) ||
                    guest.institution?.toLowerCase().includes(search)
                )
        );
    };

    const filteredUpcoming = filterBySearch(upcomingPodcasts);
    const filteredPast = filterBySearch(pastPodcasts);

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
                            All <span className="text-gold-400">Podcasts</span>
                        </h1>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Explore our complete collection of insightful conversations with world-renowned scholars and thought leaders.
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
                        onClick={handleRetry}
                        className="px-6 py-3 bg-maroon-700 text-white font-semibold rounded-lg hover:bg-maroon-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>

                    {/* Previous Episodes Section */}
                    {filteredPast.length > 0 && (
                        <section className="py-12 px-4 bg-gray-50">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            Previous <span className="text-maroon-700">Episodes</span>
                                        </h2>
                                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Watch our previous conversations</p>
                                    </div>
                                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-maroon-100 text-maroon-700 font-semibold rounded-full text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                                        {filteredPast.length} Episodes
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {filteredPast.slice(0, displayCount).map((podcast: Podcast) => (
                                        <PodcastCard key={podcast._id} podcast={podcast} variant="grid" />
                                    ))}
                                </div>

                                {/* Load More Sentinel for Infinite Scroll */}
                                {displayCount < filteredPast.length && (
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
                                        <p className="text-gray-500 text-sm mt-2">
                                            Showing {Math.min(displayCount, filteredPast.length)} of {filteredPast.length} episodes
                                        </p>
                                    </div>
                                )}

                                {/* All Loaded Message */}
                                {displayCount >= filteredPast.length && filteredPast.length > ITEMS_PER_LOAD && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">All {filteredPast.length} episodes loaded</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* No Results */}
                    {filteredUpcoming.length === 0 && filteredPast.length === 0 && (
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
