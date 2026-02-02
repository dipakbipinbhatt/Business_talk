import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Loader2,
    FileText,
    Image,
    Tag,
    Eye,
    EyeOff,
    Plus,
} from 'lucide-react';
import { blogAPI, BlogInput, categoryAPI, Category } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BlogForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isAuthenticated } = useAuthStore();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<BlogInput>({
        title: '',
        excerpt: '',
        content: '',
        author: 'Deepak Bhatt',
        category: '',
        image: '',
        readTime: '5 min read',
        tags: [],
        isPublished: false,
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getAll();
            setCategories(response.data);
            if (response.data.length > 0 && !formData.category) {
                setFormData(prev => ({ ...prev, category: response.data[0].name }));
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await categoryAPI.create(newCategory.trim());
            await fetchCategories();
            setFormData(prev => ({ ...prev, category: newCategory.trim() }));
            setNewCategory('');
            setShowAddCategory(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add category');
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }

        if (isEditing && id) {
            fetchBlog(id);
        }
    }, [isAuthenticated, isEditing, id, navigate]);

    const fetchBlog = async (blogId: string) => {
        setIsLoading(true);
        try {
            // Use admin endpoint to fetch any blog including drafts
            const response = await blogAPI.getAdminById(blogId);
            const blog = response.data.blog;
            setFormData({
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                author: blog.author,
                category: blog.category,
                image: blog.image || '',
                readTime: blog.readTime,
                tags: blog.tags || [],
                isPublished: blog.isPublished,
            });
        } catch (err) {
            console.error('Error fetching blog:', err);
            setError('Failed to load blog');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            if (isEditing && id) {
                await blogAPI.update(id, formData);
            } else {
                await blogAPI.create(formData);
            }
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Error saving blog:', err);
            setError(err.response?.data?.message || 'Failed to save blog');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-maroon-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                        </h1>
                    </div>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6"
                >
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-2" />
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                            placeholder="Enter blog title"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Excerpt *
                        </label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            required
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent resize-none"
                            placeholder="Brief summary of the blog post"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content *
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={formData.content}
                            onChange={(value: string) => setFormData(prev => ({ ...prev, content: value }))}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    [{ 'font': ['serif', 'sans-serif', 'monospace', 'arial', 'times-new-roman', 'georgia', 'verdana', 'courier'] }],
                                    [{ 'size': ['small', false, 'large', 'huge'] }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'script': 'sub' }, { 'script': 'super' }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                    [{ 'align': [] }],
                                    ['blockquote', 'code-block'],
                                    ['link', 'image', 'video'],
                                    ['clean']
                                ]
                            }}
                            formats={[
                                'header', 'font', 'size',
                                'bold', 'italic', 'underline', 'strike',
                                'color', 'background',
                                'script',
                                'list', 'bullet', 'indent',
                                'align',
                                'blockquote', 'code-block',
                                'link', 'image', 'video'
                            ]}
                            className="bg-white rounded-lg"
                            style={{ height: '300px', marginBottom: '50px' }}
                            placeholder="Write your blog content here..."
                        />
                    </div>

                    {/* Category and Author */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <div className="flex gap-2">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCategory(!showAddCategory)}
                                    className="px-3 py-2 bg-maroon-100 text-maroon-700 rounded-lg hover:bg-maroon-200 transition-colors"
                                    title="Add new category"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            {showAddCategory && (
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                        placeholder="New category name"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="px-3 py-2 bg-maroon-600 text-white rounded-lg text-sm hover:bg-maroon-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Author
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Image and Read Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Image className="w-4 h-4 inline mr-2" />
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Read Time
                            </label>
                            <input
                                type="text"
                                name="readTime"
                                value={formData.readTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                placeholder="5 min read"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Tag className="w-4 h-4 inline mr-2" />
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                placeholder="Add a tag and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-maroon-100 text-maroon-700 rounded-full text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-maroon-900"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Publish Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <input
                            type="checkbox"
                            id="isPublished"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                            className="w-5 h-5 text-maroon-600 rounded focus:ring-maroon-500"
                        />
                        <label htmlFor="isPublished" className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            {formData.isPublished ? (
                                <>
                                    <Eye className="w-5 h-5 text-green-600" />
                                    Published - visible to everyone
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                    Draft - only visible to admins
                                </>
                            )}
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {isEditing ? 'Update Blog' : 'Create Blog'}
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
