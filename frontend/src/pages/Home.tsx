import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PodcastCard from '../components/podcast/PodcastCard';
import StayUpdated from '../components/layout/StayUpdated';
import { podcastAPI, Podcast, settingsAPI, SiteSettings } from '../services/api';
import logoImage from '../assets/logo.jpg';

export default function Home() {
    // Upcoming podcasts state - server-side pagination
    const [upcomingPodcasts, setUpcomingPodcasts] = useState<Podcast[]>([]);
    const [upcomingTotal, setUpcomingTotal] = useState(0);
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);
    const [isLoadingMoreUpcoming, setIsLoadingMoreUpcoming] = useState(false);
    const upcomingObserverRef = useRef<IntersectionObserver | null>(null);
    const upcomingLoadMoreRef = useRef<HTMLDivElement | null>(null);

    // Past podcasts state - server-side pagination
    const [pastPodcasts, setPastPodcasts] = useState<Podcast[]>([]);
    const [pastTotal, setPastTotal] = useState(0);
    const [pastPage, setPastPage] = useState(1);
    const [isPastLoading, setIsPastLoading] = useState(true);
    const [isLoadingMorePast, setIsLoadingMorePast] = useState(false);
    const pastObserverRef = useRef<IntersectionObserver | null>(null);
    const pastLoadMoreRef = useRef<HTMLDivElement | null>(null);



    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Dynamic settings from API
    const [settings, setSettings] = useState<SiteSettings>({
        upcomingInitialLoad: 4,
        upcomingBatchSize: 4,
        pastInitialLoad: 4,
        pastBatchSize: 4,
    });
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | The World's Premier Research-Focused Podcast Series";
    }, []);

    // Fetch settings FIRST, then fetch podcasts
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsAPI.get();
                setSettings(response.data);
                console.log('[Home] Settings loaded:', response.data);
            } catch (error) {
                console.log('[Home] Using default settings');
            } finally {
                setSettingsLoaded(true);
            }
        };
        fetchSettings();
    }, []);

    // Fetch INITIAL upcoming podcasts (only after settings loaded)
    useEffect(() => {
        if (!settingsLoaded) return;

        const fetchUpcoming = async () => {
            setIsUpcomingLoading(true);
            console.log(`[Home] Fetching upcoming podcasts - page 1, limit ${settings.upcomingInitialLoad}`);
            try {
                const response = await podcastAPI.getAll({
                    category: 'upcoming',
                    limit: settings.upcomingInitialLoad,
                    page: 1
                });
                setUpcomingPodcasts(response.data.podcasts || []);
                setUpcomingTotal(response.data.pagination?.total || 0);
                setUpcomingPage(1);
                console.log(`[Home] Got ${response.data.podcasts?.length}/${response.data.pagination?.total} upcoming podcasts`);
            } catch (err) {
                console.error('[Home] Error fetching upcoming podcasts:', err);
            } finally {
                setIsUpcomingLoading(false);
            }
        };

        fetchUpcoming();
    }, [settingsLoaded, retryCount, settings.upcomingInitialLoad]);

    // Load MORE upcoming podcasts on scroll
    const loadMoreUpcoming = useCallback(async () => {
        if (isLoadingMoreUpcoming || upcomingPodcasts.length >= upcomingTotal) return;

        setIsLoadingMoreUpcoming(true);
        const nextPage = upcomingPage + 1;
        console.log(`[Home] Loading more upcoming - page ${nextPage}, limit ${settings.upcomingBatchSize}`);

        try {
            const response = await podcastAPI.getAll({
                category: 'upcoming',
                limit: settings.upcomingBatchSize,
                page: nextPage
            });
            const newPodcasts = response.data.podcasts || [];
            setUpcomingPodcasts(prev => [...prev, ...newPodcasts]);
            setUpcomingPage(nextPage);
            console.log(`[Home] Added ${newPodcasts.length} more upcoming podcasts`);
        } catch (err) {
            console.error('[Home] Error loading more upcoming:', err);
        } finally {
            setIsLoadingMoreUpcoming(false);
        }
    }, [upcomingPodcasts.length, upcomingTotal, upcomingPage, isLoadingMoreUpcoming, settings.upcomingBatchSize]);

    // Intersection observer for upcoming scroll
    useEffect(() => {
        if (upcomingObserverRef.current) upcomingObserverRef.current.disconnect();

        upcomingObserverRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isUpcomingLoading && !isLoadingMoreUpcoming && upcomingPodcasts.length < upcomingTotal) {
                    loadMoreUpcoming();
                }
            },
            { threshold: 0.1 }
        );

        if (upcomingLoadMoreRef.current) {
            upcomingObserverRef.current.observe(upcomingLoadMoreRef.current);
        }

        return () => {
            if (upcomingObserverRef.current) upcomingObserverRef.current.disconnect();
        };
    }, [loadMoreUpcoming, isUpcomingLoading, isLoadingMoreUpcoming, upcomingPodcasts.length, upcomingTotal]);

    // Fetch INITIAL past podcasts (only after settings loaded)
    useEffect(() => {
        if (!settingsLoaded) return;

        const fetchPast = async () => {
            setIsPastLoading(true);
            setError(null);
            console.log(`[Home] Fetching past podcasts - page 1, limit ${settings.pastInitialLoad}`);

            try {
                const response = await podcastAPI.getAll({
                    category: 'past',
                    limit: settings.pastInitialLoad,
                    page: 1
                    // Note: thumbnailImage is included to show uploaded promotional images
                });
                setPastPodcasts(response.data.podcasts || []);
                setPastTotal(response.data.pagination?.total || 0);
                setPastPage(1);
                console.log(`[Home] Got ${response.data.podcasts?.length}/${response.data.pagination?.total} past podcasts`);
            } catch (err) {
                console.error('[Home] Error fetching past podcasts:', err);
                setError('Failed to load podcasts. Please try again later.');
            } finally {
                setIsPastLoading(false);
            }
        };

        fetchPast();
    }, [settingsLoaded, retryCount, settings.pastInitialLoad]);

    // Load MORE past podcasts on scroll
    const loadMorePast = useCallback(async () => {
        if (isLoadingMorePast || pastPodcasts.length >= pastTotal) return;

        setIsLoadingMorePast(true);
        const nextPage = pastPage + 1;
        console.log(`[Home] Loading more past - page ${nextPage}, limit ${settings.pastBatchSize}`);

        try {
            const response = await podcastAPI.getAll({
                category: 'past',
                limit: settings.pastBatchSize,
                page: nextPage
                // Note: thumbnailImage is included to show uploaded promotional images
            });
            const newPodcasts = response.data.podcasts || [];
            setPastPodcasts(prev => [...prev, ...newPodcasts]);
            setPastPage(nextPage);
            console.log(`[Home] Added ${newPodcasts.length} more past podcasts`);
        } catch (err) {
            console.error('[Home] Error loading more past:', err);
        } finally {
            setIsLoadingMorePast(false);
        }
    }, [pastPodcasts.length, pastTotal, pastPage, isLoadingMorePast, settings.pastBatchSize]);

    // Intersection observer for past scroll
    useEffect(() => {
        if (pastObserverRef.current) pastObserverRef.current.disconnect();

        pastObserverRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isPastLoading && !isLoadingMorePast && pastPodcasts.length < pastTotal) {
                    loadMorePast();
                }
            },
            { threshold: 0.1 }
        );

        if (pastLoadMoreRef.current) {
            pastObserverRef.current.observe(pastLoadMoreRef.current);
        }

        return () => {
            if (pastObserverRef.current) pastObserverRef.current.disconnect();
        };
    }, [loadMorePast, isPastLoading, isLoadingMorePast, pastPodcasts.length, pastTotal]);

    const handleRetry = () => {
        setError(null);
        setRetryCount(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Pure white background */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Larger Logo - no "Business Talk" text */}
                        <div className="flex justify-center mb-6">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="w-40 h-40 object-contain rounded-full shadow-lg"
                            />
                        </div>

                        {/* Banner Image */}
                        <div className="flex justify-center mb-8">
                            <img
                                src="/banner.png"
                                alt="Business Talk Banner"
                                className="w-full max-w-4xl object-contain rounded-lg shadow-md"
                                fetchPriority="high"
                                decoding="async"
                            />
                        </div>

                        {/* Welcome text - dark black headers */}
                        <p className="text-base text-gray-800 max-w-4xl mx-auto mb-6 text-justify" style={{ lineHeight: '1.75rem' }}>
                            Welcome to Business Talk, your premier podcast for cutting-edge trends,
                            groundbreaking research, valuable insights from notable books, and engaging
                            discussions from the realms of business and academia. Whether you're an academic scholar, researcher,
                            business professional, or entrepreneur, our episodes will inspire you to question the status quo and
                            spark actionable ideas. Our goal is to deliver valuable research insights from the world's renowned scholars,
                            sharing their unique perspectives and expertise.
                        </p>

                        <p className="text-base text-gray-800 max-w-4xl mx-auto mb-6 text-justify" style={{ lineHeight: '1.75rem' }}>
                            <strong className="text-gray-900">How do we select our speakers?:</strong> The Business Talk committee identifies speakers after a meticulous screening process. These
                            experts are then invited. That is, participation as a speaker is by invitation only. We remain committed to delivering free, high-quality content to our research community and are dedicated to maintaining this model in the future.
                        </p>

                        <p className="text-base text-gray-800 max-w-4xl mx-auto text-justify" style={{ lineHeight: '1.75rem' }}>
                            Brought to you by <a href="https://www.globalmanagementconsultancy.com/" target="_blank" rel="noopener noreferrer" className="text-maroon-700 hover:underline font-medium">Global Management Consultancy</a>,
                            we are committed to driving innovation and excellence in the business community. The podcast recordings are available in both video and audio formats on this webpage.
                            Simply check the footer for links to all our podcast platforms!
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Upcoming Podcasts Section */}
            <section className="py-8 sm:py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                Upcoming Podcast Episodes
                            </h2>
                            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 text-green-700 font-semibold rounded-full text-xs sm:text-sm whitespace-nowrap">
                                {upcomingTotal} Scheduled
                            </span>
                        </div>

                        {isUpcomingLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
                                ))}
                            </div>
                        ) : upcomingPodcasts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No upcoming podcasts scheduled. Check back soon!</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {upcomingPodcasts.map((podcast: Podcast) => (
                                        <PodcastCard key={podcast._id} podcast={podcast} variant="thumbnail-only" />
                                    ))}
                                </div>

                                {/* Infinite scroll sentinel for upcoming */}
                                {upcomingPodcasts.length < upcomingTotal && (
                                    <div ref={upcomingLoadMoreRef} className="flex justify-center py-8">
                                        {isLoadingMoreUpcoming && (
                                            <div className="flex items-center gap-2 text-maroon-700">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-700"></div>
                                                <span>Loading more episodes...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Previous Podcasts Section */}
            <section className="py-16 bg-gray-100 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                Previous Episodes
                            </h2>
                            {pastTotal > 0 && (
                                <Link
                                    to="/podcasts"
                                    className="flex items-center space-x-2 text-maroon-700 hover:text-maroon-800 font-semibold transition-colors group whitespace-nowrap text-sm sm:text-base"
                                >
                                    <span>View&nbsp;All</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </Link>
                            )}
                        </div>

                        {isPastLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="px-6 py-3 bg-maroon-700 text-white font-semibold rounded-lg hover:bg-maroon-800 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : pastPodcasts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No previous podcasts available yet.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {pastPodcasts.map((podcast: Podcast) => (
                                        <PodcastCard key={podcast._id} podcast={podcast} variant="grid" />
                                    ))}
                                </div>

                                {/* Infinite scroll sentinel for past */}
                                {pastPodcasts.length < pastTotal && (
                                    <div ref={pastLoadMoreRef} className="flex justify-center mt-8">
                                        {isLoadingMorePast && (
                                            <div className="flex items-center gap-2 text-maroon-700">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-700"></div>
                                                <span>Loading more podcasts...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Stay Updated Section */}
            <StayUpdated />
        </div>
    );
}
