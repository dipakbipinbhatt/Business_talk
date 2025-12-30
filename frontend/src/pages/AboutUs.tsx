import { motion } from 'framer-motion';
import logoImage from '../assets/logo.jpg';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Minimal spacing */}
            <section className="relative pt-4 pb-2 px-4 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            About <span className="text-maroon-700">Business Talk</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Main Content - Minimal padding */}
            <section className="py-2 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                    >
                        {/* Profile Section - Logo only */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="w-32 h-32 object-contain rounded-full shadow-lg"
                            />
                        </div>

                        {/* Business Talk Description - Responsive: left on mobile, justify on desktop */}
                        <div>
                            <p className="text-gray-700 leading-relaxed text-base mb-4 text-justify">
                                Business Talk is your premier podcast for cutting-edge trends, groundbreaking research,
                                valuable insights from notable books, and engaging discussions from the realms of
                                business and academia.
                            </p>
                            <p className="text-gray-700 leading-relaxed text-base text-justify">
                                Whether you're an academic scholar, researcher, business professional, or entrepreneur,
                                our episodes will inspire you to question the status quo and spark actionable ideas.
                                Our goal is to deliver valuable research insights from the world's renowned scholars,
                                sharing their unique perspectives and expertise.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
