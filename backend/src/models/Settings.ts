import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
    key: string;
    // Episode Loading Settings
    upcomingInitialLoad: number;
    upcomingBatchSize: number;
    pastInitialLoad: number;
    pastBatchSize: number;
    googleAnalyticsId?: string;
    // Timestamps
    updatedAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: 'site-settings',
        },
        upcomingInitialLoad: {
            type: Number,
            default: 4,
            min: 1,
            max: 50,
        },
        upcomingBatchSize: {
            type: Number,
            default: 4,
            min: 1,
            max: 50,
        },
        pastInitialLoad: {
            type: Number,
            default: 4,
            min: 1,
            max: 50,
        },
        pastBatchSize: {
            type: Number,
            default: 6,
            min: 1,
            max: 50,
        },
        googleAnalyticsId: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne({ key: 'site-settings' });
    if (!settings) {
        settings = await this.create({ key: 'site-settings' });
    }
    return settings;
};

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
