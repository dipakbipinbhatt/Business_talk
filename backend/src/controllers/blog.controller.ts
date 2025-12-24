import { Request, Response } from 'express';
import { Blog } from '../models/Blog.js';

// Get all blogs (public - only published)
export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        const query: any = {};

        // Only show published blogs for public access
        query.isPublished = true;

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Blog.countDocuments(query);

        res.json({
            blogs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
};

// Get all blogs for admin (including unpublished)
export const getAdminBlogs = async (req: Request, res: Response) => {
    try {
        console.log('📋 Fetching all blogs for admin...');
        const blogs = await Blog.find().sort({ createdAt: -1 });
        console.log(`📊 Found ${blogs.length} blogs`);
        res.json({ blogs });
    } catch (error) {
        console.error('Error fetching admin blogs:', error);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
};

// Get single blog by ID (public - only published)
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if id looks like a MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid blog ID format' });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Public route - only return published blogs
        if (!blog.isPublished) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
};

// Get single blog by ID for admin (any blog including drafts)
export const getAdminBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('📋 Admin fetching blog:', id);

        // Check if id looks like a MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid blog ID format' });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        console.log('✅ Blog found:', blog.title);
        res.json({ blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
};

// Create new blog (admin only)
export const createBlog = async (req: Request, res: Response) => {
    try {
        console.log('📝 Creating new blog:', req.body.title);
        const { title, excerpt, content, author, category, image, readTime, tags, isPublished } = req.body;

        const blog = new Blog({
            title,
            excerpt,
            content,
            author: author || 'Deepak Bhatt',
            category,
            image: image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
            readTime: readTime || '5 min read',
            tags: tags || [],
            isPublished: isPublished || false,
        });

        await blog.save();
        console.log('✅ Blog created successfully:', blog._id);

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error: any) {
        console.error('❌ Error creating blog:', error.message);
        res.status(500).json({ message: 'Failed to create blog', error: error.message });
    }
};

// Update blog (admin only)
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log('📝 Updating blog:', id, updateData);

        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        console.log('✅ Blog updated successfully:', blog._id);
        res.json({ message: 'Blog updated successfully', blog });
    } catch (error: any) {
        console.error('❌ Error updating blog:', error.message);
        res.status(500).json({ message: 'Failed to update blog', error: error.message });
    }
};

// Delete blog (admin only)
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('🗑️ Deleting blog:', id);

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        console.log('✅ Blog deleted successfully');
        res.json({ message: 'Blog deleted successfully' });
    } catch (error: any) {
        console.error('❌ Error deleting blog:', error.message);
        res.status(500).json({ message: 'Failed to delete blog', error: error.message });
    }
};

// Get blog stats (admin only)
export const getBlogStats = async (req: Request, res: Response) => {
    try {
        console.log('📊 Fetching blog stats...');
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ isPublished: true });
        const draftBlogs = await Blog.countDocuments({ isPublished: false });

        const categories = await Blog.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        console.log(`📊 Stats: ${totalBlogs} total, ${publishedBlogs} published, ${draftBlogs} drafts`);

        res.json({
            stats: {
                total: totalBlogs,
                published: publishedBlogs,
                drafts: draftBlogs,
                categories,
            },
        });
    } catch (error) {
        console.error('Error fetching blog stats:', error);
        res.status(500).json({ message: 'Failed to fetch blog stats' });
    }
};
