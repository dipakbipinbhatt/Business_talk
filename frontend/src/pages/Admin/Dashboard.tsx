import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImage from '../../assets/logo.jpg';
import {
    Mic,
    Plus,
    Edit,
    Trash2,
    LogOut,
    BarChart3,
    Calendar,
    Clock,
    Loader2,
    FileText,
    Eye,
    EyeOff,
    Upload,
    Info,
} from 'lucide-react';
import { podcastAPI, blogAPI, Blog } from '../../services/api';
import { useAuthStore, usePodcastStore } from '../../store/useStore';

type ActiveTab = 'podcasts' | 'blogs';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { podcasts, setPodcasts, removePodcast } = usePodcastStore();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
    const [blogStats, setBlogStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('podcasts');
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [blogsLoading, setBlogsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [podcastsRes, statsRes] = await Promise.all([
                    podcastAPI.getAll(),
                    podcastAPI.getStats(),
                ]);
                setPodcasts(podcastsRes.data.podcasts);
                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate, setPodcasts]);

    useEffect(() => {
        if (activeTab === 'blogs' && blogs.length === 0) {
            fetchBlogs();
        }
    }, [activeTab]);

    const fetchBlogs = async () => {
        setBlogsLoading(true);
        try {
            const [blogsRes, statsRes] = await Promise.all([
                blogAPI.getAdminAll(),
                blogAPI.getStats(),
            ]);
            setBlogs(blogsRes.data.blogs || []);
            setBlogStats(statsRes.data.stats || { total: 0, published: 0, drafts: 0 });
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setBlogsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleDeletePodcast = async (id: string) => {
        if (!confirm('Are you sure you want to delete this podcast?')) return;

        setDeleteId(id);
        try {
            await podcastAPI.delete(id);
            removePodcast(id);
            setStats((prev) => ({
                ...prev,
                total: prev.total - 1,
                [podcasts.find((p) => p._id === id)?.category || 'past']:
                    prev[podcasts.find((p) => p._id === id)?.category === 'upcoming' ? 'upcoming' : 'past'] - 1,
            }));
        } catch (error) {
            console.error('Error deleting podcast:', error);
            alert('Failed to delete podcast');
        } finally {
            setDeleteId(null);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        setDeleteId(id);
        try {
            await blogAPI.delete(id);
            setBlogs((prev) => prev.filter((b) => b._id !== id));
            setBlogStats((prev) => ({
                ...prev,
                total: prev.total - 1,
            }));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        } finally {
            setDeleteId(null);
        }
    };

    const filteredPodcasts = podcasts.filter((podcast) => {
        if (filter === 'all') return true;
        return podcast.category === filter;
    });

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="h-10 w-auto"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Business+Talk&size=200&background=8B1538&color=fff&bold=true'; }}
                            />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                View Site
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('podcasts')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'podcasts'
                            ? 'bg-maroon-700 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Mic className="w-5 h-5" />
                        Podcasts
                    </button>
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'blogs'
                            ? 'bg-maroon-700 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        Blogs
                    </button>
                    <Link
                        to="/admin/calendar"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Calendar className="w-5 h-5" />
                        Calendar
                    </Link>
                    <Link
                        to="/admin/import"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Upload className="w-5 h-5" />
                        Import
                    </Link>
                    <Link
                        to="/admin/about"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                        title="Manage About Us Content"
                    >
                        <Info className="w-5 h-5" />
                        About Us
                    </Link>
                </div>

                {/* Podcasts Tab */}
                {activeTab === 'podcasts' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Episodes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Upcoming</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Published</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.past}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Podcasts Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">All Podcasts</h2>
                                    <p className="text-sm text-gray-500">Manage your podcast episodes</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Filter */}
                                    <div className="flex items-center space-x-2">
                                        {(['all', 'upcoming', 'past'] as const).map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === f
                                                    ? 'bg-maroon-700 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <Link
                                        to="/admin/podcast/new"
                                        className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Podcast</span>
                                    </Link>
                                </div>
                            </div>

                            {/* List */}
                            <div className="divide-y">
                                {isLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading podcasts...</p>
                                    </div>
                                ) : filteredPodcasts.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-gray-500">No podcasts found.</p>
                                        <Link
                                            to="/admin/podcast/new"
                                            className="inline-flex items-center space-x-2 mt-4 text-maroon-700 hover:text-maroon-800"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Create your first podcast</span>
                                        </Link>
                                    </div>
                                ) : (
                                    filteredPodcasts.map((podcast) => (
                                        <motion.div
                                            key={podcast._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-sm font-bold text-maroon-700">
                                                            #{podcast.episodeNumber}
                                                        </span>
                                                        <span
                                                            className={`badge ${podcast.category === 'upcoming'
                                                                ? 'badge-upcoming'
                                                                : 'badge-past'
                                                                }`}
                                                        >
                                                            {podcast.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {podcast.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        Guest: {podcast.guestName} • {podcast.guestTitle}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {formatDate(podcast.scheduledDate)} • {podcast.scheduledTime}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/admin/podcast/edit/${podcast._id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeletePodcast(podcast._id)}
                                                        disabled={deleteId === podcast._id}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteId === podcast._id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Blogs Tab */}
                {activeTab === 'blogs' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Blogs</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.total}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Published</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.published}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                        <EyeOff className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Drafts</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.drafts}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Blogs Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">All Blogs</h2>
                                    <p className="text-sm text-gray-500">Manage your blog posts</p>
                                </div>
                                <Link
                                    to="/admin/blog/new"
                                    className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Blog</span>
                                </Link>
                            </div>

                            {/* List */}
                            <div className="divide-y">
                                {blogsLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading blogs...</p>
                                    </div>
                                ) : blogs.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-gray-500">No blogs found.</p>
                                        <Link
                                            to="/admin/blog/new"
                                            className="inline-flex items-center space-x-2 mt-4 text-maroon-700 hover:text-maroon-800"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Create your first blog post</span>
                                        </Link>
                                    </div>
                                ) : (
                                    blogs.map((blog) => (
                                        <motion.div
                                            key={blog._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                            {blog.category}
                                                        </span>
                                                        {blog.isPublished ? (
                                                            <span className="flex items-center gap-1 text-xs text-green-600">
                                                                <Eye className="w-3 h-3" /> Published
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-xs text-yellow-600">
                                                                <EyeOff className="w-3 h-3" /> Draft
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                                                        {blog.excerpt}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        By {blog.author} • {formatDate(blog.createdAt)} • {blog.readTime}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/admin/blog/edit/${blog._id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                        disabled={deleteId === blog._id}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteId === blog._id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
