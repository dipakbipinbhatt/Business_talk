import { motion } from 'framer-motion';
import { Calendar, Clock, Youtube, User } from 'lucide-react';
import { Podcast } from '../../services/api';

interface PodcastCardProps {
    podcast: Podcast;
    variant?: 'featured' | 'grid';
}

export default function PodcastCard({ podcast, variant = 'grid' }: PodcastCardProps) {
    const formattedDate = new Date(podcast.scheduledDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).toUpperCase();

    const extractYoutubeId = (url?: string) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
        return match ? match[1] : null;
    };

    const youtubeId = extractYoutubeId(podcast.youtubeUrl);

    // Check if guestImage is a valid URL (not a default/placeholder)
    const isValidGuestImage = (url?: string) => {
        if (!url) return false;
        if (url === '/default-avatar.png' || url === '/uploads/default-avatar.png') return false;
        if (url.startsWith('http://') || url.startsWith('https://')) return true;
        return false;
    };

    // Determine thumbnail URL - custom thumbnail takes priority, then guestImage, then YouTube thumbnail
    const getThumbnailUrl = () => {
        // First priority: explicit thumbnailImage
        if (podcast.thumbnailImage && podcast.thumbnailImage.startsWith('http')) {
            return podcast.thumbnailImage;
        }
        // Second priority: valid guestImage URL (for upcoming episodes especially)
        if (isValidGuestImage(podcast.guestImage)) {
            return podcast.guestImage;
        }
        // Third priority: YouTube thumbnail
        if (youtubeId) {
            return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        }
        return null;
    };

    const thumbnailUrl = getThumbnailUrl();

    // Featured variant - compact horizontal card for upcoming episodes
    if (variant === 'featured') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Thumbnail - Full visible with proper aspect ratio */}
                    <div className="md:w-64 flex-shrink-0 relative bg-gray-900">
                        {thumbnailUrl ? (
                            <div className="aspect-video">
                                <img
                                    src={thumbnailUrl}
                                    alt={podcast.title}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        if (youtubeId && !podcast.thumbnailImage) {
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-maroon-100 to-maroon-200">
                                <div className="w-16 h-16 rounded-full bg-maroon-300 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" y1="19" x2="12" y2="22" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        {/* Episode Badge */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-maroon-700 text-white text-xs font-bold rounded">
                            EP #{podcast.episodeNumber}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                        <div className="flex flex-col h-full justify-between">
                            {/* Top: Category & Title */}
                            <div>
                                <span className="text-xs font-semibold text-maroon-600 uppercase tracking-wide">
                                    Upcoming Episode
                                </span>
                                <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-2 hover:text-maroon-700 transition-colors">
                                    {podcast.title}
                                </h3>
                            </div>

                            {/* Middle: Guest Info */}
                            <div className="flex items-center space-x-3 my-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {podcast.guestImage && podcast.guestImage !== '/uploads/default-avatar.png' ? (
                                        <img src={podcast.guestImage} alt={podcast.guestName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold text-gray-900 truncate">{podcast.guestName}</div>
                                    <div className="text-xs text-gray-500 truncate">{podcast.guestTitle}</div>
                                </div>
                            </div>

                            {/* Bottom: Date & Time */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center space-x-3">
                                    <span className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formattedDate}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {podcast.scheduledTime}
                                    </span>
                                </div>
                                {/* Platform icons */}
                                <div className="flex space-x-1">
                                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                                        <Youtube className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid variant (for past podcasts) - matches the original site's episode highlights
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#EBEBEB] rounded-lg shadow-md overflow-hidden card-hover group relative"
        >
            {/* Geometric Accent - Bottom Left */}
            <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[50px] border-l-transparent border-b-[40px] border-b-purple-400 opacity-50"></div>
                <div className="absolute bottom-0 left-2 w-0 h-0 border-l-[35px] border-l-transparent border-b-[28px] border-b-purple-500 opacity-60"></div>
                <div className="absolute bottom-0 left-4 w-0 h-0 border-l-[20px] border-l-transparent border-b-[16px] border-b-purple-600 opacity-70"></div>
            </div>

            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-200">
                {thumbnailUrl ? (
                    <>
                        <img
                            src={thumbnailUrl}
                            alt={podcast.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to hqdefault YouTube thumbnail if maxres fails
                                if (youtubeId && !podcast.thumbnailImage) {
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
                                    <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </a>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-100 to-maroon-200">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-maroon-300 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-8 h-8 text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-maroon-600">Coming Soon</span>
                        </div>
                    </div>
                )}
                {/* Episode Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-black rounded shadow-lg">
                    EP #{podcast.episodeNumber}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 relative z-10">
                {/* Date */}
                <div className="flex items-center text-xs text-gray-600 font-bold mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formattedDate}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-tight">
                    {podcast.title}
                </h3>

                {/* Guest Info */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden shadow">
                        {podcast.guestImage && podcast.guestImage !== '/uploads/default-avatar.png' ? (
                            <img src={podcast.guestImage} alt={podcast.guestName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{podcast.guestName}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{podcast.guestTitle}</div>
                    </div>
                </div>

                {/* Platform Links */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                    {podcast.youtubeUrl ? (
                        <a
                            href={podcast.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <Youtube className="w-4 h-4 mr-1" />
                            Click here to Watch
                        </a>
                    ) : (
                        <span className="text-xs text-gray-400">Coming Soon</span>
                    )}

                    {/* Mini platform icons */}
                    <div className="flex space-x-1">
                        {podcast.spotifyUrl && (
                            <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z" />
                                </svg>
                            </a>
                        )}
                        {podcast.applePodcastUrl && (
                            <a href={podcast.applePodcastUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
