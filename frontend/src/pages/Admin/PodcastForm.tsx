import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { podcastAPI, PodcastInput } from '../../services/api';
import { useAuthStore, usePodcastStore } from '../../store/useStore';

interface Guest {
    name: string;
    title: string;
    institution?: string;
    image?: string;
}

export default function PodcastForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { addPodcast, updatePodcast } = usePodcastStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [guests, setGuests] = useState<Guest[]>([{ name: '', title: '', institution: '', image: '' }]);
    const [category, setCategory] = useState<'upcoming' | 'past'>('upcoming');

    const isEditing = !!id;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PodcastInput>({
        defaultValues: {
            category: 'upcoming',
            scheduledTime: '10:00 AM IST',
            tags: [],
        },
    });

    // Watch category field
    const watchedCategory = watch('category');

    useEffect(() => {
        if (watchedCategory) {
            setCategory(watchedCategory as 'upcoming' | 'past');
        }
    }, [watchedCategory]);

    // Guest management functions
    const addGuest = () => {
        setGuests([...guests, { name: '', title: '', institution: '', image: '' }]);
    };

    const removeGuest = (index: number) => {
        if (guests.length > 1) {
            setGuests(guests.filter((_, i) => i !== index));
        }
    };

    const updateGuest = (index: number, field: keyof Guest, value: string) => {
        const updatedGuests = [...guests];
        updatedGuests[index] = { ...updatedGuests[index], [field]: value };
        setGuests(updatedGuests);
    };

    const handleGuestImageUpload = async (index: number, file: File) => {
        try {
            const response = await podcastAPI.uploadImage(file);
            const imageUrl = response.data.imageUrl;
            updateGuest(index, 'image', imageUrl);
        } catch (error) {
            console.error('Error uploading guest image:', error);
            alert('Failed to upload guest image');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }

        if (isEditing) {
            const fetchPodcast = async () => {
                setIsFetching(true);
                try {
                    const response = await podcastAPI.getById(id);
                    const podcast = response.data;

                    // Set form values
                    Object.keys(podcast).forEach((key) => {
                        if (key === 'scheduledDate') {
                            setValue(key as keyof PodcastInput, podcast[key].split('T')[0]);
                        } else if (key === 'tags') {
                            setValue(key, podcast[key].join(', '));
                        } else if (key !== 'guests') {
                            setValue(key as keyof PodcastInput, podcast[key]);
                        }
                    });

                    // Handle guests - prioritize new guests array, fallback to legacy fields
                    if (podcast.guests && podcast.guests.length > 0) {
                        setGuests(podcast.guests);
                    } else if (podcast.guestName && podcast.guestTitle) {
                        // Convert legacy single guest to array
                        setGuests([{
                            name: podcast.guestName,
                            title: podcast.guestTitle,
                            institution: podcast.guestInstitution || '',
                            image: podcast.guestImage || '',
                        }]);
                    }

                    if (podcast.thumbnailImage) {
                        setThumbnailPreview(podcast.thumbnailImage);
                    }
                    if (podcast.category) {
                        setCategory(podcast.category);
                    }
                } catch (error) {
                    console.error('Error fetching podcast:', error);
                    alert('Failed to load podcast');
                    navigate('/admin/dashboard');
                } finally {
                    setIsFetching(false);
                }
            };

            fetchPodcast();
        }
    }, [isAuthenticated, isEditing, id, navigate, setValue]);

    const onSubmit = async (data: PodcastInput) => {
        // Validate based on category
        if (data.category === 'upcoming') {
            if (!thumbnailPreview && !data.thumbnailImage) {
                alert('Thumbnail is required for upcoming podcasts');
                return;
            }
        } else if (data.category === 'past') {
            // Validate all required fields for past podcasts
            if (!data.title) {
                alert('Title is required for past podcasts');
                return;
            }
            if (!data.description) {
                alert('Description is required for past podcasts');
                return;
            }
            if (!data.episodeNumber) {
                alert('Episode number is required for past podcasts');
                return;
            }
            if (!data.scheduledDate) {
                alert('Scheduled date is required for past podcasts');
                return;
            }
            // Check if at least one guest has name and title
            const hasValidGuest = guests.some(g => g.name && g.title);
            if (!hasValidGuest) {
                alert('At least one guest with name and title is required for past podcasts');
                return;
            }

            // Warn if no thumbnail is provided (will fall back to guest image or YouTube thumbnail)
            if (!thumbnailPreview && !data.thumbnailImage) {
                const confirmProceed = window.confirm(
                    '⚠️ Warning: No episode thumbnail uploaded.\n\n' +
                    'The podcast card will show the guest headshot or YouTube thumbnail as fallback.\n\n' +
                    'Are you sure you want to proceed without uploading a promotional thumbnail?'
                );
                if (!confirmProceed) return;
            }
        }

        setIsLoading(true);
        try {
            // Filter out empty guests
            const validGuests = guests.filter(g => g.name && g.title);

            // Process tags if it's a string
            const processedData = {
                ...data,
                tags: typeof data.tags === 'string'
                    ? (data.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
                    : data.tags,
                guests: validGuests,
                // Maintain backward compatibility - use first guest for legacy fields
                guestName: validGuests[0]?.name || '',
                guestTitle: validGuests[0]?.title || '',
                guestInstitution: validGuests[0]?.institution || '',
                guestImage: validGuests[0]?.image || '',
            };

            if (isEditing) {
                const response = await podcastAPI.update(id, processedData);
                updatePodcast(id, response.data.podcast);
            } else {
                const response = await podcastAPI.create(processedData);
                addPodcast(response.data.podcast);
            }

            navigate('/admin/dashboard');
        } catch (error: any) {
            console.error('Error saving podcast:', error);
            alert(error.response?.data?.message || 'Failed to save podcast');
        } finally {
            setIsLoading(false);
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const response = await podcastAPI.uploadImage(file);
            const imageUrl = response.data.imageUrl;
            setValue('thumbnailImage', imageUrl);
            setThumbnailPreview(imageUrl);
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            alert('Failed to upload thumbnail');
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Dashboard</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        {isEditing ? 'Edit Podcast' : 'Create New Podcast'}
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title {category === 'past' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    {...register('title')}
                                    className="input-field"
                                    placeholder="Enter podcast title"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description {category === 'past' && <span className="text-red-500">*</span>}
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className="input-field"
                                    placeholder="Enter podcast description"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="input-field"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Episode Number {category === 'past' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="number"
                                    {...register('episodeNumber', {
                                        valueAsNumber: true,
                                    })}
                                    className="input-field"
                                    placeholder="e.g., 310"
                                />
                                {errors.episodeNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.episodeNumber.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scheduled Date {category === 'past' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="date"
                                    {...register('scheduledDate')}
                                    className="input-field"
                                />
                                {errors.scheduledDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.scheduledDate.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scheduled Time
                                </label>
                                <input
                                    {...register('scheduledTime')}
                                    className="input-field"
                                    placeholder="10:00 AM IST"
                                />
                            </div>
                        </div>

                        {/* Episode Thumbnail */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Episode Thumbnail (Promotional Image) {category === 'upcoming' && <span className="text-red-500">*</span>}
                            </h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800 font-medium">
                                    ℹ️ This is the MAIN image shown on podcast cards throughout the website.
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Upload your creative/promotional thumbnail here (NOT the guest headshot).
                                </p>
                            </div>
                            {category === 'upcoming' && (
                                <p className="text-sm text-red-600 font-medium mb-4">
                                    ⚠️ Thumbnail is REQUIRED for upcoming podcasts
                                </p>
                            )}
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    {thumbnailPreview && (
                                        <div className="relative w-48 h-28">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Episode Thumbnail"
                                                className="w-full h-full object-cover rounded-lg shadow-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setThumbnailPreview(null);
                                                    setValue('thumbnailImage', '');
                                                }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <label className="cursor-pointer px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 transition-colors bg-gray-50">
                                        <div className="flex flex-col items-center space-y-2 text-gray-600">
                                            <Upload className="w-6 h-6" />
                                            <span className="text-sm font-medium">Upload Thumbnail</span>
                                            <span className="text-xs text-gray-400">Recommended: 1280x720 (16:9)</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {/* URL Input for Thumbnail */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Or paste Image URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        className="input-field"
                                        onChange={(e) => {
                                            const url = e.target.value.trim();
                                            if (url) {
                                                setValue('thumbnailImage', url);
                                                setThumbnailPreview(url);
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Tip: Use a direct image link (ending in .jpg, .png, etc.) from any public source
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Guest Info - Multi-guest Support */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Guest Information {category === 'past' && <span className="text-red-500">*</span>}
                                </h2>
                                <button
                                    type="button"
                                    onClick={addGuest}
                                    className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Guest</span>
                                </button>
                            </div>

                            {category === 'upcoming' && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Guest information is optional for upcoming podcasts
                                </p>
                            )}
                            {category === 'past' && (
                                <p className="text-sm text-gray-500 mb-4">
                                    At least one guest with name and title is required for past podcasts
                                </p>
                            )}

                            <div className="space-y-6">
                                {guests.map((guest, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-md font-semibold text-gray-800">
                                                Guest {index + 1}{index === 0 && <span className="text-maroon-700 ml-2 text-sm">(Main Guest)</span>}
                                            </h3>
                                            {guests.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeGuest(index)}
                                                    className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Remove</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Name {category === 'past' && <span className="text-red-500">*</span>}
                                                </label>
                                                <input
                                                    value={guest.name}
                                                    onChange={(e) => updateGuest(index, 'name', e.target.value)}
                                                    className="input-field"
                                                    placeholder="Dr. John Doe"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Title {category === 'past' && <span className="text-red-500">*</span>}
                                                </label>
                                                <input
                                                    value={guest.title}
                                                    onChange={(e) => updateGuest(index, 'title', e.target.value)}
                                                    className="input-field"
                                                    placeholder="Professor of Marketing"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Institution
                                                </label>
                                                <input
                                                    value={guest.institution || ''}
                                                    onChange={(e) => updateGuest(index, 'institution', e.target.value)}
                                                    className="input-field"
                                                    placeholder="Harvard Business School"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Guest Headshot (Profile Photo)
                                                </label>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Upload the guest's profile photo/headshot here. This appears in the guest info section, NOT as the main podcast card image.
                                                </p>
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-4">
                                                        {guest.image && (
                                                            <div className="relative w-16 h-16">
                                                                <img
                                                                    src={guest.image}
                                                                    alt={`Guest ${index + 1}`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateGuest(index, 'image', '')}
                                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        <label className="cursor-pointer px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 transition-colors">
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Upload className="w-4 h-4" />
                                                                <span className="text-sm">Upload Image</span>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleGuestImageUpload(index, file);
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="url"
                                                            value={guest.image || ''}
                                                            placeholder="Or paste image URL: https://example.com/guest.jpg"
                                                            className="input-field"
                                                            onChange={(e) => {
                                                                const url = e.target.value.trim();
                                                                updateGuest(index, 'image', url);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        YouTube URL
                                    </label>
                                    <input
                                        {...register('youtubeUrl')}
                                        className="input-field"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Spotify URL
                                    </label>
                                    <input
                                        {...register('spotifyUrl')}
                                        className="input-field"
                                        placeholder="https://open.spotify.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Apple Podcasts URL
                                    </label>
                                    <input
                                        {...register('applePodcastUrl')}
                                        className="input-field"
                                        placeholder="https://podcasts.apple.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amazon Music URL
                                    </label>
                                    <input
                                        {...register('amazonMusicUrl')}
                                        className="input-field"
                                        placeholder="https://music.amazon.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Audible URL
                                    </label>
                                    <input
                                        {...register('audibleUrl')}
                                        className="input-field"
                                        placeholder="https://www.audible.in/podcast/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SoundCloud URL
                                    </label>
                                    <input
                                        {...register('soundcloudUrl')}
                                        className="input-field"
                                        placeholder="https://soundcloud.com/business_talk/..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                {...register('tags')}
                                className="input-field"
                                placeholder="marketing, research, business"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                            <Link
                                to="/admin/dashboard"
                                className="px-6 py-3 text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary flex items-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>{isEditing ? 'Update Podcast' : 'Create Podcast'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
