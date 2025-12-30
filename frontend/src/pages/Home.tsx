import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PodcastCard from '../components/podcast/PodcastCard';
import { podcastAPI, Podcast } from '../services/api';
import { usePodcastStore } from '../store/useStore';
import logoImage from '../assets/logo.jpg';
import { PlatformButton } from '../components/icons/PlatformLogos';

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

                        {/* Platform Buttons - Original SVG Logos */}
                        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-8">
                            <PlatformButton platform="youtube" url={PLATFORM_URLS.youtube} label="YouTube" />
                            <PlatformButton platform="apple" url={PLATFORM_URLS.applePodcasts} label="Apple Podcasts" />
                            <PlatformButton platform="amazon" url={PLATFORM_URLS.amazonMusic} label="Amazon Music" />
                            <PlatformButton platform="audible" url={PLATFORM_URLS.audible} label="Audible" />
                            <PlatformButton platform="spotify" url={PLATFORM_URLS.spotify} label="Spotify" />
                            <PlatformButton platform="soundcloud" url={PLATFORM_URLS.soundcloud} label="SoundCloud" />
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
                                    {allUpcoming.map((podcast: Podcast) => (
                                        <PodcastCard key={podcast._id} podcast={podcast} variant="thumbnail-only" />
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Previous Podcasts Section - Different background with shadow */}
            <section className="py-16 bg-gray-100 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Previous Podcast Episodes
                            </h2>
                            {pastPodcasts.length > 0 && (
                                <Link
                                    to="/podcasts"
                                    className="flex items-center space-x-2 text-maroon-700 hover:text-maroon-800 font-semibold transition-colors group"
                                >
                                    <span>View All</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-lg h-96 animate-pulse"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : top50Past.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No previous podcasts available yet.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {top50Past.map((podcast: Podcast) => (
                                    <PodcastCard key={podcast._id} podcast={podcast} variant="grid" />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Stay Updated Section */}
            <section className="py-16 bg-maroon-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stay Updated with Our Latest Episodes
                        </h2>
                        <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
                            Subscribe to Business Talk on your favorite podcast platform and never miss an episode.
                        </p>
                        <div className="flex flex-wrap justify-center gap-5">
                            <PlatformButton platform="youtube" url={PLATFORM_URLS.youtube} label="YouTube" />
                            <PlatformButton platform="apple" url={PLATFORM_URLS.applePodcasts} label="Apple Podcasts" />
                            <PlatformButton platform="spotify" url={PLATFORM_URLS.spotify} label="Spotify" />
                            <PlatformButton platform="amazon" url={PLATFORM_URLS.amazonMusic} label="Amazon Music" />
                            <PlatformButton platform="audible" url={PLATFORM_URLS.audible} label="Audible" />
                            <PlatformButton platform="soundcloud" url={PLATFORM_URLS.soundcloud} label="SoundCloud" />
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
