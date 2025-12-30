import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { podcastAPI, Podcast } from '../services/api';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPodcasts();
    }, []);

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <CalendarIcon className="w-12 h-12 mx-auto text-maroon-600 animate-pulse" />
                    <p className="mt-4 text-gray-600">Loading calendar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-maroon-600" />
                        Podcast Calendar
                    </h1>
                    <p className="text-gray-600 mt-2">View all upcoming and previous podcast episodes by date</p>
                </motion.div>

                {/* Calendar Controls */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
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
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                                                {dayPodcasts.slice(0, 2).map(podcast => {
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
                                                {dayPodcasts.length > 2 && (
                                                    <span className="text-xs text-gray-500 px-2">
                                                        +{dayPodcasts.length - 2} more
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
                <div className="mt-4 flex gap-6 justify-center text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-maroon-100 rounded"></span>
                        <span className="text-gray-600">Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 bg-gray-100 rounded"></span>
                        <span className="text-gray-600">Past</span>
                    </div>
                </div>

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
                                    className="text-gray-400 hover:text-gray-600"
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

                            {/* Only show Watch button for PAST episodes with YouTube URL */}
                            {selectedPodcast.youtubeUrl && new Date(selectedPodcast.scheduledDate) < today && (
                                <a
                                    href={selectedPodcast.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    Watch on YouTube
                                </a>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
