import mongoose, { Document, Schema } from 'mongoose';

export interface IAboutUs extends Document {
    title: string;
    paragraphs: string[];
    createdAt: Date;
    updatedAt: Date;
}

const aboutUsSchema = new Schema<IAboutUs>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            default: 'About Business Talk',
        },
        paragraphs: {
            type: [String],
            required: true,
            default: [
                'Business Talk is your premier podcast for cutting-edge trends, groundbreaking research, valuable insights from notable books, and engaging discussions from the realms of business and academia.',
                'Whether you\'re an academic scholar, researcher, business professional, or entrepreneur, our episodes will inspire you to question the status quo and spark actionable ideas. Our goal is to deliver valuable research insights from the world\'s renowned scholars, sharing their unique perspectives and expertise.',
            ],
        },
    },
    {
        timestamps: true,
    }
);

export const AboutUs = mongoose.model<IAboutUs>('AboutUs', aboutUsSchema);
