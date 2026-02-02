import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import logoImage from '../assets/logo.jpg';
import StayUpdated from '../components/layout/StayUpdated';
import { aboutUsAPI, AboutUsContent } from '../services/api';

const defaultContent: AboutUsContent = {
    title: 'About Business Talk',
    paragraphs: [
        'Business Talk is your premier podcast for cutting-edge trends, groundbreaking research, valuable insights from notable books, and engaging discussions from the realms of business and academia.',
        'Whether you\'re an academic scholar, researcher, business professional, or entrepreneur, our episodes will inspire you to question the status quo and spark actionable ideas. Our goal is to deliver valuable research insights from the world\'s renowned scholars, sharing their unique perspectives and expertise.',
    ],
};

export default function AboutUs() {
    const [content, setContent] = useState<AboutUsContent>(defaultContent);
    const [isLoading, setIsLoading] = useState(true);

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | About Us";
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await aboutUsAPI.get();
                setContent(response.data);
            } catch (error) {
                console.error('Error loading About Us content:', error);
                // Keep default content on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Matching Podcasts styling */}
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
                            About <span className="text-gold-400">Business Talk</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100"
                    >
                        {/* Profile Section - Logo only */}
                        <div className="flex justify-center mb-6">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="w-32 h-32 object-contain rounded-full shadow-lg"
                                loading="lazy"
                            />
                        </div>

                        {/* Business Talk Description - Dynamic content */}
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {content.paragraphs.map((paragraph, index) => (
                                    <div
                                        key={index}
                                        className="text-gray-700 text-base text-justify prose prose-sm max-w-none"
                                        style={{ lineHeight: '1.75rem' }}
                                        dangerouslySetInnerHTML={{ __html: paragraph }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <StayUpdated />
        </div>
    );
}
