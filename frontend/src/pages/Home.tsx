import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUp, AlignJustify, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import PodcastCard from '../components/podcast/PodcastCard';
import StayUpdated from '../components/layout/StayUpdated';
import { podcastAPI, Podcast, settingsAPI, SiteSettings } from '../services/api';
import logoImage from '../assets/logo.jpg';

const PAGE_SIZE = 10;

export default function Home() {
    const [activeView, setActiveView] = useState<'upcoming' | 'past'>('upcoming');
    const [isPaginated, setIsPaginated] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // ── Upcoming: infinite scroll ─────────────────────────────────────────
    const [upcomingPodcasts, setUpcomingPodcasts] = useState<Podcast[]>([]);
    const [upcomingTotal, setUpcomingTotal] = useState(0);
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);
    const [isLoadingMoreUpcoming, setIsLoadingMoreUpcoming] = useState(false);
    const [upcomingExhausted, setUpcomingExhausted] = useState(false);
    const upcomingObserverRef = useRef<IntersectionObserver | null>(null);
    const upcomingLoadMoreRef = useRef<HTMLDivElement | null>(null);
    const upcomingInitialLoadDone = useRef(false);
    const isLoadingMoreUpcomingRef = useRef(false);
    const upcomingExhaustedRef = useRef(false);

    // ── Upcoming: paginated ───────────────────────────────────────────────
    const [upcomingPagedData, setUpcomingPagedData] = useState<Podcast[]>([]);
    const [upcomingPagedPage, setUpcomingPagedPage] = useState(1);
    const [upcomingPagedTotal, setUpcomingPagedTotal] = useState(0);
    const [isUpcomingPagedLoading, setIsUpcomingPagedLoading] = useState(false);

    // ── Past: infinite scroll ─────────────────────────────────────────────
    const [pastPodcasts, setPastPodcasts] = useState<Podcast[]>([]);
    const [pastTotal, setPastTotal] = useState(0);
    const [pastPage, setPastPage] = useState(1);
    const [isPastLoading, setIsPastLoading] = useState(false); // false — not loaded until needed
    const [isLoadingMorePast, setIsLoadingMorePast] = useState(false);
    const [pastExhausted, setPastExhausted] = useState(false);
    const pastObserverRef = useRef<IntersectionObserver | null>(null);
    const pastLoadMoreRef = useRef<HTMLDivElement | null>(null);
    const pastInitialLoadDone = useRef(false);
    const isLoadingMorePastRef = useRef(false);
    const pastFetchIdRef = useRef(0); // monotonic ID to discard stale fetches
    const pastExhaustedRef = useRef(false);

    // ── Past: paginated ───────────────────────────────────────────────────
    const [pastPagedData, setPastPagedData] = useState<Podcast[]>([]);
    const [pastPagedPage, setPastPagedPage] = useState(1);
    const [pastPagedTotal, setPastPagedTotal] = useState(0);
    const [isPastPagedLoading, setIsPastPagedLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const [settings, setSettings] = useState<SiteSettings>({
        upcomingInitialLoad: 4,
        upcomingBatchSize: 4,
        pastInitialLoad: 4,
        pastBatchSize: 4,
    });
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // ── Page title ────────────────────────────────────────────────────────
    useEffect(() => {
        document.title = "Business Talk | The World's Premier Research-Focused Podcast Series";
    }, []);

    // ── Scroll-to-top ─────────────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // ── Fetch settings ────────────────────────────────────────────────────
    useEffect(() => {
        settingsAPI.get()
            .then(r => setSettings(r.data))
            .catch(() => console.log('[Home] Using default settings'))
            .finally(() => setSettingsLoaded(true));
    }, []);

    // ── Fetch UPCOMING initial (scroll mode) ──────────────────────────────
    useEffect(() => {
        if (!settingsLoaded) return;
        upcomingInitialLoadDone.current = false;
        isLoadingMoreUpcomingRef.current = false;
        upcomingExhaustedRef.current = false;
        setUpcomingExhausted(false);
        setIsUpcomingLoading(true);
        podcastAPI.getAll({ category: 'upcoming', limit: settings.upcomingInitialLoad, page: 1 })
            .then(res => {
                const incoming = res.data.podcasts || [];
                const total = res.data.pagination?.total || 0;
                // Dedup defensively in case the backend ever returns duplicates.
                const seen = new Set<string>();
                const unique = incoming.filter((p: Podcast) => {
                    if (seen.has(p._id)) return false;
                    seen.add(p._id);
                    return true;
                });
                setUpcomingPodcasts(unique);
                setUpcomingTotal(total);
                setUpcomingPage(1);
                // If we already got everything, mark the stream exhausted so the
                // observer can't trigger a doomed page-2 fetch.
                if (unique.length >= total) {
                    upcomingExhaustedRef.current = true;
                    setUpcomingExhausted(true);
                }
            })
            .catch(err => console.error('[Home] Error fetching upcoming:', err))
            .finally(() => {
                setIsUpcomingLoading(false);
                upcomingInitialLoadDone.current = true;
            });
    }, [settingsLoaded, retryCount, settings.upcomingInitialLoad]);

    // ── Load more UPCOMING ────────────────────────────────────────────────
    // Guard uses refs (not state) so concurrent observer firings can't race
    // past the check between a re-render and the flag being flipped. If a page
    // returns no new rows after dedup, we mark the stream exhausted to stop the
    // observer from firing again forever (can happen under MongoDB sort
    // instability where consecutive pages overlap and dedup empties them).
    const loadMoreUpcoming = useCallback(async () => {
        if (
            isLoadingMoreUpcomingRef.current ||
            upcomingExhaustedRef.current ||
            upcomingPodcasts.length >= upcomingTotal
        ) return;
        isLoadingMoreUpcomingRef.current = true;
        setIsLoadingMoreUpcoming(true);
        const nextPage = upcomingPage + 1;
        try {
            const res = await podcastAPI.getAll({ category: 'upcoming', limit: settings.upcomingBatchSize, page: nextPage });
            const incoming = res.data.podcasts || [];
            let addedCount = 0;
            setUpcomingPodcasts(prev => {
                const existing = new Set(prev.map(p => p._id));
                const uniqueNew = incoming.filter((p: Podcast) => !existing.has(p._id));
                addedCount = uniqueNew.length;
                return [...prev, ...uniqueNew];
            });
            setUpcomingPage(nextPage);
            // If this fetch didn't add anything new (empty response, or every
            // row was a duplicate of what we already have), the stream is done.
            if (addedCount === 0) {
                upcomingExhaustedRef.current = true;
                setUpcomingExhausted(true);
            }
        } catch (err) {
            console.error('[Home] Error loading more upcoming:', err);
        } finally {
            isLoadingMoreUpcomingRef.current = false;
            setIsLoadingMoreUpcoming(false);
        }
    }, [upcomingPodcasts.length, upcomingTotal, upcomingPage, settings.upcomingBatchSize]);

    // ── Observer: UPCOMING ────────────────────────────────────────────────
    useEffect(() => {
        if (isPaginated || activeView !== 'upcoming') {
            upcomingObserverRef.current?.disconnect();
            return;
        }
        upcomingObserverRef.current?.disconnect();
        upcomingObserverRef.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting
                && upcomingInitialLoadDone.current
                && !isUpcomingLoading
                && !isLoadingMoreUpcomingRef.current
                && !upcomingExhaustedRef.current
                && upcomingPodcasts.length < upcomingTotal
            ) {
                loadMoreUpcoming();
            }
        }, {
            threshold: 0,
            // Fire 200px before the sentinel enters the viewport — smoother UX
            // and tolerant of zero-height sentinels at the viewport edge.
            rootMargin: '0px 0px 200px 0px',
        });
        if (upcomingLoadMoreRef.current) upcomingObserverRef.current.observe(upcomingLoadMoreRef.current);
        return () => { upcomingObserverRef.current?.disconnect(); };
    }, [loadMoreUpcoming, isUpcomingLoading, upcomingPodcasts.length, upcomingTotal, isPaginated, activeView, upcomingExhausted]);

    // ── Fetch UPCOMING paginated ──────────────────────────────────────────
    const fetchUpcomingPaged = useCallback(async (page: number) => {
        setIsUpcomingPagedLoading(true);
        try {
            const res = await podcastAPI.getAll({ category: 'upcoming', limit: PAGE_SIZE, page });
            setUpcomingPagedData(res.data.podcasts || []);
            setUpcomingPagedTotal(res.data.pagination?.total || 0);
            setUpcomingPagedPage(page);
        } catch (err) {
            console.error('[Home] Error fetching upcoming paged:', err);
        } finally {
            setIsUpcomingPagedLoading(false);
        }
    }, []);

    // ── fetchPastScroll — single source of truth for past scroll fetches ──
    // Uses a fetch ID to discard any response that arrives out of order.
    // `batchSize` is retained in the signature for callsite symmetry but is no longer used
    // inside (the IntersectionObserver + loadMorePast handle page 2+).
    const fetchPastScroll = useCallback((_batchSize: number, initialSize: number) => {
        // Increment fetch ID — any in-flight fetch with a lower ID will be discarded
        const fetchId = ++pastFetchIdRef.current;

        pastInitialLoadDone.current = false;
        isLoadingMorePastRef.current = false;
        pastExhaustedRef.current = false;
        setPastExhausted(false);
        setIsPastLoading(true);
        setIsLoadingMorePast(false);
        setPastPodcasts([]);
        setPastTotal(0);
        setPastPage(1);
        setError(null);

        podcastAPI.getAll({ category: 'past', limit: initialSize, page: 1 })
            .then(res => {
                // Discard if a newer fetch was started after this one
                if (fetchId !== pastFetchIdRef.current) return;
                const podcasts = res.data.podcasts || [];
                const total = res.data.pagination?.total || 0;
                // Dedup page-1 payload in case the backend ever sends duplicates
                const seen = new Set<string>();
                const unique = podcasts.filter((p: Podcast) => {
                    if (seen.has(p._id)) return false;
                    seen.add(p._id);
                    return true;
                });
                setPastPodcasts(unique);
                setPastTotal(total);
                setPastPage(1);
                pastInitialLoadDone.current = true;
                // If the first page already contains everything, mark exhausted
                // so the observer doesn't hammer the API looking for more.
                if (unique.length >= total) {
                    pastExhaustedRef.current = true;
                    setPastExhausted(true);
                }
                // NOTE: The IntersectionObserver handles loading subsequent pages
                // once the sentinel is visible.
            })
            .catch(err => {
                if (fetchId !== pastFetchIdRef.current) return;
                console.error('[Home] Error fetching past scroll:', err);
                setError('Failed to load podcasts. Please try again later.');
            })
            .finally(() => {
                if (fetchId !== pastFetchIdRef.current) return;
                setIsPastLoading(false);
            });
    }, []);

    // ── Load more PAST ────────────────────────────────────────────────────
    // Same pattern as loadMoreUpcoming: atomic ref guard + exhaustion detection
    // when a fetch returns no new rows (protects against MongoDB sort instability
    // where overlapping pages get dedup-emptied, causing an infinite observer loop).
    const loadMorePast = useCallback(async () => {
        if (
            isLoadingMorePastRef.current ||
            pastExhaustedRef.current ||
            pastPodcasts.length >= pastTotal
        ) return;
        isLoadingMorePastRef.current = true;
        setIsLoadingMorePast(true);
        const nextPage = pastPage + 1;
        const fetchId = pastFetchIdRef.current; // capture current fetch session
        try {
            const res = await podcastAPI.getAll({ category: 'past', limit: settings.pastBatchSize, page: nextPage });
            if (fetchId !== pastFetchIdRef.current) return; // discard if view was reset
            const incoming = res.data.podcasts || [];
            let addedCount = 0;
            setPastPodcasts(prev => {
                const existing = new Set(prev.map(p => p._id));
                const uniqueNew = incoming.filter((p: Podcast) => !existing.has(p._id));
                addedCount = uniqueNew.length;
                return [...prev, ...uniqueNew];
            });
            setPastPage(nextPage);
            if (addedCount === 0) {
                pastExhaustedRef.current = true;
                setPastExhausted(true);
            }
        } catch (err) {
            console.error('[Home] Error loading more past:', err);
        } finally {
            isLoadingMorePastRef.current = false;
            setIsLoadingMorePast(false);
        }
    }, [pastPodcasts.length, pastTotal, pastPage, settings.pastBatchSize]);

    // ── Observer: PAST ────────────────────────────────────────────────────
    useEffect(() => {
        if (isPaginated || activeView !== 'past') {
            pastObserverRef.current?.disconnect();
            return;
        }
        pastObserverRef.current?.disconnect();
        pastObserverRef.current = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting
                && pastInitialLoadDone.current
                && !isPastLoading
                && !isLoadingMorePastRef.current
                && !pastExhaustedRef.current
                && pastPodcasts.length < pastTotal
            ) {
                loadMorePast();
            }
        }, {
            threshold: 0,
            rootMargin: '0px 0px 200px 0px',
        });
        if (pastLoadMoreRef.current) pastObserverRef.current.observe(pastLoadMoreRef.current);
        return () => { pastObserverRef.current?.disconnect(); };
    }, [loadMorePast, isPastLoading, pastPodcasts.length, pastTotal, isPaginated, activeView, pastExhausted]);

    // ── Fetch PAST paginated ──────────────────────────────────────────────
    const fetchPastPaged = useCallback(async (page: number) => {
        setIsPastPagedLoading(true);
        setError(null);
        try {
            const res = await podcastAPI.getAll({ category: 'past', limit: PAGE_SIZE, page });
            setPastPagedData(res.data.podcasts || []);
            setPastPagedTotal(res.data.pagination?.total || 0);
            setPastPagedPage(page);
        } catch (err) {
            console.error('[Home] Error fetching past paged:', err);
            setError('Failed to load podcasts. Please try again later.');
        } finally {
            setIsPastPagedLoading(false);
        }
    }, []);

    // ── Handle view switch ────────────────────────────────────────────────
    const handleViewSwitch = useCallback((view: 'upcoming' | 'past') => {
        if (view === activeView) return; // no-op if already on this view
        setActiveView(view);
        if (isPaginated) {
            if (view === 'upcoming') fetchUpcomingPaged(1);
            else fetchPastPaged(1);
        } else if (view === 'past') {
            fetchPastScroll(settings.pastBatchSize, settings.pastInitialLoad);
        }
        // switching back to upcoming needs no fetch — data already loaded
    }, [activeView, isPaginated, fetchUpcomingPaged, fetchPastPaged, fetchPastScroll, settings.pastBatchSize, settings.pastInitialLoad]);

    // ── Handle pagination mode toggle ─────────────────────────────────────
    const wasPaginatedRef = useRef(false);
    useEffect(() => {
        if (!settingsLoaded) return;
        if (isPaginated) {
            wasPaginatedRef.current = true;
            if (activeView === 'upcoming') fetchUpcomingPaged(1);
            else fetchPastPaged(1);
        } else if (wasPaginatedRef.current) {
            // Returning from paginated → scroll: re-fetch past if on past view
            wasPaginatedRef.current = false;
            if (activeView === 'past') {
                fetchPastScroll(settings.pastBatchSize, settings.pastInitialLoad);
            }
        }
    }, [isPaginated, settingsLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRetry = () => {
        setError(null);
        if (activeView === 'past' && !isPaginated) {
            fetchPastScroll(settings.pastBatchSize, settings.pastInitialLoad);
        } else {
            setRetryCount(prev => prev + 1);
        }
    };

    // ── Derived pagination values ─────────────────────────────────────────
    const pagedData      = activeView === 'upcoming' ? upcomingPagedData  : pastPagedData;
    const pagedTotal     = activeView === 'upcoming' ? upcomingPagedTotal : pastPagedTotal;
    const pagedPage      = activeView === 'upcoming' ? upcomingPagedPage  : pastPagedPage;
    const isPagedLoading = activeView === 'upcoming' ? isUpcomingPagedLoading : isPastPagedLoading;
    const totalPages     = Math.ceil(pagedTotal / PAGE_SIZE);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        if (activeView === 'upcoming') fetchUpcomingPaged(page);
        else fetchPastPaged(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | '...')[] = [];
        if (pagedPage <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (pagedPage >= totalPages - 3) {
            pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', pagedPage - 1, pagedPage, pagedPage + 1, '...', totalPages);
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ── Hero Section ─────────────────────────────────────────── */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
                        <div className="flex justify-center mb-6">
                            <img src={logoImage} alt="Business Talk Logo" className="w-28 h-28 sm:w-40 sm:h-40 object-contain rounded-full shadow-lg" />
                        </div>
                        <div className="flex justify-center mb-8">
                            <img src="/banner.png" alt="Business Talk Banner" className="w-full max-w-4xl object-contain rounded-lg shadow-md" fetchPriority="high" decoding="async" />
                        </div>
                        <p className="text-sm sm:text-base text-gray-800 max-w-4xl mx-auto mb-6 text-justify" style={{ lineHeight: '1.75rem' }}>
                            Welcome to Business Talk, your premier podcast for cutting-edge trends,
                            groundbreaking research, valuable insights from notable books, and engaging
                            discussions from the realms of business and academia. Whether you're an academic scholar, researcher,
                            business professional, or entrepreneur, our episodes will inspire you to question the status quo and
                            spark actionable ideas. Our goal is to deliver valuable research insights from the world's renowned scholars,
                            sharing their unique perspectives and expertise.
                        </p>
                        <p className="text-sm sm:text-base text-gray-800 max-w-4xl mx-auto mb-6 text-justify" style={{ lineHeight: '1.75rem' }}>
                            <strong className="text-gray-900">How do we select our speakers?:</strong> The Business Talk committee identifies speakers after a meticulous screening process. These
                            experts are then invited. That is, participation as a speaker is by invitation only. We remain committed to delivering free, high-quality content to our research community and are dedicated to maintaining this model in the future.
                        </p>
                        <p className="text-sm sm:text-base text-gray-800 max-w-4xl mx-auto text-justify" style={{ lineHeight: '1.75rem' }}>
                            Brought to you by <a href="https://www.globalmanagementconsultancy.com/" target="_blank" rel="noopener noreferrer" className="text-maroon-700 hover:underline font-medium">Global Management Consultancy</a>,
                            we are committed to driving innovation and excellence in the business community. The podcast recordings are available in both video and audio formats on this webpage.
                            Simply check the footer for links to all our podcast platforms!
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Sticky Control Bar ───────────────────────────────────── */}
            <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3 gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <button
                                onClick={() => handleViewSwitch('upcoming')}
                                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                                    activeView === 'upcoming'
                                        ? 'bg-maroon-700 text-white shadow-sm'
                                        : 'bg-white text-gray-600 border border-gray-300 hover:border-maroon-300 hover:text-maroon-700'
                                }`}
                            >
                                <span className="sm:hidden">Upcoming</span>
                                <span className="hidden sm:inline">Upcoming Episodes</span>
                            </button>
                            <button
                                onClick={() => handleViewSwitch('past')}
                                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                                    activeView === 'past'
                                        ? 'bg-maroon-700 text-white shadow-sm'
                                        : 'bg-white text-gray-600 border border-gray-300 hover:border-maroon-300 hover:text-maroon-700'
                                }`}
                            >
                                <span className="sm:hidden">Previous</span>
                                <span className="hidden sm:inline">Previous Episodes</span>
                            </button>
                        </div>
                        {/* iOS toggle — mobile only */}
                        <div
                            className="sm:hidden flex items-center flex-shrink-0 bg-gray-100 rounded-full p-0.5 border border-gray-200"
                            style={{ minWidth: 0 }}
                        >
                            <button
                                onClick={() => setIsPaginated(false)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                                    !isPaginated
                                        ? 'bg-maroon-700 text-white shadow-sm'
                                        : 'text-gray-500'
                                }`}
                            >
                                Scroll
                            </button>
                            <button
                                onClick={() => setIsPaginated(true)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                                    isPaginated
                                        ? 'bg-maroon-700 text-white shadow-sm'
                                        : 'text-gray-500'
                                }`}
                            >
                                Paginated
                            </button>
                        </div>

                        {/* Original button — desktop only */}
                        <button
                            onClick={() => setIsPaginated(prev => !prev)}
                            title={isPaginated ? 'Switch to Infinite Scroll' : 'Switch to Pagination'}
                            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                                isPaginated
                                    ? 'bg-maroon-700 text-white border-maroon-700 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-maroon-300 hover:text-maroon-700'
                            }`}
                        >
                            {isPaginated
                                ? <><LayoutGrid className="w-4 h-4" /><span>Paginated</span></>
                                : <><AlignJustify className="w-4 h-4" /><span>Scroll</span></>
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Podcast Content Section ──────────────────────────────── */}
            <section className={`py-8 sm:py-12 ${activeView === 'past' ? 'bg-gray-100 shadow-inner' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
                            <div className="flex flex-wrap items-center gap-3 min-w-0">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                                    {activeView === 'upcoming' ? 'Upcoming Episodes' : 'Previous Episodes'}
                                </h2>
                                {activeView === 'upcoming' ? (
                                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 text-green-700 font-semibold rounded-full text-xs sm:text-sm whitespace-nowrap">
                                        {upcomingTotal} Scheduled
                                    </span>
                                ) : (
                                    pastTotal > 0 && (
                                        <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 font-semibold rounded-full text-xs sm:text-sm whitespace-nowrap">
                                            {pastTotal} Completed
                                        </span>
                                    )
                                )}
                            </div>
                            {activeView === 'past' && pastTotal > 0 && (
                                <Link to="/podcasts" className="flex items-center space-x-2 text-maroon-700 hover:text-maroon-800 font-semibold transition-colors group whitespace-nowrap text-sm sm:text-base">
                                    <span>View&nbsp;All</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                </Link>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                {isPaginated ? (
                                    <>
                                        {isPagedLoading ? (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className={`rounded-2xl h-80 animate-pulse ${activeView === 'past' ? 'bg-gray-200' : 'bg-gray-100'}`} />
                                                ))}
                                            </div>
                                        ) : pagedData.length === 0 ? (
                                            <div className="text-center py-12">
                                                <p className="text-gray-500">{activeView === 'upcoming' ? 'No upcoming podcasts scheduled.' : 'No previous podcasts available yet.'}</p>
                                            </div>
                                        ) : (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {pagedData.map((podcast: Podcast) => (
                                                    <PodcastCard key={podcast._id} podcast={podcast} variant={activeView === 'upcoming' ? 'thumbnail-only' : 'grid'} />
                                                ))}
                                            </div>
                                        )}
                                        {!isPagedLoading && totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
                                                <button onClick={() => goToPage(pagedPage - 1)} disabled={pagedPage === 1}
                                                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:border-maroon-400 hover:text-maroon-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                    ← Prev
                                                </button>
                                                {getPageNumbers().map((p, idx) =>
                                                    p === '...' ? (
                                                        <span key={`e-${idx}`} className="px-2 py-2 text-gray-400 text-sm select-none">…</span>
                                                    ) : (
                                                        <button key={p} onClick={() => goToPage(p as number)}
                                                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${pagedPage === p ? 'bg-maroon-700 text-white shadow-sm' : 'border border-gray-300 text-gray-600 hover:border-maroon-400 hover:text-maroon-700'}`}>
                                                            {p}
                                                        </button>
                                                    )
                                                )}
                                                <button onClick={() => goToPage(pagedPage + 1)} disabled={pagedPage === totalPages}
                                                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:border-maroon-400 hover:text-maroon-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                                    Next →
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : activeView === 'upcoming' ? (
                                    <>
                                        {isUpcomingLoading ? (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {[1,2,3,4].map(i => <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />)}
                                            </div>
                                        ) : upcomingPodcasts.length === 0 ? (
                                            <div className="text-center py-12"><p className="text-gray-500">No upcoming podcasts scheduled. Check back soon!</p></div>
                                        ) : (
                                            <>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {upcomingPodcasts.map((p: Podcast) => (
                                                        <PodcastCard key={p._id} podcast={p} variant="thumbnail-only" />
                                                    ))}
                                                </div>
                                                {upcomingPodcasts.length < upcomingTotal && !upcomingExhausted && (
                                                    <div ref={upcomingLoadMoreRef} className="flex justify-center py-8 min-h-[48px]">
                                                        {isLoadingMoreUpcoming && (
                                                            <div className="flex items-center gap-2 text-maroon-700">
                                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-700" />
                                                                <span>Loading more episodes...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {isPastLoading ? (
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {[1,2,3,4].map(i => <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />)}
                                            </div>
                                        ) : error ? (
                                            <div className="text-center py-12">
                                                <p className="text-red-600 mb-4">{error}</p>
                                                <button onClick={handleRetry} className="px-6 py-3 bg-maroon-700 text-white font-semibold rounded-lg hover:bg-maroon-800 transition-colors">Retry</button>
                                            </div>
                                        ) : pastPodcasts.length === 0 && pastInitialLoadDone.current ? (
                                            <div className="text-center py-12"><p className="text-gray-500">No previous podcasts available yet.</p></div>
                                        ) : pastPodcasts.length === 0 ? (
                                            // Still waiting for first fetch (just switched to Past view)
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {[1,2,3,4].map(i => <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />)}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {pastPodcasts.map((p: Podcast) => (
                                                        <PodcastCard key={p._id} podcast={p} variant="grid" />
                                                    ))}
                                                </div>
                                                {pastPodcasts.length < pastTotal && !pastExhausted && (
                                                    <div ref={pastLoadMoreRef} className="flex justify-center py-8 min-h-[48px]">
                                                        {isLoadingMorePast && (
                                                            <div className="flex items-center gap-2 text-maroon-700">
                                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-700" />
                                                                <span>Loading more podcasts...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            <StayUpdated />

            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}
                        onClick={scrollToTop} aria-label="Scroll to top"
                        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-maroon-700 hover:bg-maroon-800 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}