import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Headphones } from 'lucide-react';
import PodcastCard from '../components/podcast/PodcastCard';
import { podcastAPI, Podcast } from '../services/api';
import { usePodcastStore } from '../store/useStore';

export default function Home() {
    const { upcomingPodcasts, pastPodcasts, setPodcasts, setLoading, isLoading } = usePodcastStore();
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-gradient py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-4">
                            <img
                                src="https://static.wixstatic.com/media/70d1c9_f0f4073d229d4e559e4cc6cea217ea88~mv2.png/v1/fill/w_200,h_202,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Trademarked%20Logo.png"
                                alt="Business Talk Logo"
                                className="w-24 h-24 object-contain"
                            />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold heading-serif text-maroon-700 mb-4">
                            Business Talk
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
                            Welcome to Business Talk, your premier podcast for cutting-edge trends,
                            groundbreaking research, valuable insights from notable books, and engaging
                            discussions from the realms of business and academia.
                        </p>
                        <p className="text-gray-500 max-w-2xl mx-auto mb-8">
                            Whether you're an academic scholar, researcher, business professional, or
                            entrepreneur, our episodes will inspire you to question the status quo and
                            spark actionable ideas. Our goal is to deliver valuable research insights
                            from the world's renowned scholars.
                        </p>

                        {/* Platform Icons */}
                        <div className="flex justify-center space-x-4">
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                                <span className="text-sm font-medium">YouTube</span>
                            </a>
                            <a
                                href="https://spotify.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                            >
                                <Headphones className="w-5 h-5" />
                                <span className="text-sm font-medium">Spotify</span>
                            </a>
                        </div>

                        <p className="text-sm text-gray-400 mt-6">
                            Brought to you by{' '}
                            <a href="https://www.globalmanagementconsultancy.com/" className="text-maroon-600 hover:underline">
                                Global Management Consultancy
                            </a>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider"></div>

            {/* Upcoming Podcasts Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold heading-serif text-maroon-700 text-center mb-4">
                            Upcoming Podcast Episodes
                        </h2>
                        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                            Join us for these exciting upcoming conversations with world-renowned scholars and thought leaders.
                        </p>

                        {isLoading ? (
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-gray-100 rounded-2xl h-64 skeleton"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : upcomingPodcasts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No upcoming podcasts scheduled. Check back soon!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {upcomingPodcasts.map((podcast) => (
                                    <PodcastCard key={podcast._id} podcast={podcast} variant="featured" />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Past Podcasts Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold heading-serif text-maroon-700 text-center mb-4">
                            Episode Highlights: Best of Our Previous Podcasts
                        </h2>
                        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                            Explore our archive of insightful conversations with leaders in business, academia, and research.
                        </p>

                        {isLoading ? (
                            <div className="podcast-grid">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-200 rounded-xl h-80 skeleton"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600">{error}</p>
                            </div>
                        ) : pastPodcasts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No past podcasts available yet.</p>
                            </div>
                        ) : (
                            <div className="podcast-grid">
                                {pastPodcasts.map((podcast, index) => (
                                    <motion.div
                                        key={podcast._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <PodcastCard podcast={podcast} variant="grid" />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-maroon-700 to-maroon-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Never Miss an Episode
                    </h2>
                    <p className="text-maroon-100 mb-8">
                        Subscribe to Business Talk on your favorite platform and stay updated with the latest insights.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-white text-maroon-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Subscribe on YouTube
                        </a>
                        <a
                            href="https://spotify.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Listen on Spotify
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
