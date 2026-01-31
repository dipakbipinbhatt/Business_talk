import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
    name: string;
    email: string;
    message: string;
    status: 'unread' | 'read' | 'archived';
    createdAt: Date;
    readAt?: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'archived'],
        default: 'unread',
    },
    readAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Index for faster queries
ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ email: 1 });

export default mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
