import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2, Info, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/useStore';
import logoImage from '../../assets/logo.jpg';

// Store About Us content in localStorage for simplicity (could be moved to backend later)
const ABOUT_STORAGE_KEY = 'businessTalk_aboutContent';

interface AboutContent {
    title: string;
    paragraphs: string[];
}

const defaultContent: AboutContent = {
    title: 'About Business Talk',
    paragraphs: [
        'Business Talk is your premier podcast for cutting-edge trends, groundbreaking research, valuable insights from notable books, and engaging discussions from the realms of business and academia.',
        'Whether you\'re an academic scholar, researcher, business professional, or entrepreneur, our episodes will inspire you to question the status quo and spark actionable ideas. Our goal is to deliver valuable research insights from the world\'s renowned scholars, sharing their unique perspectives and expertise.',
    ],
};

export default function AboutEditor() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [content, setContent] = useState<AboutContent>(defaultContent);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }

        // Load saved content from localStorage
        const saved = localStorage.getItem(ABOUT_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Handle old format with description1/description2
                if (parsed.description1) {
                    setContent({
                        title: parsed.title || defaultContent.title,
                        paragraphs: [parsed.description1, parsed.description2].filter(Boolean),
                    });
                } else {
                    setContent(parsed);
                }
            } catch (e) {
                console.error('Error loading saved content:', e);
            }
        }
    }, [isAuthenticated, navigate]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveSuccess(false);

        try {
            // Save to localStorage
            localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(content));

            // Simulate save delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const addParagraph = () => {
        setContent(prev => ({
            ...prev,
            paragraphs: [...prev.paragraphs, ''],
        }));
    };

    const removeParagraph = (index: number) => {
        if (content.paragraphs.length <= 1) return;
        setContent(prev => ({
            ...prev,
            paragraphs: prev.paragraphs.filter((_, i) => i !== index),
        }));
    };

    const updateParagraph = (index: number, value: string) => {
        setContent(prev => ({
            ...prev,
            paragraphs: prev.paragraphs.map((p, i) => (i === index ? value : p)),
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="h-10 w-auto"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Business+Talk&size=200&background=8B1538&color=fff&bold=true'; }}
                            />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Edit About Us Page</h1>
                                <p className="text-xs text-gray-500">Customize the About Us content</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Dashboard</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-8"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-maroon-100 rounded-xl flex items-center justify-center">
                            <Info className="w-6 h-6 text-maroon-700" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">About Us Content</h2>
                            <p className="text-sm text-gray-500">Edit the content displayed on the About Us page</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Page Title
                            </label>
                            <input
                                type="text"
                                value={content.title}
                                onChange={(e) => setContent({ ...content, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                placeholder="About Business Talk"
                            />
                        </div>

                        {/* Paragraphs */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Paragraphs
                                </label>
                                <button
                                    onClick={addParagraph}
                                    className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Paragraph</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {content.paragraphs.map((paragraph, index) => (
                                    <div key={index} className="relative">
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs text-gray-500 mt-3 w-6">{index + 1}.</span>
                                            <textarea
                                                value={paragraph}
                                                onChange={(e) => updateParagraph(index, e.target.value)}
                                                rows={3}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent resize-none text-justify"
                                                placeholder={`Enter paragraph ${index + 1}...`}
                                            />
                                            {content.paragraphs.length > 1 && (
                                                <button
                                                    onClick={() => removeParagraph(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                                    title="Remove paragraph"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center justify-between pt-6 border-t">
                            <div>
                                {saveSuccess && (
                                    <span className="text-green-600 text-sm font-medium">
                                        ✓ Changes saved successfully!
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-10 pt-8 border-t">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="text-center mb-4">
                                <img
                                    src={logoImage}
                                    alt="Business Talk Logo"
                                    className="w-20 h-20 object-contain rounded-full shadow-lg mx-auto mb-3"
                                />
                                <h4 className="text-xl font-bold text-gray-900">{content.title}</h4>
                            </div>
                            <div className="text-justify space-y-3">
                                {content.paragraphs.map((paragraph, index) => (
                                    <p key={index} className="text-gray-700 text-sm leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
