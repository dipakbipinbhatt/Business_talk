import mongoose, { Document, Schema } from 'mongoose';

export interface IPodcastType extends Document {
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const podcastTypeSchema = new Schema<IPodcastType>(
    {
        name: {
            type: String,
            required: [true, 'Podcast Type is required'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug from name before saving
podcastTypeSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    next();
});

export const PodcastType = mongoose.model<IPodcastType>('PodcastType', podcastTypeSchema);
