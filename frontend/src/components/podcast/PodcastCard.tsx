import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Youtube, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Podcast } from '../../services/api';
import { getImageUrl, extractYoutubeId, getYoutubeThumbnail } from '../../utils/imageUrl';
import logoImage from '../../assets/logo.jpg';
import spotifyLogo from '../../assets/platforms/spotify.png';
import appleLogo from '../../assets/platforms/apple-podcasts.png';
import amazonLogo from '../../assets/platforms/amazon-music.png';
import audibleLogo from '../../assets/platforms/audible.jpg';
import soundcloudLogo from '../../assets/platforms/soundcloud.png';

interface PodcastCardProps {
    podcast: Podcast;
    variant?: 'featured' | 'grid' | 'thumbnail-only';
}

export default function PodcastCard({ podcast, variant = 'grid' }: PodcastCardProps) {
    const [showAllGuests, setShowAllGuests] = useState(false);

    const formattedDate = new Date(podcast.scheduledDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).toUpperCase();

    const youtubeId = extractYoutubeId(podcast.youtubeUrl);

    // Get thumbnail URL - for podcast cards (promotional images ONLY, not guest photos)
    const getThumbnailUrl = () => {
        // Priority: thumbnailImage > YouTube thumbnail > guestImage (as last resort) > logo
        // NOTE: guestImage is used as fallback ONLY when thumbnailImage is invalid

        const thumbnailUrl = getImageUrl(podcast.thumbnailImage);
        if (thumbnailUrl) {
            console.log(`[PodcastCard] Using thumbnailImage for "${podcast.title}":`, thumbnailUrl);
            return thumbnailUrl;
        }

        // Use YouTube thumbnail if available (promotional image from YouTube)
        if (youtubeId) {
            const ytThumb = getYoutubeThumbnail(youtubeId);
            console.log(`[PodcastCard] Using YouTube thumbnail for "${podcast.title}":`, ytThumb);
            return ytThumb;
        }

        // FALLBACK: Use guestImage if thumbnailImage is missing/invalid
        // This handles cases where database has invalid file paths
        const guestImageUrl = getImageUrl(podcast.guestImage);
        if (guestImageUrl) {
            console.log(`[PodcastCard] Using guestImage as fallback for "${podcast.title}":`, guestImageUrl);
            return guestImageUrl;
        }

        // Return logo as final fallback
        console.log(`[PodcastCard] Using logo fallback for "${podcast.title}"`);
        return logoImage;
    };

    // Get guest info - prioritize guests array, fallback to legacy fields
    const getGuestInfo = () => {
        if (podcast.guests && podcast.guests.length > 0) {
            return podcast.guests;
        }
        // Fallback to legacy single guest
        if (podcast.guestName && podcast.guestTitle) {
            return [{
                name: podcast.guestName,
                title: podcast.guestTitle,
                institution: podcast.guestInstitution,
                image: podcast.guestImage
            }];
        }
        return [];
    };

    const guests = getGuestInfo();
    const thumbnailUrl = getThumbnailUrl();

    // State for image error handling (moved to top level to comply with Rules of Hooks)
    const [imageError, setImageError] = React.useState(false);

    // Handle image error - try YouTube thumbnail, then logo
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        // Try YouTube thumbnail first
        if (youtubeId && !target.src.includes('youtube.com')) {
            target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
        } else if (!target.src.includes(logoImage)) {
            // Use logo as final fallback
            target.src = logoImage;
        }
    };

    // Featured variant - compact horizontal card for upcoming episodes
    if (variant === 'featured') {
        const showPlaceholder = !thumbnailUrl || imageError;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
                <div className="flex flex-col md:flex-row h-full">
                    {/* Thumbnail */}
                    <div className="w-full md:w-80 flex-shrink-0 relative aspect-video bg-gray-100 overflow-hidden">
                        {showPlaceholder ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-maroon-50 via-maroon-100 to-maroon-200 p-6">
                                <div className="relative mb-3">
                                    <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <svg className="w-10 h-10 text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="22" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-maroon-700 mb-1">Business Talk Podcast</p>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={thumbnailUrl}
                                alt={podcast.guestName}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                        <div className="flex flex-col h-full justify-between">
                            {/* Top: Category & Title */}
                            <div className="mb-4">
                                <span className="text-xs font-semibold text-maroon-600 uppercase tracking-wide">
                                    Upcoming Episode
                                </span>
                                <h3 className="text-base font-bold text-gray-900 mt-2 line-clamp-2 hover:text-maroon-700 transition-colors leading-snug min-h-[3rem]">
                                    {podcast.title}
                                </h3>
                            </div>

                            {/* Middle: Guest Info - Show main guest with "View More" option */}
                            <div className="mb-4">
                                {/* Main Guest (First Guest) */}
                                {guests.length > 0 && (
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 ring-2 ring-maroon-200 shadow-md">
                                            {guests[0].image && getImageUrl(guests[0].image) ? (
                                                <img
                                                    src={getImageUrl(guests[0].image) || ''}
                                                    alt={guests[0].name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.parentElement!.innerHTML = `
                                                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                                                <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                                    <circle cx="12" cy="7" r="4"></circle>
                                                                </svg>
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                                    <User className="w-7 h-7 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-bold text-gray-900 truncate">{guests[0].name}</div>
                                            <div className="text-xs text-gray-600 truncate mt-0.5">{guests[0].title}</div>
                                            {guests[0].institution && (
                                                <div className="text-xs text-gray-500 truncate mt-0.5">{guests[0].institution}</div>
                                            )}
                                        </div>
                                        {/* View More Button */}
                                        {guests.length > 1 && (
                                            <button
                                                onClick={() => setShowAllGuests(!showAllGuests)}
                                                className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-maroon-700 bg-maroon-50 hover:bg-maroon-100 rounded-md transition-colors flex items-center space-x-1"
                                            >
                                                <span>{showAllGuests ? 'Hide' : `+${guests.length - 1} More`}</span>
                                                {showAllGuests ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Additional Guests (shown when expanded) - Same vertical line */}
                                {showAllGuests && guests.length > 1 && (
                                    <div className="space-y-3 mt-3">
                                        {guests.slice(1).map((guest, index) => (
                                            <div key={index + 1} className="flex items-center space-x-3">
                                                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 ring-2 ring-gray-300 shadow-md">
                                                    {guest.image && getImageUrl(guest.image) ? (
                                                        <img
                                                            src={getImageUrl(guest.image) || ''}
                                                            alt={guest.name}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.parentElement!.innerHTML = `
                                                                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                                                        <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                                            <circle cx="12" cy="7" r="4"></circle>
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                                            <User className="w-7 h-7 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-bold text-gray-900 truncate">{guest.name}</div>
                                                    <div className="text-xs text-gray-600 truncate mt-0.5">{guest.title}</div>
                                                    {guest.institution && (
                                                        <div className="text-xs text-gray-500 truncate mt-0.5">{guest.institution}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bottom: Date, Time & Platform Icons */}
                            <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-200">
                                <div className="flex flex-col space-y-1.5">
                                    <span className="flex items-center font-semibold text-gray-700">
                                        <Calendar className="w-4 h-4 mr-1.5 text-maroon-600" />
                                        {formattedDate}
                                    </span>
                                    <span className="flex items-center font-semibold text-gray-700">
                                        <Clock className="w-4 h-4 mr-1.5 text-maroon-600" />
                                        {podcast.scheduledTime}
                                    </span>
                                </div>
                                {/* Platform icons */}
                                <div className="flex flex-col space-y-1.5">
                                    {podcast.youtubeUrl && (
                                        <a href={podcast.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 transition-colors shadow-sm">
                                            <Youtube className="w-4 h-4 text-white" />
                                            <span className="text-white text-xs font-semibold">YouTube</span>
                                        </a>
                                    )}
                                    {podcast.spotifyUrl && (
                                        <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-green-500 hover:bg-green-600 transition-colors shadow-sm">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C18.24 9.541 10.68 9.241 6.241 10.561c-.6.15-1.201-.181-1.381-.721-.18-.601.18-1.2.72-1.381 5.16-1.44 13.44-1.02 18.72 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                            </svg>
                                            <span className="text-white text-xs font-semibold">Spotify</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Thumbnail-only variant (for upcoming podcasts - shows only the image)
    if (variant === 'thumbnail-only') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden card-hover group relative"
            >
                {/* Thumbnail only - no content section */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={podcast.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon-100 to-maroon-200">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto bg-maroon-300 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-8 h-8 text-maroon-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" y1="19" x2="12" y2="22" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-maroon-600">Coming Soon</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    // Grid variant (for previous podcasts)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden card-hover group relative"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {thumbnailUrl ? (
                    <>
                        <img
                            src={thumbnailUrl}
                            alt={podcast.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={handleImageError}
                        />
                        {podcast.youtubeUrl && (
                            <a
                                href={podcast.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="22" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-maroon-600">Coming Soon</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 relative z-10">
                {/* Date */}
                <div className="flex items-center text-xs text-gray-600 font-semibold mb-3">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-maroon-600" />
                    {formattedDate}
                </div>

                {/* Title - with proper text alignment and fixed height */}
                <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-maroon-700 transition-colors text-base leading-snug min-h-[3rem]">
                    {podcast.title}
                </h3>

                {/* Guest Info - Show main guest with "View More" option */}
                <div className="mb-4">
                    {/* Main Guest (First Guest) */}
                    {guests.length > 0 && (
                        <div className="flex items-start space-x-3 mb-2">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm ring-2 ring-gray-300">
                                {guests[0].image && getImageUrl(guests[0].image) ? (
                                    <img
                                        src={getImageUrl(guests[0].image) || ''}
                                        alt={guests[0].name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.parentElement!.innerHTML = `
                                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                </div>
                                            `;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                        <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <div className="text-sm font-bold text-gray-900 truncate">{guests[0].name}</div>
                                <div className="text-xs text-gray-600 truncate">{guests[0].title}</div>
                                {guests[0].institution && (
                                    <div className="text-xs text-gray-500 truncate">{guests[0].institution}</div>
                                )}
                            </div>
                            {/* View More Button */}
                            {guests.length > 1 && (
                                <button
                                    onClick={() => setShowAllGuests(!showAllGuests)}
                                    className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-maroon-700 bg-maroon-50 hover:bg-maroon-100 rounded-md transition-colors flex items-center space-x-1"
                                >
                                    <span>{showAllGuests ? 'Hide' : `+${guests.length - 1}`}</span>
                                    {showAllGuests ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Additional Guests (shown when expanded) - Same vertical line */}
                    {showAllGuests && guests.length > 1 && (
                        <div className="space-y-3 mt-3">
                            {guests.slice(1).map((guest, index) => (
                                <div key={index + 1} className="flex items-start space-x-3">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm ring-2 ring-gray-300">
                                        {guest.image && getImageUrl(guest.image) ? (
                                            <img
                                                src={getImageUrl(guest.image) || ''}
                                                alt={guest.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.parentElement!.innerHTML = `
                                                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="12" cy="7" r="4"></circle>
                                                            </svg>
                                                        </div>
                                                    `;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500">
                                                <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <div className="text-sm font-bold text-gray-900 truncate">{guest.name}</div>
                                        <div className="text-xs text-gray-600 truncate">{guest.title}</div>
                                        {guest.institution && (
                                            <div className="text-xs text-gray-500 truncate">{guest.institution}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Platform Links */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    {/* Watch Now button on left */}
                    {podcast.youtubeUrl ? (
                        <a
                            href={podcast.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1.5 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm"
                        >
                            <Youtube className="w-4 h-4" />
                            <span className="hidden sm:inline">Watch Now</span>
                            <span className="sm:hidden">Watch</span>
                        </a>
                    ) : (
                        <span className="text-xs text-gray-400 font-medium">Coming Soon</span>
                    )}

                    {/* Platform logos on right - responsive sizing */}
                    <div className="flex space-x-1 sm:space-x-1.5">
                        {podcast.spotifyUrl && (
                            <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-gray-200 rounded-lg p-1 sm:p-1.5 hover:scale-110 transition-transform shadow-sm" title="Listen on Spotify">
                                <img src={spotifyLogo} alt="Spotify" className="w-full h-full object-contain" />
                            </a>
                        )}
                        {podcast.applePodcastUrl && (
                            <a href={podcast.applePodcastUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-gray-200 rounded-lg p-1 sm:p-1.5 hover:scale-110 transition-transform shadow-sm" title="Listen on Apple Podcasts">
                                <img src={appleLogo} alt="Apple Podcasts" className="w-full h-full object-contain" />
                            </a>
                        )}
                        {podcast.amazonMusicUrl && (
                            <a href={podcast.amazonMusicUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-gray-200 rounded-lg p-1 sm:p-1.5 hover:scale-110 transition-transform shadow-sm" title="Listen on Amazon Music">
                                <img src={amazonLogo} alt="Amazon Music" className="w-full h-full object-contain" />
                            </a>
                        )}
                        {podcast.audibleUrl && (
                            <a href={podcast.audibleUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-gray-200 rounded-lg p-1 sm:p-1.5 hover:scale-110 transition-transform shadow-sm" title="Listen on Audible">
                                <img src={audibleLogo} alt="Audible" className="w-full h-full object-contain" />
                            </a>
                        )}
                        {podcast.soundcloudUrl && (
                            <a href={podcast.soundcloudUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-9 sm:h-9 bg-white border border-gray-200 rounded-lg p-1 sm:p-1.5 hover:scale-110 transition-transform shadow-sm" title="Listen on SoundCloud">
                                <img src={soundcloudLogo} alt="SoundCloud" className="w-full h-full object-contain" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
