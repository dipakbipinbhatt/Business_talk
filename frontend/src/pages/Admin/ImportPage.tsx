import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Upload,
    Loader2,
    CheckCircle,
    XCircle,
    FileJson,
    Copy,
    Mic,
    FileText,
    Calendar,
    Info,
    LogOut,
} from 'lucide-react';
import { importAPI } from '../../services/api';
import { useAuthStore } from '../../store/useStore';
import logoImage from '../../assets/logo.jpg';

const SAMPLE_JSON = `[
  {
    "title": "Seeing Beyond the Here and Now: Rethinking Corporate Purpose with Dr. Tima Bansal",
    "guestName": "Dr. Tima Bansal",
    "guestTitle": "Professor of Sustainability & Strategy",
    "guestInstitution": "Ivey Business School, Western University",
    "youtubeUrl": "https://www.youtube.com/watch?v=bdM3lx_o5TE",
    "category": "past",
    "scheduledDate": "2024-12-20",
    "scheduledTime": "10:00 PM IST",
    "episodeNumber": 309,
    "description": "Research insights on corporate purpose",
    "tags": ["sustainability", "strategy"]
  }
]`;

export default function ImportPage() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [jsonData, setJsonData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        success: number;
        failed: number;
        errors: string[];
        message: string;
    } | null>(null);
    const [error, setError] = useState('');

    // Redirect if not authenticated
    if (!isAuthenticated) {
        navigate('/admin/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleImport = async () => {
        setError('');
        setResult(null);

        if (!jsonData.trim()) {
            setError('Please paste JSON data to import');
            return;
        }

        let podcasts;
        try {
            podcasts = JSON.parse(jsonData);
            if (!Array.isArray(podcasts)) {
                throw new Error('Data must be an array of podcasts');
            }
        } catch (e: any) {
            setError(`Invalid JSON: ${e.message}`);
            return;
        }

        setIsLoading(true);
        try {
            const response = await importAPI.importPodcasts(podcasts);
            setResult(response.data);
        } catch (e: any) {
            setError(e.response?.data?.error || 'Import failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopySample = () => {
        navigator.clipboard.writeText(SAMPLE_JSON);
    };

    const handleLoadSample = () => {
        setJsonData(SAMPLE_JSON);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setJsonData(event.target?.result as string);
            };
            reader.readAsText(file);
        }
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
                                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                View Site
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-8">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Mic className="w-5 h-5" />
                        Podcasts
                    </Link>
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <FileText className="w-5 h-5" />
                        Blogs
                    </Link>
                    <Link
                        to="/admin/calendar"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Calendar className="w-5 h-5" />
                        Calendar
                    </Link>
                    <button
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-maroon-700 text-white"
                    >
                        <Upload className="w-5 h-5" />
                        Import
                    </button>
                    <Link
                        to="/admin/about"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50"
                    >
                        <Info className="w-5 h-5" />
                        About Us
                    </Link>
                </div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileJson className="w-5 h-5 text-maroon-600" />
                        JSON Format
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Paste a JSON array of podcasts to import. Each podcast should have the following fields:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono overflow-x-auto mb-4">
                        <pre className="text-gray-700 whitespace-pre-wrap">{SAMPLE_JSON}</pre>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopySample}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            <Copy className="w-4 h-4" />
                            Copy Sample
                        </button>
                        <button
                            onClick={handleLoadSample}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-maroon-100 text-maroon-700 rounded-lg hover:bg-maroon-200"
                        >
                            Load Sample
                        </button>
                    </div>
                </motion.div>

                {/* Import Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 mb-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-maroon-600" />
                        Import Data
                    </h2>

                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload JSON File (optional)
                        </label>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-maroon-50 file:text-maroon-700 hover:file:bg-maroon-100"
                        />
                    </div>

                    {/* JSON Textarea */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or paste JSON directly
                        </label>
                        <textarea
                            value={jsonData}
                            onChange={(e) => setJsonData(e.target.value)}
                            placeholder="Paste your JSON array here..."
                            className="w-full h-64 p-4 border border-gray-200 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Import Button */}
                    <button
                        onClick={handleImport}
                        disabled={isLoading || !jsonData.trim()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-maroon-700 text-white rounded-lg font-medium hover:bg-maroon-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Import Podcasts
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Results */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Import Results
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-600">Imported Successfully</p>
                                <p className="text-2xl font-bold text-green-700">{result.success}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-sm text-red-600">Failed</p>
                                <p className="text-2xl font-bold text-red-700">{result.failed}</p>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-yellow-700 mb-2">Errors:</p>
                                <ul className="text-sm text-yellow-600 space-y-1">
                                    {result.errors.map((err, i) => (
                                        <li key={i}>• {err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 flex gap-2">
                            <Link
                                to="/admin/dashboard"
                                className="px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800"
                            >
                                View All Podcasts
                            </Link>
                            <button
                                onClick={() => {
                                    setJsonData('');
                                    setResult(null);
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Import More
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
