import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImage from '../../assets/logo.jpg';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    User,
    LogOut,
    Mic,
    FileText,
    Upload,
} from 'lucide-react';
import { podcastAPI, Podcast } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

export default function AdminCalendar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }
        fetchPodcasts();
    }, [isAuthenticated, navigate]);

    const fetchPodcasts = async () => {
        try {
            // Fetch ALL podcasts (no limit) to show all past and future
            const response = await podcastAPI.getAll({ limit: 1000 });
            setPodcasts(response.data.podcasts);
        } catch (error) {
            console.error('Error fetching podcasts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Calendar helpers
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Get podcasts for a specific date
    const getPodcastsForDate = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return podcasts.filter(podcast => {
            const podcastDate = new Date(podcast.scheduledDate);
            return podcastDate.getDate() === day &&
                podcastDate.getMonth() === month &&
                podcastDate.getFullYear() === year;
        });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    // Create calendar grid
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Mic className="w-5 h-5" />
                        Podcasts
                    </Link>
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <FileText className="w-5 h-5" />
                        Blogs
                    </Link>
                    <div className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-maroon-700 text-white">
                        <CalendarIcon className="w-5 h-5" />
                        Calendar
                    </div>
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
                        <FileText className="w-5 h-5" />
                        About Us
                    </Link>
                </div>
                {isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <CalendarIcon className="w-12 h-12 mx-auto text-maroon-600 animate-pulse" />
                        <p className="mt-4 text-gray-600">Loading calendar...</p>
                    </div>
                ) : (
                    <>
                        {/* Calendar Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-bold text-gray-900">Podcast Calendar</h2>
                                <p className="text-sm text-gray-500">View all {podcasts.length} podcast episodes by date</p>
                            </div>

                            {/* Calendar Content */}
                            <div className="p-6">

                                {/* Calendar Controls */}
                                <div className="flex items-center justify-between mb-6">
                                    <button
                                        onClick={prevMonth}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {formatMonth(currentDate)}
                                        </h2>
                                        <button
                                            onClick={goToToday}
                                            className="px-3 py-1 text-sm bg-maroon-100 text-maroon-700 rounded-full hover:bg-maroon-200 transition-colors"
                                        >
                                            Today
                                        </button>
                                    </div>

                                    <button
                                        onClick={nextMonth}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="border rounded-lg overflow-hidden">
                                    {/* Day Names */}
                                    <div className="grid grid-cols-7 bg-gray-50 border-b">
                                        {dayNames.map(day => (
                                            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar Days */}
                                    <div className="grid grid-cols-7">
                                        {calendarDays.map((day, index) => {
                                            const dayPodcasts = day ? getPodcastsForDate(day) : [];
                                            const isToday = isCurrentMonth && day === today.getDate();

                                            return (
                                                <div
                                                    key={index}
                                                    className={`min-h-[100px] p-2 border-b border-r ${day ? 'bg-white' : 'bg-gray-50'
                                                        } ${isToday ? 'bg-maroon-50' : ''}`}
                                                >
                                                    {day && (
                                                        <>
                                                            <span className={`inline-flex items-center justify-center w-7 h-7 text-sm ${isToday
                                                                ? 'bg-maroon-600 text-white rounded-full font-bold'
                                                                : 'text-gray-700'
                                                                }`}>
                                                                {day}
                                                            </span>

                                                            <div className="mt-1 space-y-1">
                                                                {dayPodcasts.slice(0, 3).map(podcast => {
                                                                    const isPast = new Date(podcast.scheduledDate) < today;
                                                                    return (
                                                                        <button
                                                                            key={podcast._id}
                                                                            onClick={() => setSelectedPodcast(podcast)}
                                                                            className={`w-full text-left px-2 py-1 rounded text-xs truncate ${isPast
                                                                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                                : 'bg-maroon-100 text-maroon-700 hover:bg-maroon-200'
                                                                                }`}
                                                                        >
                                                                            EP {podcast.episodeNumber}
                                                                        </button>
                                                                    );
                                                                })}
                                                                {dayPodcasts.length > 3 && (
                                                                    <span className="text-xs text-gray-500 px-2">
                                                                        +{dayPodcasts.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="mt-6 flex gap-6 justify-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-maroon-100 rounded"></span>
                                        <span className="text-gray-600">Upcoming</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-gray-100 rounded"></span>
                                        <span className="text-gray-600">Past</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Podcast Detail Modal */}
            {selectedPodcast && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedPodcast(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${new Date(selectedPodcast.scheduledDate) < today
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-maroon-100 text-maroon-700'
                                }`}>
                                Episode {selectedPodcast.episodeNumber} - {
                                    new Date(selectedPodcast.scheduledDate) < today ? 'Past' : 'Upcoming'
                                }
                            </span>
                            <button
                                onClick={() => setSelectedPodcast(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {selectedPodcast.title}
                        </h3>

                        <div className="space-y-3 text-gray-600">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{selectedPodcast.guestName} - {selectedPodcast.guestTitle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{new Date(selectedPodcast.scheduledDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{selectedPodcast.scheduledTime}</span>
                            </div>
                        </div>

                        <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                            {selectedPodcast.description}
                        </p>

                        <div className="mt-6 flex gap-3">
                            <Link
                                to={`/admin/podcast/edit/${selectedPodcast._id}`}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-maroon-600 text-white font-semibold rounded-lg hover:bg-maroon-700 transition-colors"
                            >
                                Edit Episode
                            </Link>
                            {selectedPodcast.youtubeUrl && new Date(selectedPodcast.scheduledDate) < today && (
                                <a
                                    href={selectedPodcast.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Watch
                                </a>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

