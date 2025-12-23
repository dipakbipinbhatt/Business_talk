import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { podcastAPI, PodcastInput } from '../../services/api';
import { useAuthStore, usePodcastStore } from '../../store/useStore';

export default function PodcastForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { addPodcast, updatePodcast } = usePodcastStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

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
            scheduledTime: '10:00 AM EST',
            tags: [],
        },
    });

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
                        } else {
                            setValue(key as keyof PodcastInput, podcast[key]);
                        }
                    });

                    if (podcast.guestImage) {
                        setImagePreview(podcast.guestImage);
                    }
                    if (podcast.thumbnailImage) {
                        setThumbnailPreview(podcast.thumbnailImage);
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
        setIsLoading(true);
        try {
            // Process tags if it's a string
            const processedData = {
                ...data,
                tags: typeof data.tags === 'string'
                    ? (data.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
                    : data.tags,
            };

            if (isEditing) {
                const response = await podcastAPI.update(id, processedData);
                updatePodcast(id, response.data.podcast);
            } else {
                const response = await podcastAPI.create(processedData);
                addPodcast(response.data.podcast);
            }

            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error saving podcast:', error);
            alert('Failed to save podcast');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const response = await podcastAPI.uploadImage(file);
            const imageUrl = response.data.imageUrl;
            setValue('guestImage', imageUrl);
            setImagePreview(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
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
                                    Title *
                                </label>
                                <input
                                    {...register('title', { required: 'Title is required' })}
                                    className="input-field"
                                    placeholder="Enter podcast title"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
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
                                    Episode Number *
                                </label>
                                <input
                                    type="number"
                                    {...register('episodeNumber', {
                                        required: 'Episode number is required',
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
                                    Scheduled Date *
                                </label>
                                <input
                                    type="date"
                                    {...register('scheduledDate', { required: 'Date is required' })}
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
                                    placeholder="10:00 AM EST"
                                />
                            </div>
                        </div>

                        {/* Episode Thumbnail */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Episode Thumbnail</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Upload a custom thumbnail for this episode. If not provided, YouTube thumbnail will be used for past episodes.
                            </p>
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
                        </div>

                        {/* Guest Info */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guest Name *
                                    </label>
                                    <input
                                        {...register('guestName', { required: 'Guest name is required' })}
                                        className="input-field"
                                        placeholder="Dr. John Doe"
                                    />
                                    {errors.guestName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.guestName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guest Title *
                                    </label>
                                    <input
                                        {...register('guestTitle', { required: 'Guest title is required' })}
                                        className="input-field"
                                        placeholder="Professor of Marketing"
                                    />
                                    {errors.guestTitle && (
                                        <p className="text-red-500 text-sm mt-1">{errors.guestTitle.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Institution
                                    </label>
                                    <input
                                        {...register('guestInstitution')}
                                        className="input-field"
                                        placeholder="Harvard Business School"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guest Image
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        {imagePreview && (
                                            <div className="relative w-16 h-16">
                                                <img
                                                    src={imagePreview}
                                                    alt="Guest"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setValue('guestImage', '');
                                                    }}
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
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
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
