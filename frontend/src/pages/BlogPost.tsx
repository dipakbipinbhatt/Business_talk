import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Loader2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { blogAPI, Blog } from '../services/api';

export default function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            
            setIsLoading(true);
            setError(null);
            try {
                const response = await blogAPI.getById(id);
                setPost(response.data.blog);
            } catch (err: any) {
                console.error('Error fetching blog:', err);
                if (err.response?.status === 404) {
                    setError('Blog post not found');
                } else {
                    setError('Failed to load blog post. Please try again later.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showShareMenu && !target.closest('.relative')) {
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showShareMenu]);

    // Set page title based on blog post
    useEffect(() => {
        if (post) {
            document.title = `Business Talk | ${post.title}`;
        } else {
            document.title = "Business Talk | Blog";
        }
    }, [post]);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Share functions
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post?.title || 'Business Talk Blog';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShowShareMenu(false);
        }, 2000);
    };

    const handleShareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        setShowShareMenu(false);
    };

    const handleShareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
        setShowShareMenu(false);
    };

    const handleShareLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        setShowShareMenu(false);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
                <span className="ml-3 text-gray-600">Loading article...</span>
            </div>
        );
    }

    // Error or not found state
    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {error === 'Blog post not found' ? 'Post Not Found' : 'Error'}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {error || "The blog post you're looking for doesn't exist."}
                    </p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image */}
            {/* <div className="relative h-96 md:h-[350px]"> */}
            <div className="relative py-5 md:py-12">
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-900 to-red-900" />
                {/* <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16"> */}
                <div className="relative p-8 md:p-16">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-1 bg-maroon-600 text-white text-sm font-medium rounded-full mb-4">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 heading-serif">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
                    <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{post.readTime}</span>
                    </div>
                    
                    {/* Share Button with Dropdown */}
                    <div className="relative">
                        <button 
                            className="flex items-center text-maroon-700 hover:text-maroon-800 transition-colors"
                            onClick={() => setShowShareMenu(!showShareMenu)}
                        >
                            <Share2 className="w-5 h-5 mr-2" />
                            <span>Share</span>
                        </button>

                        {/* Share Dropdown Menu */}
                        {showShareMenu && (
                            <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-10">
                                <button
                                    onClick={handleShareFacebook}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                    <span>Facebook</span>
                                </button>
                                <button
                                    onClick={handleShareTwitter}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 hover:text-blue-400 transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
                                    <span>Twitter</span>
                                </button>
                                <button
                                    onClick={handleShareLinkedIn}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 hover:text-blue-700 transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    <span>LinkedIn</span>
                                </button>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 hover:text-maroon-700 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5 text-green-600" />
                                            <span className="text-green-600">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon className="w-5 h-5" />
                                            <span>Copy Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xl text-gray-60 italic border-l-4 border-maroon-700 pl-4">
                        {post.excerpt}
                    </p>
                )}

                <img
                    src={post.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200'}
                    alt={post.title}
                    className="w-[850px] h-[550px] py-12 object-cover"
                />                

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-maroon-700"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                        <h4 className="text-sm font-semibold text-gray-500 mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Blog */}
                <div className="mt-12 pt-8 border-t">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-maroon-700 font-semibold hover:text-maroon-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to All Articles
                    </Link>
                </div>
            </article>
        </div>
    );
}
