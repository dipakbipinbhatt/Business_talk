import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { podcastAPI, Podcast } from '../../services/api';
import { useAuthStore, usePodcastStore } from '../../store/useStore';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { podcasts, setPodcasts, removePodcast } = usePodcastStore();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);

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

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleDelete = async (id: string) => {
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
                            <div className="w-10 h-10 bg-maroon-700 rounded-full flex items-center justify-center">
                                <Mic className="w-5 h-5 text-white" />
                            </div>
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
                                                onClick={() => handleDelete(podcast._id)}
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
            </main>
        </div>
    );
}
