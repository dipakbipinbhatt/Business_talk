import { Request, Response } from 'express';
import { Blog } from '../models/Blog';

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
        console.log('📝 Creating new blog with data:', JSON.stringify(req.body, null, 2));
        const { title, excerpt, content, author, category, image, readTime, tags, isPublished } = req.body;

        // Validate required fields
        if (!title || title.trim() === '') {
            console.error('❌ Validation failed: Title is required');
            return res.status(400).json({ message: 'Title is required and cannot be empty' });
        }

        if (!excerpt || excerpt.trim() === '') {
            console.error('❌ Validation failed: Excerpt is required');
            return res.status(400).json({ message: 'Excerpt is required and cannot be empty' });
        }

        if (!content || content.trim() === '') {
            console.error('❌ Validation failed: Content is required');
            return res.status(400).json({ message: 'Content is required and cannot be empty' });
        }

        if (!category || category.trim() === '') {
            console.error('❌ Validation failed: Category is required');
            return res.status(400).json({ message: 'Category is required and cannot be empty' });
        }

        const blog = new Blog({
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            author: author?.trim() || 'Deepak Bhatt',
            category: category.trim(),
            image: image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
            readTime: readTime || '5 min read',
            tags: Array.isArray(tags) ? tags : [],
            isPublished: isPublished || false,
        });

        await blog.save();
        console.log('✅ Blog created successfully:', blog._id);

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error: any) {
        console.error('❌ Error creating blog:', error);
        console.error('Error stack:', error.stack);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                message: 'Validation failed',
                errors: messages,
                details: error.message
            });
        }

        res.status(500).json({
            message: 'Failed to create blog',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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

// Sample blogs data for seeding
const sampleBlogs = [
    {
        title: 'The Future of Business Education: AI and Beyond',
        excerpt: 'Explore how artificial intelligence is transforming the landscape of business education and what it means for future leaders.',
        content: `<p>Artificial intelligence is revolutionizing every aspect of our lives, and business education is no exception. As we stand at the cusp of a new era, it's crucial to understand how AI is reshaping the way we teach and learn business concepts.</p>
            
<h2>The Current State of Business Education</h2>
<p>Traditional business schools have long relied on case studies, lectures, and group projects to impart knowledge. While these methods remain valuable, they're increasingly being supplemented—and in some cases, transformed—by AI-powered tools.</p>

<h2>AI-Powered Learning Experiences</h2>
<p>Modern AI systems can personalize learning paths, provide instant feedback on assignments, and even simulate complex business scenarios that would be impossible to replicate in a traditional classroom setting.</p>

<h2>The Role of Human Educators</h2>
<p>Despite the rise of AI, human educators remain essential. They provide context, emotional intelligence, and the kind of nuanced guidance that machines cannot replicate. The future lies in a hybrid model where AI enhances rather than replaces human instruction.</p>

<h2>Preparing for Tomorrow</h2>
<p>Business leaders of tomorrow need to be comfortable working alongside AI systems. This means developing skills in data literacy, critical thinking, and adaptability—competencies that will remain valuable regardless of how technology evolves.</p>`,
        author: 'Deepak Bhatt',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        readTime: '5 min read',
        tags: ['AI', 'Education', 'Business', 'Technology'],
        isPublished: true,
    },
    {
        title: 'Leadership Lessons from Top Business School Professors',
        excerpt: 'Key insights on effective leadership gathered from our conversations with distinguished academics.',
        content: `<p>Over the years, Business Talk has had the privilege of interviewing some of the world's most renowned business school professors. Here are the key leadership lessons we've learned from these conversations.</p>

<h2>1. Emotional Intelligence Matters</h2>
<p>Professor after professor has emphasized the importance of emotional intelligence in leadership. The ability to understand and manage your own emotions, and to recognize and influence the emotions of others, is foundational to effective leadership.</p>

<h2>2. Decision-Making Under Uncertainty</h2>
<p>Great leaders don't wait for perfect information. They develop frameworks for making decisions under uncertainty and learn to be comfortable with ambiguity.</p>

<h2>3. Building and Maintaining Trust</h2>
<p>Trust is the currency of leadership. It's built slowly through consistent actions and can be destroyed in an instant. The best leaders are intentional about building trust at every opportunity.</p>

<h2>4. Continuous Learning</h2>
<p>The most effective leaders are perpetual students. They read voraciously, seek feedback actively, and remain curious about the world around them.</p>`,
        author: 'Deepak Bhatt',
        category: 'Leadership',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        readTime: '7 min read',
        tags: ['Leadership', 'Management', 'Business Education'],
        isPublished: true,
    },
    {
        title: 'Understanding Digital Transformation in Enterprise',
        excerpt: 'A comprehensive guide to navigating digital transformation challenges in modern enterprises.',
        content: `<p>Digital transformation is no longer optional for enterprises—it's a matter of survival. But what does successful digital transformation actually look like?</p>

<h2>Beyond Technology</h2>
<p>True digital transformation is about more than implementing new technologies. It requires fundamental changes in culture, processes, and business models.</p>

<h2>Common Pitfalls</h2>
<p>Many digital transformation initiatives fail because organizations focus too heavily on technology and not enough on people and processes. Change management is critical.</p>

<h2>Keys to Success</h2>
<p>Successful transformations typically share several characteristics: strong executive sponsorship, clear vision, cross-functional collaboration, and a willingness to experiment and iterate.</p>

<h2>The Role of Data</h2>
<p>Data is the fuel that powers digital transformation. Organizations must develop robust data strategies that enable them to collect, analyze, and act on insights in real-time.</p>

<h2>Building a Digital Culture</h2>
<p>Perhaps the most challenging aspect of digital transformation is cultural change. Leaders must foster a mindset of innovation, experimentation, and continuous improvement throughout the organization.</p>`,
        author: 'Deepak Bhatt',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        readTime: '6 min read',
        tags: ['Digital Transformation', 'Technology', 'Enterprise'],
        isPublished: true,
    },
    {
        title: 'The Psychology of Decision Making in Business',
        excerpt: 'Research-backed insights into how successful leaders make critical business decisions.',
        content: `<p>Understanding the psychology behind decision-making can dramatically improve business outcomes. Here's what research tells us about how the best leaders approach complex decisions.</p>

<h2>Cognitive Biases</h2>
<p>We all have cognitive biases that can lead us astray. Recognizing these biases—confirmation bias, anchoring, availability heuristic—is the first step to overcoming them.</p>

<h2>Deliberate Practice</h2>
<p>Good decision-making is a skill that can be developed through deliberate practice. This includes reflecting on past decisions, seeking diverse perspectives, and creating structured decision-making processes.</p>

<h2>The Power of Intuition</h2>
<p>While data-driven decision making is important, experienced leaders also know when to trust their gut. Intuition, when properly calibrated through experience, can be a powerful decision-making tool.</p>

<h2>Group Decision Making</h2>
<p>Many important decisions are made by groups rather than individuals. Understanding group dynamics and how to facilitate effective group decision-making is essential for leaders.</p>

<h2>Decision Fatigue</h2>
<p>Research shows that the quality of our decisions deteriorates as we make more of them. Successful leaders protect their decision-making capacity by establishing routines and delegating less critical decisions.</p>`,
        author: 'Deepak Bhatt',
        category: 'Psychology',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        readTime: '8 min read',
        tags: ['Psychology', 'Decision Making', 'Leadership'],
        isPublished: true,
    },
    {
        title: 'Sustainable Business Practices for the Modern Era',
        excerpt: 'How companies are integrating sustainability into their core business strategies.',
        content: `<p>Sustainability is no longer just a nice-to-have—it's becoming a business imperative. Companies that fail to adapt risk being left behind.</p>

<h2>The Business Case for Sustainability</h2>
<p>Research increasingly shows that sustainable practices are good for the bottom line. They reduce costs, attract talent, and build customer loyalty.</p>

<h2>Implementation Strategies</h2>
<p>Successful sustainability initiatives start with clear goals, involve stakeholders at all levels, and integrate with core business strategy rather than existing as separate initiatives.</p>

<h2>Measuring Impact</h2>
<p>What gets measured gets managed. Leading companies are developing sophisticated frameworks for measuring and reporting on their environmental and social impact.</p>

<h2>Supply Chain Sustainability</h2>
<p>For many companies, the biggest sustainability challenges lie in their supply chains. Addressing these requires collaboration with suppliers and sometimes fundamental changes to sourcing strategies.</p>

<h2>The Future of Sustainable Business</h2>
<p>As consumer preferences shift and regulations tighten, sustainability will become even more central to business strategy. Companies that lead on sustainability today will be best positioned for success tomorrow.</p>`,
        author: 'Deepak Bhatt',
        category: 'Sustainability',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
        readTime: '5 min read',
        tags: ['Sustainability', 'Business Strategy', 'Environment'],
        isPublished: true,
    },
    {
        title: 'Marketing Strategies in the Age of Social Media',
        excerpt: 'Expert perspectives on leveraging social platforms for business growth.',
        content: `<p>Social media has fundamentally changed how businesses connect with customers. Here's how to make the most of these platforms.</p>

<h2>Authenticity Wins</h2>
<p>Consumers can spot inauthenticity from a mile away. The most successful brands on social media are those that develop genuine voices and connect authentically with their audiences.</p>

<h2>Content is Still King</h2>
<p>While algorithms change constantly, one thing remains true: quality content that provides value to your audience will always perform well.</p>

<h2>The Rise of Video</h2>
<p>Video content continues to dominate social media. From short-form content on TikTok to longer YouTube videos, businesses need to develop strong video capabilities.</p>

<h2>Community Building</h2>
<p>The most successful brands don't just broadcast messages—they build communities. This means engaging with followers, responding to comments, and fostering connections between community members.</p>

<h2>Measuring ROI</h2>
<p>Social media marketing requires clear metrics and regular analysis. The most sophisticated marketers track not just engagement but actual business outcomes tied to their social efforts.</p>`,
        author: 'Deepak Bhatt',
        category: 'Marketing',
        image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800',
        readTime: '6 min read',
        tags: ['Marketing', 'Social Media', 'Digital Marketing'],
        isPublished: true,
    },
];

// Seed sample blogs (admin only)
export const seedBlogs = async (req: Request, res: Response) => {
    try {
        console.log('🌱 Starting blog seeding...');

        let addedCount = 0;
        const results: string[] = [];

        for (const blogData of sampleBlogs) {
            // Check if blog with same title already exists
            const exists = await Blog.findOne({ title: blogData.title });
            if (exists) {
                results.push(`⏭️ Skipped: "${blogData.title}" - already exists`);
                continue;
            }

            const blog = new Blog(blogData);
            await blog.save();
            results.push(`✅ Added: "${blogData.title}"`);
            addedCount++;
        }

        const totalCount = await Blog.countDocuments();
        const publishedCount = await Blog.countDocuments({ isPublished: true });

        console.log(`🎉 Seeding complete! Added ${addedCount} new blogs`);

        res.json({
            message: `Successfully seeded ${addedCount} new blogs`,
            results,
            stats: {
                total: totalCount,
                published: publishedCount,
                added: addedCount,
            },
        });
    } catch (error: any) {
        console.error('❌ Error seeding blogs:', error);
        res.status(500).json({ message: 'Failed to seed blogs', error: error.message });
    }
};