import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample blog posts data
const blogPosts = [
    {
        id: 1,
        title: 'The Future of Business Education: AI and Beyond',
        excerpt: 'Explore how artificial intelligence is transforming the landscape of business education and what it means for future leaders.',
        author: 'Deepak Bhatt',
        date: 'December 20, 2024',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        readTime: '5 min read',
    },
    {
        id: 2,
        title: 'Leadership Lessons from Top Business School Professors',
        excerpt: 'Key insights on effective leadership gathered from our conversations with distinguished academics.',
        author: 'Deepak Bhatt',
        date: 'December 15, 2024',
        category: 'Leadership',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        readTime: '7 min read',
    },
    {
        id: 3,
        title: 'Understanding Digital Transformation in Enterprise',
        excerpt: 'A comprehensive guide to navigating digital transformation challenges in modern enterprises.',
        author: 'Deepak Bhatt',
        date: 'December 10, 2024',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        readTime: '6 min read',
    },
    {
        id: 4,
        title: 'The Psychology of Decision Making in Business',
        excerpt: 'Research-backed insights into how successful leaders make critical business decisions.',
        author: 'Deepak Bhatt',
        date: 'December 5, 2024',
        category: 'Psychology',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        readTime: '8 min read',
    },
    {
        id: 5,
        title: 'Sustainable Business Practices for the Modern Era',
        excerpt: 'How companies are integrating sustainability into their core business strategies.',
        author: 'Deepak Bhatt',
        date: 'November 28, 2024',
        category: 'Sustainability',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
        readTime: '5 min read',
    },
    {
        id: 6,
        title: 'Marketing Strategies in the Age of Social Media',
        excerpt: 'Expert perspectives on leveraging social platforms for business growth.',
        author: 'Deepak Bhatt',
        date: 'November 20, 2024',
        category: 'Marketing',
        image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800',
        readTime: '6 min read',
    },
];

const categories = ['All', 'Education', 'Leadership', 'Technology', 'Psychology', 'Sustainability', 'Marketing'];

export default function Blog() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/5 to-transparent" />
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 heading-serif">
                            Business Talk <span className="text-maroon-700">Blog</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Insights, analysis, and thought leadership from our conversations with
                            world-class academics and business leaders.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 px-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${index === 0
                                    ? 'bg-maroon-700 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-maroon-50 hover:text-maroon-700'
                                    }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="grid md:grid-cols-2">
                            <div className="aspect-video md:aspect-auto">
                                <img
                                    src={blogPosts[0].image}
                                    alt={blogPosts[0].title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <span className="inline-block px-3 py-1 bg-maroon-100 text-maroon-700 text-sm font-medium rounded-full mb-4 w-fit">
                                    Featured
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4 heading-serif">
                                    {blogPosts[0].title}
                                </h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {blogPosts[0].excerpt}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mb-6">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>{blogPosts[0].author}</span>
                                    <span className="mx-3">•</span>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{blogPosts[0].date}</span>
                                    <span className="mx-3">•</span>
                                    <span>{blogPosts[0].readTime}</span>
                                </div>
                                <Link
                                    to={`/blog/${blogPosts[0].id}`}
                                    className="inline-flex items-center text-maroon-700 font-semibold hover:text-maroon-800 transition-colors group"
                                >
                                    Read Full Article
                                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 heading-serif text-center">
                        Latest Articles
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.slice(1).map((post, index) => (
                            <Link to={`/blog/${post.id}`} key={post.id}>
                                <motion.article
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer h-full"
                                >
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
                                            {post.category}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-maroon-700 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{post.date}</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                </motion.article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 px-4 bg-maroon-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 heading-serif">
                            Stay Updated with Business Talk
                        </h2>
                        <p className="text-maroon-100 mb-8 text-lg">
                            Subscribe to our newsletter for the latest insights, podcast episodes, and exclusive content.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                            />
                            <button className="px-8 py-3 bg-white text-maroon-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* External Links */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 heading-serif">
                        Explore More Content
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://www.youtube.com/@businesstalkwithdeepakbhatt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            YouTube Channel
                        </a>
                        <a
                            href="https://www.deepakbbhatt.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Main Website
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
