import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

// Same blog data (in production, this would come from an API)
const blogPosts = [
    {
        id: 1,
        title: 'The Future of Business Education: AI and Beyond',
        excerpt: 'Explore how artificial intelligence is transforming the landscape of business education and what it means for future leaders.',
        content: `
            <p>Artificial intelligence is revolutionizing every aspect of our lives, and business education is no exception. As we stand at the cusp of a new era, it's crucial to understand how AI is reshaping the way we teach and learn business concepts.</p>
            
            <h2>The Current State of Business Education</h2>
            <p>Traditional business schools have long relied on case studies, lectures, and group projects to impart knowledge. While these methods remain valuable, they're increasingly being supplemented—and in some cases, transformed—by AI-powered tools.</p>
            
            <h2>AI-Powered Learning Experiences</h2>
            <p>Modern AI systems can personalize learning paths, provide instant feedback on assignments, and even simulate complex business scenarios that would be impossible to replicate in a traditional classroom setting.</p>
            
            <h2>The Role of Human Educators</h2>
            <p>Despite the rise of AI, human educators remain essential. They provide context, emotional intelligence, and the kind of nuanced guidance that machines cannot replicate. The future lies in a hybrid model where AI enhances rather than replaces human instruction.</p>
            
            <h2>Preparing for Tomorrow</h2>
            <p>Business leaders of tomorrow need to be comfortable working alongside AI systems. This means developing skills in data literacy, critical thinking, and adaptability—competencies that will remain valuable regardless of how technology evolves.</p>
        `,
        author: 'Deepak Bhatt',
        date: 'December 20, 2024',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
        readTime: '5 min read',
    },
    {
        id: 2,
        title: 'Leadership Lessons from Top Business School Professors',
        excerpt: 'Key insights on effective leadership gathered from our conversations with distinguished academics.',
        content: `
            <p>Over the years, Business Talk has had the privilege of interviewing some of the world's most renowned business school professors. Here are the key leadership lessons we've learned from these conversations.</p>
            
            <h2>1. Emotional Intelligence Matters</h2>
            <p>Professor after professor has emphasized the importance of emotional intelligence in leadership. The ability to understand and manage your own emotions, and to recognize and influence the emotions of others, is foundational to effective leadership.</p>
            
            <h2>2. Decision-Making Under Uncertainty</h2>
            <p>Great leaders don't wait for perfect information. They develop frameworks for making decisions under uncertainty and learn to be comfortable with ambiguity.</p>
            
            <h2>3. Building and Maintaining Trust</h2>
            <p>Trust is the currency of leadership. It's built slowly through consistent actions and can be destroyed in an instant. The best leaders are intentional about building trust at every opportunity.</p>
            
            <h2>4. Continuous Learning</h2>
            <p>The most effective leaders are perpetual students. They read voraciously, seek feedback actively, and remain curious about the world around them.</p>
        `,
        author: 'Deepak Bhatt',
        date: 'December 15, 2024',
        category: 'Leadership',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
        readTime: '7 min read',
    },
    {
        id: 3,
        title: 'Understanding Digital Transformation in Enterprise',
        excerpt: 'A comprehensive guide to navigating digital transformation challenges in modern enterprises.',
        content: `
            <p>Digital transformation is no longer optional for enterprises—it's a matter of survival. But what does successful digital transformation actually look like?</p>
            
            <h2>Beyond Technology</h2>
            <p>True digital transformation is about more than implementing new technologies. It requires fundamental changes in culture, processes, and business models.</p>
            
            <h2>Common Pitfalls</h2>
            <p>Many digital transformation initiatives fail because organizations focus too heavily on technology and not enough on people and processes. Change management is critical.</p>
            
            <h2>Keys to Success</h2>
            <p>Successful transformations typically share several characteristics: strong executive sponsorship, clear vision, cross-functional collaboration, and a willingness to experiment and iterate.</p>
        `,
        author: 'Deepak Bhatt',
        date: 'December 10, 2024',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
        readTime: '6 min read',
    },
    {
        id: 4,
        title: 'The Psychology of Decision Making in Business',
        excerpt: 'Research-backed insights into how successful leaders make critical business decisions.',
        content: `
            <p>Understanding the psychology behind decision-making can dramatically improve business outcomes. Here's what research tells us about how the best leaders approach complex decisions.</p>
            
            <h2>Cognitive Biases</h2>
            <p>We all have cognitive biases that can lead us astray. Recognizing these biases—confirmation bias, anchoring, availability heuristic—is the first step to overcoming them.</p>
            
            <h2>Deliberate Practice</h2>
            <p>Good decision-making is a skill that can be developed through deliberate practice. This includes reflecting on past decisions, seeking diverse perspectives, and creating structured decision-making processes.</p>
        `,
        author: 'Deepak Bhatt',
        date: 'December 5, 2024',
        category: 'Psychology',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
        readTime: '8 min read',
    },
    {
        id: 5,
        title: 'Sustainable Business Practices for the Modern Era',
        excerpt: 'How companies are integrating sustainability into their core business strategies.',
        content: `
            <p>Sustainability is no longer just a nice-to-have—it's becoming a business imperative. Companies that fail to adapt risk being left behind.</p>
            
            <h2>The Business Case for Sustainability</h2>
            <p>Research increasingly shows that sustainable practices are good for the bottom line. They reduce costs, attract talent, and build customer loyalty.</p>
            
            <h2>Implementation Strategies</h2>
            <p>Successful sustainability initiatives start with clear goals, involve stakeholders at all levels, and integrate with core business strategy rather than existing as separate initiatives.</p>
        `,
        author: 'Deepak Bhatt',
        date: 'November 28, 2024',
        category: 'Sustainability',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200',
        readTime: '5 min read',
    },
    {
        id: 6,
        title: 'Marketing Strategies in the Age of Social Media',
        excerpt: 'Expert perspectives on leveraging social platforms for business growth.',
        content: `
            <p>Social media has fundamentally changed how businesses connect with customers. Here's how to make the most of these platforms.</p>
            
            <h2>Authenticity Wins</h2>
            <p>Consumers can spot inauthenticity from a mile away. The most successful brands on social media are those that develop genuine voices and connect authentically with their audiences.</p>
            
            <h2>Content is Still King</h2>
            <p>While algorithms change constantly, one thing remains true: quality content that provides value to your audience will always perform well.</p>
        `,
        author: 'Deepak Bhatt',
        date: 'November 20, 2024',
        category: 'Marketing',
        image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200',
        readTime: '6 min read',
    },
];

export default function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const post = blogPosts.find(p => p.id === Number(id));

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                    <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image */}
            <div className="relative h-96 md:h-[500px]">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-1 bg-maroon-600 text-white text-sm font-medium rounded-full mb-4">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 heading-serif">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
                    <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{post.date}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{post.readTime}</span>
                    </div>
                    <button className="flex items-center text-maroon-700 hover:text-maroon-800">
                        <Share2 className="w-5 h-5 mr-2" />
                        <span>Share</span>
                    </button>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Back to Blog */}
                <div className="mt-12 pt-8 border-t">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-maroon-700 font-semibold hover:text-maroon-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to All Articles
                    </Link>
                </div>
            </article>
        </div>
    );
}
