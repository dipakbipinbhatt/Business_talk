import { motion } from 'framer-motion';
import { Calendar, Clock, Youtube, ExternalLink, User } from 'lucide-react';
import { Podcast } from '../../services/api';

interface PodcastCardProps {
    podcast: Podcast;
    variant?: 'featured' | 'grid';
}

// Platform icons as inline SVGs
const SpotifyIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
);

const ApplePodcastIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59-.26 1.166-.85 1.286a1.077 1.077 0 01-1.283-.853c-.263-1.32-.789-2.373-1.713-3.332-1.932-2.004-4.978-2.49-7.42-1.18-1.852 1.003-3.126 2.96-3.126 5.228 0 1.028.253 2.036.736 2.934.161.299.353.573.588.857.312.374.39.88.185 1.32-.203.44-.646.726-1.132.726l-.067-.002a1.159 1.159 0 01-.967-.652c-.386-.593-.622-1.16-.823-1.75-.247-.721-.38-1.48-.391-2.254 0-2.953 1.633-5.625 4.22-7.047a7.956 7.956 0 013.723-.96z" />
    </svg>
);

const AmazonMusicIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-2 6v8l6-4-6-4z" />
    </svg>
);

const SoundcloudIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1zm-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.304c0-.06-.044-.09-.09-.09zm1.83-1.229c-.06 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.12.12.06 0 .105-.061.12-.12l.24-2.443-.24-2.578c0-.06-.06-.104-.12-.104zm.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.15l.24-2.532-.24-2.623c0-.075-.06-.15-.15-.15zm1.065.683c-.09 0-.15.075-.165.165l-.18 1.77.18 2.459c.015.09.075.149.165.149s.149-.06.165-.149l.225-2.459-.225-1.77c-.015-.09-.075-.165-.165-.165zm.96-2.609c-.09 0-.18.09-.18.18l-.195 4.2.195 2.43c0 .09.09.18.18.18s.165-.09.18-.18l.21-2.43-.21-4.2c-.015-.09-.09-.18-.18-.18zm1.05-.404c-.105 0-.195.09-.195.195l-.165 4.409.18 2.4c0 .12.09.21.195.21.09 0 .195-.09.195-.21l.195-2.4-.21-4.409c0-.105-.09-.195-.18-.195zm1.065-.329c-.12 0-.21.089-.225.209l-.15 4.544.15 2.385c.015.105.105.21.225.21.105 0 .21-.105.21-.21l.166-2.385-.165-4.544c0-.12-.09-.21-.21-.21zm1.065.24c-.135 0-.225.105-.24.24l-.12 4.274.135 2.354c0 .12.105.24.24.24.12 0 .21-.12.24-.24l.149-2.354-.164-4.274c0-.135-.105-.24-.225-.24zm1.08-.584c-.135 0-.255.12-.255.255l-.12 4.604.12 2.339c.015.15.12.255.255.255s.24-.105.255-.27l.135-2.339-.15-4.604c0-.135-.105-.24-.24-.24zm1.095-.089c-.15 0-.27.135-.27.285l-.12 4.424.135 2.324c0 .165.12.285.27.285.135 0 .255-.12.285-.285l.12-2.324-.135-4.424c0-.15-.135-.285-.27-.285zm1.11.869c-.165 0-.285.135-.3.3l-.09 3.539.105 2.309c.015.165.135.3.3.3.15 0 .285-.135.285-.3l.12-2.309-.12-3.539c-.015-.165-.135-.3-.285-.3zm1.095-1.994c-.165 0-.3.15-.315.315l-.09 5.219.105 2.279c0 .18.135.315.315.315.165 0 .3-.135.3-.315l.12-2.279-.12-5.219c-.015-.165-.15-.315-.315-.315zm1.11.045c-.18 0-.33.165-.33.345l-.075 5.13.09 2.264c0 .18.15.33.33.33.165 0 .315-.15.33-.33l.105-2.264-.12-5.13c0-.18-.15-.345-.33-.345zm1.095.239c-.195 0-.345.165-.36.36l-.06 4.86.075 2.249c.015.195.165.36.36.36.18 0 .33-.165.345-.36l.09-2.249-.09-4.86c-.015-.195-.165-.36-.345-.36zm1.095.645c-.21 0-.375.18-.375.39l-.045 4.185.06 2.22c0 .21.165.39.375.39.195 0 .36-.18.375-.39l.075-2.22-.09-4.185c0-.21-.165-.39-.36-.39zm1.11-.539c-.21 0-.39.195-.39.405l-.045 4.68.06 2.205c.015.21.18.39.39.39.195 0 .375-.18.39-.405l.075-2.19-.09-4.68c0-.21-.18-.405-.375-.405zm1.815-.209c-.36 0-.66.3-.66.66v6.15c0 .36.3.66.66.66h5.46a3.48 3.48 0 003.48-3.48c0-1.92-1.56-3.48-3.48-3.48-.6 0-1.17.15-1.665.42-.255-2.19-2.13-3.9-4.41-3.9-.93 0-1.8.3-2.505.81zm8.025 3.48c-.825 0-1.5-.66-1.5-1.5 0-.165-.015-.33-.045-.495-.165-.69-.705-1.245-1.41-1.38-.15-.03-.3-.045-.45-.045-.825 0-1.5.675-1.5 1.5v3.3c0 .165.135.3.3.3h4.605c.825 0 1.5-.66 1.5-1.5-.015-.825-.675-1.5-1.5-1.5z" />
    </svg>
);

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
