import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PodcastCard from '../components/podcast/PodcastCard';
import { podcastAPI, Podcast } from '../services/api';
import { usePodcastStore } from '../store/useStore';
import logoImage from '../assets/logo.jpg';

// Platform URLs
const PLATFORM_URLS = {
    youtube: 'https://www.youtube.com/@businesstalkwithdeepakbhatt',
    applePodcasts: 'https://podcasts.apple.com/us/podcast/business-talk/id1596076450',
    amazonMusic: 'https://music.amazon.in/podcasts/1803c906-ea83-406b-82c6-fcacd13873af/business-talk',
    audible: 'https://www.audible.in/podcast/Business-Talk/B0DC5NTGMS?qid=1723093390&sr=1-1',
    spotify: 'https://open.spotify.com/show/3IB2aXm9eZkLiSVaUZEQuK?si=M_9QZ3AlSC65B9HIMYXbmg',
    soundcloud: 'https://soundcloud.com/business_talk',
};

export default function Home() {
    const { upcomingPodcasts, pastPodcasts, setPodcasts, setLoading, isLoading } = usePodcastStore();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPodcasts = async () => {
            setLoading(true);
            try {
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
    }, [setPodcasts, setLoading]);

    // Get all upcoming podcasts and top 50 past podcasts
    const allUpcoming = upcomingPodcasts;
    const top50Past = pastPodcasts.slice(0, 50);

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

                        {/* Welcome text - dark black headers */}
                        <p className="text-base text-gray-800 max-w-4xl mx-auto mb-6 leading-relaxed text-justify">
                            Welcome to Business Talk, your premier podcast for cutting-edge trends,
                            groundbreaking research, valuable insights from notable books, and engaging
                            discussions from the realms of business and academia. Whether you're an academic scholar, researcher,
                            business professional, or entrepreneur, our episodes will inspire you to question the status quo and
                            spark actionable ideas. Our goal is to deliver valuable research insights from the world's renowned scholars,
                            sharing their unique perspectives and expertise.
                        </p>

                        <p className="text-base text-gray-800 max-w-4xl mx-auto mb-6 leading-relaxed text-justify">
                            <strong className="text-gray-900">How do we select our speakers?:</strong> The Business Talk committee identifies speakers after a meticulous screening process. These
                            experts are then invited. That is, participation as a speaker is by invitation only. We remain committed to delivering free, high-quality content to our research community and are dedicated to maintaining this model in the future.
                        </p>

                        <p className="text-base text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed text-justify">
                            Brought to you by <a href="https://www.globalmanagementconsultancy.com/" target="_blank" rel="noopener noreferrer" className="text-maroon-700 hover:underline font-medium">Global Management Consultancy</a>,
                            we are committed to driving innovation and excellence in the business community. The podcast recordings are available in both video and audio formats on this webpage.
                            Simply click on the respective channel icons and immerse yourself in the world of learning!
                        </p>

                        {/* Platform Icons - Order: YouTube, Apple Podcasts, Amazon Music, Audible, Spotify, SoundCloud */}
                        <div className="flex flex-wrap justify-center gap-5 max-w-5xl mx-auto">
                            <a
                                href={PLATFORM_URLS.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-6 py-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span className="font-semibold text-base">YouTube</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.applePodcasts}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-6 py-3.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 5.455c-1.8 0-3.273 1.472-3.273 3.272S10.2 12 12 12s3.273-1.473 3.273-3.273S13.8 5.455 12 5.455zm0 7.636c-.9 0-1.636.737-1.636 1.637v3.817c0 .9.736 1.637 1.636 1.637s1.636-.737 1.636-1.637v-3.817c0-.9-.736-1.637-1.636-1.637z"/>
                                </svg>
                                <span className="font-semibold text-base">Apple Podcasts</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.amazonMusic}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-6 py-3.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.439-2.186 1.439-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.684zm3.186 7.705a.66.66 0 01-.753.076c-1.057-.878-1.247-1.286-1.827-2.124-1.747 1.782-2.983 2.315-5.244 2.315-2.676 0-4.76-1.651-4.76-4.957 0-2.58 1.396-4.337 3.383-5.193 1.722-.753 4.128-.89 5.967-1.097v-.409c0-.753.057-1.642-.384-2.292-.385-.577-1.125-.816-1.775-.816-1.206 0-2.281.618-2.544 1.899-.054.285-.262.566-.549.58l-3.072-.331c-.259-.057-.546-.266-.472-.66C5.97 1.391 9.259 0 12.188 0c1.5 0 3.458.398 4.64 1.534 1.5 1.397 1.356 3.26 1.356 5.291v4.792c0 1.441.6 2.076 1.163 2.856.2.277.244.61-.011.813-.639.536-1.778 1.533-2.405 2.09l.013-.581zM21.779 20.553C19.39 22.327 15.86 23.254 12.797 23.254c-4.333 0-8.236-1.602-11.19-4.267-.231-.209-.024-.495.254-.333 3.188 1.854 7.127 2.97 11.2 2.97 2.746 0 5.764-.568 8.543-1.746.42-.179.77.274.375.675zm1.072-1.219c-.314-.404-2.085-.19-2.88-.095-.241.028-.278-.182-.061-.336 1.411-.99 3.725-.704 3.994-.373.27.333-.071 2.64-1.394 3.742-.204.17-.398.08-.307-.145.298-.745.965-2.399.648-2.793z" />
                                </svg>
                                <span className="font-semibold text-base">Amazon Music</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.audible}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-6 py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.232 16.8c-.48.384-1.152.288-1.536-.192-.24-.24-.384-.576-.384-.912 0-.24.048-.48.192-.672.72-.96 1.104-2.112 1.104-3.36 0-2.976-2.352-5.376-5.28-5.472h-.528c-2.928.096-5.28 2.496-5.28 5.472 0 1.248.384 2.4 1.104 3.36.144.192.192.432.192.672 0 .336-.144.672-.384.912-.384.48-1.056.576-1.536.192C3.72 15.072 2.976 13.344 2.976 11.52c0-4.992 4.032-9.024 9.024-9.024s9.024 4.032 9.024 9.024c0 1.824-.744 3.552-1.792 5.28z" />
                                </svg>
                                <span className="font-semibold text-base">Audible</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-6 py-3.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.44 1.56.42.24.599.84.301 1.261zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                <span className="font-semibold text-base">Spotify</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.soundcloud}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-6 py-3.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.084-.1zm-.899 1.065c-.051 0-.094.037-.106.094l-.154 1.189.154 1.143c.012.057.055.094.106.094s.092-.037.106-.094l.209-1.143-.21-1.189c-.013-.057-.055-.094-.105-.094zm1.79-.756c-.067 0-.12.047-.12.119l-.209 2.021.209 1.973c0 .072.053.119.12.119.069 0 .124-.047.124-.119l.234-1.973-.234-2.021c0-.072-.055-.119-.124-.119zm.915-.451c-.084 0-.149.057-.149.134l-.191 2.127.191 2.07c0 .079.065.136.149.136.084 0 .151-.057.151-.136l.216-2.07-.216-2.127c0-.077-.067-.134-.151-.134zm.949-.27c-.094 0-.169.069-.169.156l-.176 2.208.176 2.126c0 .089.075.157.169.157.096 0 .171-.068.171-.157l.2-2.126-.2-2.208c0-.087-.075-.156-.171-.156zm.977-.222c-.109 0-.196.078-.196.173l-.161 2.274.161 2.156c0 .095.087.175.196.175.108 0 .194-.08.194-.175l.185-2.156-.185-2.274c0-.095-.086-.173-.194-.173zm1.016-.138c-.123 0-.221.089-.221.199l-.145 2.313.145 2.189c0 .108.098.2.221.2.123 0 .218-.092.218-.2l.168-2.189-.168-2.313c0-.11-.095-.199-.218-.199zm5.818 1.028c-.21 0-.406.031-.59.089-.122-1.381-1.289-2.462-2.711-2.462-.35 0-.689.066-1.003.186-.119.046-.15.093-.15.186v4.871c0 .097.076.178.171.186h4.283c.997 0 1.811-.814 1.811-1.818s-.814-1.838-1.811-1.838zm-4.798-.625c-.136 0-.238.101-.238.215l-.13 2.423.13 2.23c0 .116.102.215.238.215.133 0 .236-.099.236-.215l.148-2.23-.148-2.423c0-.114-.103-.215-.236-.215zm-1.023.149c-.121 0-.217.09-.217.204l-.143 2.285.143 2.205c0 .114.096.205.217.205.122 0 .219-.091.219-.205l.164-2.205-.164-2.285c0-.114-.097-.204-.219-.204z" />
                                </svg>
                                <span className="font-semibold text-base">SoundCloud</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Upcoming Podcasts Section - High-res images only */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Upcoming Podcast Episodes
                            </h2>
                            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full text-sm">
                                {upcomingPodcasts.length} Scheduled
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : allUpcoming.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No upcoming podcasts scheduled. Check back soon!</p>
                            </div>
                        ) : (
                            <>
                                {/* Display 2 cards per row */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {allUpcoming.map((podcast: Podcast) => {
                                        // Check if image is valid - prioritize thumbnailImage for upcoming podcasts
                                        const hasThumbnail = podcast.thumbnailImage &&
                                            (podcast.thumbnailImage.startsWith('http') || podcast.thumbnailImage.startsWith('data:'));
                                        const hasValidImage = podcast.guestImage &&
                                            (podcast.guestImage.startsWith('http') || podcast.guestImage.startsWith('data:'));
                                        const imageUrl = hasThumbnail ? podcast.thumbnailImage : (hasValidImage ? podcast.guestImage : null);

                                        return (
                                            <motion.div
                                                key={podcast._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-maroon-800 to-maroon-900"
                                            >
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={podcast.guestName}
                                                        className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            // On error, hide the image and show fallback
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-72 flex items-center justify-center bg-gradient-to-br from-maroon-700 to-maroon-900">
                                                        <div className="text-center text-white">
                                                            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                                                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                                    <line x1="12" y1="19" x2="12" y2="22" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-lg font-semibold">Coming Soon</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                                <div className="absolute top-3 left-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">
                                                    UPCOMING
                                                </div>
                                                <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/80 text-white text-xs font-bold rounded">
                                                    EP #{podcast.episodeNumber}
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                                    <p className="text-sm text-green-400 mb-2 font-medium">
                                                        {new Date(podcast.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                        {podcast.scheduledTime && ` • ${podcast.scheduledTime}`}
                                                    </p>
                                                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{podcast.guestName}</h3>
                                                    <p className="text-gray-300 text-sm line-clamp-1">{podcast.guestTitle}</p>
                                                    {podcast.guestInstitution && (
                                                        <p className="text-gray-400 text-xs mt-1 line-clamp-1">{podcast.guestInstitution}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Past Podcasts Section - 3 per row, 50 episodes */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Episode Highlights: Best of Our Previous Podcasts
                            </h2>
                            {pastPodcasts.length > 50 && (
                                <Link
                                    to="/podcasts"
                                    className="hidden md:flex items-center text-maroon-700 hover:text-maroon-800 font-medium transition-colors"
                                >
                                    View All Episodes <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            )}
                        </div>
                        <p className="text-gray-700 mb-12 text-lg">
                            Explore our archive of insightful conversations with academic scholars across diverse research disciplines.
                        </p>

                        {isLoading ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : top50Past.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No past podcasts available yet.</p>
                            </div>
                        ) : (
                            <>
                                {/* 2 per row grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {top50Past.map((podcast, index) => (
                                        <motion.div
                                            key={podcast._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                        >
                                            <PodcastCard podcast={podcast} variant="grid" />
                                        </motion.div>
                                    ))}
                                </div>
                                {pastPodcasts.length > 50 && (
                                    <div className="text-center mt-8">
                                        <Link
                                            to="/podcasts"
                                            className="inline-flex items-center px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                        >
                                            View All Episodes <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Stay Updated Section */}
            <section className="py-16 bg-gradient-to-r from-maroon-700 to-maroon-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Stay Updated with Every New Episode
                    </h2>
                    <p className="text-maroon-100 mb-8">
                        Stay informed with the latest insights - subscribe to Business Talk on your preferred listening platform.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={PLATFORM_URLS.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span>Subscribe on YouTube</span>
                        </a>
                        <a
                            href={PLATFORM_URLS.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.44 1.56.42.24.599.84.301 1.261zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            <span>Listen on Spotify</span>
                        </a>
                        <a
                            href={PLATFORM_URLS.applePodcasts}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 5.455c-1.8 0-3.273 1.472-3.273 3.272S10.2 12 12 12s3.273-1.473 3.273-3.273S13.8 5.455 12 5.455zm0 7.636c-.9 0-1.636.737-1.636 1.637v3.817c0 .9.736 1.637 1.636 1.637s1.636-.737 1.636-1.637v-3.817c0-.9-.736-1.637-1.636-1.637z"/>
                            </svg>
                            <span>Listen on Apple Podcasts</span>
                        </a>
                        <a
                            href={PLATFORM_URLS.amazonMusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.439-2.186 1.439-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.684zm3.186 7.705a.66.66 0 01-.753.076c-1.057-.878-1.247-1.286-1.827-2.124-1.747 1.782-2.983 2.315-5.244 2.315-2.676 0-4.76-1.651-4.76-4.957 0-2.58 1.396-4.337 3.383-5.193 1.722-.753 4.128-.89 5.967-1.097v-.409c0-.753.057-1.642-.384-2.292-.385-.577-1.125-.816-1.775-.816-1.206 0-2.281.618-2.544 1.899-.054.285-.262.566-.549.58l-3.072-.331c-.259-.057-.546-.266-.472-.66C5.97 1.391 9.259 0 12.188 0c1.5 0 3.458.398 4.64 1.534 1.5 1.397 1.356 3.26 1.356 5.291v4.792c0 1.441.6 2.076 1.163 2.856.2.277.244.61-.011.813-.639.536-1.778 1.533-2.405 2.09l.013-.581zM21.779 20.553C19.39 22.327 15.86 23.254 12.797 23.254c-4.333 0-8.236-1.602-11.19-4.267-.231-.209-.024-.495.254-.333 3.188 1.854 7.127 2.97 11.2 2.97 2.746 0 5.764-.568 8.543-1.746.42-.179.77.274.375.675zm1.072-1.219c-.314-.404-2.085-.19-2.88-.095-.241.028-.278-.182-.061-.336 1.411-.99 3.725-.704 3.994-.373.27.333-.071 2.64-1.394 3.742-.204.17-.398.08-.307-.145.298-.745.965-2.399.648-2.793z" />
                            </svg>
                            <span>Listen on Amazon Music</span>
                        </a>
                        <a
                            href={PLATFORM_URLS.audible}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.232 16.8c-.48.384-1.152.288-1.536-.192-.24-.24-.384-.576-.384-.912 0-.24.048-.48.192-.672.72-.96 1.104-2.112 1.104-3.36 0-2.976-2.352-5.376-5.28-5.472h-.528c-2.928.096-5.28 2.496-5.28 5.472 0 1.248.384 2.4 1.104 3.36.144.192.192.432.192.672 0 .336-.144.672-.384.912-.384.48-1.056.576-1.536.192C3.72 15.072 2.976 13.344 2.976 11.52c0-4.992 4.032-9.024 9.024-9.024s9.024 4.032 9.024 9.024c0 1.824-.744 3.552-1.792 5.28z" />
                            </svg>
                            <span>Listen on Audible</span>
                        </a>
                        <a
                            href={PLATFORM_URLS.soundcloud}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.084-.1zm-.899 1.065c-.051 0-.094.037-.106.094l-.154 1.189.154 1.143c.012.057.055.094.106.094s.092-.037.106-.094l.209-1.143-.21-1.189c-.013-.057-.055-.094-.105-.094zm1.79-.756c-.067 0-.12.047-.12.119l-.209 2.021.209 1.973c0 .072.053.119.12.119.069 0 .124-.047.124-.119l.234-1.973-.234-2.021c0-.072-.055-.119-.124-.119zm.915-.451c-.084 0-.149.057-.149.134l-.191 2.127.191 2.07c0 .079.065.136.149.136.084 0 .151-.057.151-.136l.216-2.07-.216-2.127c0-.077-.067-.134-.151-.134zm.949-.27c-.094 0-.169.069-.169.156l-.176 2.208.176 2.126c0 .089.075.157.169.157.096 0 .171-.068.171-.157l.2-2.126-.2-2.208c0-.087-.075-.156-.171-.156zm.977-.222c-.109 0-.196.078-.196.173l-.161 2.274.161 2.156c0 .095.087.175.196.175.108 0 .194-.08.194-.175l.185-2.156-.185-2.274c0-.095-.086-.173-.194-.173zm1.016-.138c-.123 0-.221.089-.221.199l-.145 2.313.145 2.189c0 .108.098.2.221.2.123 0 .218-.092.218-.2l.168-2.189-.168-2.313c0-.11-.095-.199-.218-.199zm5.818 1.028c-.21 0-.406.031-.59.089-.122-1.381-1.289-2.462-2.711-2.462-.35 0-.689.066-1.003.186-.119.046-.15.093-.15.186v4.871c0 .097.076.178.171.186h4.283c.997 0 1.811-.814 1.811-1.818s-.814-1.838-1.811-1.838zm-4.798-.625c-.136 0-.238.101-.238.215l-.13 2.423.13 2.23c0 .116.102.215.238.215.133 0 .236-.099.236-.215l.148-2.23-.148-2.423c0-.114-.103-.215-.236-.215zm-1.023.149c-.121 0-.217.09-.217.204l-.143 2.285.143 2.205c0 .114.096.205.217.205.122 0 .219-.091.219-.205l.164-2.205-.164-2.285c0-.114-.097-.204-.219-.204z" />
                            </svg>
                            <span>Listen on SoundCloud</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
