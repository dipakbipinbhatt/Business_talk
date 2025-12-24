import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, Youtube, User, Play } from 'lucide-react';
import { podcastAPI, Podcast } from '../services/api';
import { usePodcastStore } from '../store/useStore';

export default function Podcasts() {
    const { upcomingPodcasts, pastPodcasts, setPodcasts, setLoading, isLoading } = usePodcastStore();
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPodcasts = async () => {
            setLoading(true);
            try {
                const response = await podcastAPI.getAll();
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
    }, [setPodcasts, setLoading]);

    // Filter podcasts based on search
    const filterBySearch = (podcastList: Podcast[]) => {
        if (!searchTerm.trim()) return podcastList;

        const search = searchTerm.toLowerCase();
        return podcastList.filter(
            (podcast) =>
                podcast.title.toLowerCase().includes(search) ||
                podcast.guestName.toLowerCase().includes(search) ||
                podcast.description.toLowerCase().includes(search) ||
                podcast.guestTitle.toLowerCase().includes(search) ||
                podcast.guestInstitution?.toLowerCase().includes(search)
        );
    };

    const filteredUpcoming = filterBySearch(upcomingPodcasts);
    const filteredPast = filterBySearch(pastPodcasts);

    // Extract YouTube ID for thumbnails
    const extractYoutubeId = (url?: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
        return match ? match[1] : null;
    };

    // Get thumbnail URL for a podcast
    const getThumbnailUrl = (podcast: Podcast) => {
        if (podcast.thumbnailImage && podcast.thumbnailImage.startsWith('http')) {
            return podcast.thumbnailImage;
        }
        if (podcast.guestImage && podcast.guestImage.startsWith('http')) {
            return podcast.guestImage;
        }
        const youtubeId = extractYoutubeId(podcast.youtubeUrl);
        if (youtubeId) {
            return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }
        return null;
    };

    // Upcoming Episode Card
    const UpcomingCard = ({ podcast, index }: { podcast: Podcast; index: number }) => {
        const thumbnailUrl = getThumbnailUrl(podcast);
        const formattedDate = new Date(podcast.scheduledDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="md:w-72 h-48 md:h-auto relative bg-gradient-to-br from-maroon-100 to-maroon-200 flex-shrink-0">
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={podcast.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-maroon-300/50 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" y1="19" x2="12" y2="22" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-3 left-3 px-3 py-1 bg-maroon-700 text-white text-xs font-bold rounded-full">
                            EP #{podcast.episodeNumber}
                        </div>
                        <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            UPCOMING
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-maroon-700 transition-colors">
                            {podcast.title}
                        </h3>

                        {/* Guest Info */}
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                {podcast.guestImage && podcast.guestImage.startsWith('http') ? (
                                    <img src={podcast.guestImage} alt={podcast.guestName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
                                        <User className="w-6 h-6 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{podcast.guestName}</div>
                                <div className="text-sm text-gray-500">{podcast.guestTitle}</div>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{podcast.description}</p>

                        {/* Date & Time */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-maroon-600" />
                                {formattedDate}
                            </span>
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-maroon-600" />
                                {podcast.scheduledTime}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Past Episode Card
    const PastCard = ({ podcast, index }: { podcast: Podcast; index: number }) => {
        const youtubeId = extractYoutubeId(podcast.youtubeUrl);
        const thumbnailUrl = getThumbnailUrl(podcast);
        const formattedDate = new Date(podcast.scheduledDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
                {/* Thumbnail with Play Button */}
                <div className="relative aspect-video bg-gray-200">
                    {thumbnailUrl ? (
                        <>
                            <img
                                src={thumbnailUrl}
                                alt={podcast.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    if (youtubeId) {
                                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                                    }
                                }}
                            />
                            {podcast.youtubeUrl && (
                                <a
                                    href={podcast.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                    </div>
                                </a>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-gray-400 rounded-full flex items-center justify-center mb-2">
                                    <Youtube className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded">
                        EP #{podcast.episodeNumber}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formattedDate}
                    </div>

                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-maroon-700 transition-colors">
                        {podcast.title}
                    </h3>

                    {/* Guest Info */}
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {podcast.guestImage && podcast.guestImage.startsWith('http') ? (
                                <img src={podcast.guestImage} alt={podcast.guestName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">{podcast.guestName}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{podcast.guestTitle}</div>
                        </div>
                    </div>

                    {/* Watch Button */}
                    {podcast.youtubeUrl && (
                        <a
                            href={podcast.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Youtube className="w-4 h-4 mr-2" />
                            Watch on YouTube
                        </a>
                    )}
                </div>
            </motion.div>
        );
    };

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
                    <p className="text-red-600">{error}</p>
                </div>
            ) : (
                <>
                    {/* Upcoming Episodes Section */}
                    {filteredUpcoming.length > 0 && (
                        <section className="py-12 px-4">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            Upcoming <span className="text-maroon-700">Episodes</span>
                                        </h2>
                                        <p className="text-gray-600 mt-1">Don't miss our upcoming conversations</p>
                                    </div>
                                    <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full text-sm">
                                        {filteredUpcoming.length} Upcoming
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    {filteredUpcoming.map((podcast, index) => (
                                        <UpcomingCard key={podcast._id} podcast={podcast} index={index} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Divider */}
                    {filteredUpcoming.length > 0 && filteredPast.length > 0 && (
                        <div className="max-w-7xl mx-auto px-4">
                            <hr className="border-gray-200" />
                        </div>
                    )}

                    {/* Past Episodes Section */}
                    {filteredPast.length > 0 && (
                        <section className="py-12 px-4 bg-gray-50">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            Past <span className="text-maroon-700">Episodes</span>
                                        </h2>
                                        <p className="text-gray-600 mt-1">Watch our previous conversations</p>
                                    </div>
                                    <span className="px-4 py-2 bg-maroon-100 text-maroon-700 font-semibold rounded-full text-sm">
                                        {filteredPast.length} Episodes
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPast.map((podcast, index) => (
                                        <PastCard key={podcast._id} podcast={podcast} index={index} />
                                    ))}
                                </div>
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
        </div>
    );
}
