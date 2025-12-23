import mongoose, { Document, Schema } from 'mongoose';

export interface IPodcast extends Document {
    title: string;
    description: string;
    category: 'upcoming' | 'past';
    guestName: string;
    guestTitle: string;
    guestInstitution: string;
    guestImage: string;
    episodeNumber: number;
    scheduledDate: Date;
    scheduledTime: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastUrl?: string;
    amazonMusicUrl?: string;
    soundcloudUrl?: string;
    thumbnailImage?: string;
    tags: string[];
    isRescheduled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const podcastSchema = new Schema<IPodcast>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        category: {
            type: String,
            enum: ['upcoming', 'past'],
            required: [true, 'Category is required'],
        },
        guestName: {
            type: String,
            required: [true, 'Guest name is required'],
            trim: true,
        },
        guestTitle: {
            type: String,
            required: [true, 'Guest title is required'],
            trim: true,
        },
        guestInstitution: {
            type: String,
            trim: true,
            default: '',
        },
        guestImage: {
            type: String,
            default: '/default-avatar.png',
        },
        episodeNumber: {
            type: Number,
            required: [true, 'Episode number is required'],
        },
        scheduledDate: {
            type: Date,
            required: [true, 'Scheduled date is required'],
        },
        scheduledTime: {
            type: String,
            default: '10:00 AM EST',
        },
        youtubeUrl: {
            type: String,
            trim: true,
        },
        spotifyUrl: {
            type: String,
            trim: true,
        },
        applePodcastUrl: {
            type: String,
            trim: true,
        },
        amazonMusicUrl: {
            type: String,
            trim: true,
        },
        soundcloudUrl: {
            type: String,
            trim: true,
        },
        thumbnailImage: {
            type: String,
        },
        tags: {
            type: [String],
            default: [],
        },
        isRescheduled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
podcastSchema.index({ category: 1, scheduledDate: -1 });
podcastSchema.index({ episodeNumber: 1 });

export const Podcast = mongoose.model<IPodcast>('Podcast', podcastSchema);
