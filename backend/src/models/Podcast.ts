import mongoose, { Document, Schema } from 'mongoose';

export interface IGuest {
    name: string;
    title: string;
    institution?: string;
    image?: string;
}

export interface IPodcast extends Document {
    title: string;
    description: string;
    category: 'upcoming' | 'past';
    // Legacy single guest fields (kept for backward compatibility)
    guestName?: string;
    guestTitle?: string;
    guestInstitution?: string;
    guestImage?: string;
    // New multi-guest support
    guests: IGuest[];
    episodeNumber: number;
    scheduledDate: Date;
    scheduledTime: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastUrl?: string;
    amazonMusicUrl?: string;
    audibleUrl?: string;
    soundcloudUrl?: string;
    thumbnailImage?: string;
    tags: string[];
    isRescheduled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const guestSchema = new Schema<IGuest>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    institution: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
    },
}, { _id: false });

const podcastSchema = new Schema<IPodcast>(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            enum: ['upcoming', 'past'],
            required: [true, 'Category is required'],
        },
        // Legacy single guest fields (optional for backward compatibility)
        guestName: {
            type: String,
            trim: true,
        },
        guestTitle: {
            type: String,
            trim: true,
        },
        guestInstitution: {
            type: String,
            trim: true,
            default: '',
        },
        guestImage: {
            type: String,
            default: '',
        },
        // New multi-guest support
        guests: {
            type: [guestSchema],
            default: [],
        },
        episodeNumber: {
            type: Number,
        },
        scheduledDate: {
            type: Date,
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
        audibleUrl: {
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

// Custom validation based on category
podcastSchema.pre('save', function (next) {
    if (this.category === 'upcoming') {
        // For upcoming: Only thumbnail is mandatory
        if (!this.thumbnailImage) {
            return next(new Error('Thumbnail is required for upcoming podcasts'));
        }
    } else if (this.category === 'past') {
        // For past: All fields are mandatory
        if (!this.title) return next(new Error('Title is required for past podcasts'));
        if (!this.description) return next(new Error('Description is required for past podcasts'));
        if (!this.episodeNumber) return next(new Error('Episode number is required for past podcasts'));
        if (!this.scheduledDate) return next(new Error('Scheduled date is required for past podcasts'));

        // Check if either legacy guest or new guests array has data
        const hasLegacyGuest = this.guestName && this.guestTitle;
        const hasNewGuests = this.guests && this.guests.length > 0;

        if (!hasLegacyGuest && !hasNewGuests) {
            return next(new Error('At least one guest is required for past podcasts'));
        }
    }
    next();
});

// Index for efficient querying and sorting
podcastSchema.index({ category: 1, createdAt: -1 });  // Compound index for category filtering + sort
podcastSchema.index({ createdAt: -1 });  // Index for sorting by creation date
podcastSchema.index({ episodeNumber: 1 });

export const Podcast = mongoose.model<IPodcast>('Podcast', podcastSchema);
