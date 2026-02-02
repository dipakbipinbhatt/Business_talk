import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    image: string;
    readTime: string;
    tags: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        author: {
            type: String,
            default: 'Deepak Bhatt',
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        image: {
            type: String,
            default: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        },
        readTime: {
            type: String,
            default: '5 min read',
        },
        tags: {
            type: [String],
            default: [],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
