import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogAPI, Blog as BlogType } from '../services/api';

const categories = ['All', 'Education', 'Leadership', 'Technology', 'Psychology', 'Sustainability', 'Marketing', 'Business'];

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | Blog";
    }, []);

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await blogAPI.getAll({
                    category: activeCategory !== 'All' ? activeCategory : undefined,
                    search: searchTerm || undefined,
                    limit: 50,
                });
                setBlogs(response.data.blogs || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blogs. Please try again later.');
                setBlogs([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(fetchBlogs, 300);
        return () => clearTimeout(timeoutId);
    }, [activeCategory, searchTerm]);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const featuredPost = blogs[0];
    const otherPosts = blogs.slice(1);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Business Talk <span className="text-maroon-700">Blog</span>
                        </h1>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Gain valuable insights and thought leadership from our dialogues with leading academics and research scholars.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-6 px-4 bg-white sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles by title, topic, or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-maroon-500 focus:ring-2 focus:ring-maroon-200 transition-all outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 px-4 border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
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

            {/* Results Count */}
            {(searchTerm || activeCategory !== 'All') && !isLoading && (
                <section className="py-4 px-4 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-gray-600">
                            Showing {blogs.length} article{blogs.length !== 1 ? 's' : ''}
                            {searchTerm && ` for "${searchTerm}"`}
                            {activeCategory !== 'All' && ` in ${activeCategory}`}
                        </p>
                    </div>
                </section>
            )}

            {/* Loading State */}
            {isLoading && (
                <section className="py-20 px-4">
                    <div className="flex justify-center items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
                        <span className="ml-3 text-gray-600">Loading articles...</span>
                    </div>
                </section>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <section className="py-20 px-4">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </section>
            )}

            {/* No Blogs State */}
            {!isLoading && !error && blogs.length === 0 && (
                <section className="py-20 px-4">
                    <div className="text-center">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                        <p className="text-gray-500">
                            {searchTerm
                                ? `No results for "${searchTerm}". Try a different search term.`
                                : 'No articles available in this category yet.'}
                        </p>
                    </div>
                </section>
            )}

            {/* Featured Post */}
            {!isLoading && !error && featuredPost && (
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                        >
                            <div className="grid md:grid-cols-2">
                                <div className="aspect-video md:aspect-auto">
                                    <img
                                        src={featuredPost.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <span className="inline-block px-3 py-1 bg-maroon-100 text-maroon-700 text-sm font-medium rounded-full mb-4 w-fit">
                                        Featured
                                    </span>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 mb-6">
                                        <User className="w-4 h-4 mr-2" />
                                        <span>{featuredPost.author}</span>
                                        <span className="mx-3">•</span>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>{formatDate(featuredPost.createdAt)}</span>
                                        <span className="mx-3">•</span>
                                        <span>{featuredPost.readTime}</span>
                                    </div>
                                    <Link
                                        to={`/blog/${featuredPost._id}`}
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
            )}

            {/* Blog Grid - Title changed to "Latest Insights" */}
            {!isLoading && !error && otherPosts.length > 0 && (
                <section className="py-16 px-4 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                            Latest Insights
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherPosts.map((post, index) => (
                                <Link to={`/blog/${post._id}`} key={post._id}>
                                    <motion.article
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer h-full border border-gray-100"
                                    >
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={post.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'}
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
                                                <span>{formatDate(post.createdAt)}</span>
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter CTA - Updated text */}
            <section className="py-20 px-4 bg-maroon-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Join Our Newsletter
                        </h2>
                        <p className="text-maroon-100 mb-8 text-lg">
                            Join our newsletter to receive fresh insights, new podcast releases, and exclusive updates.
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
        </div>
    );
}
