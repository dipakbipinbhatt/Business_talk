import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Users,
    Eye,
    TrendingUp,
    Globe,
    Clock,
    RefreshCw,
    ExternalLink,
    CheckCircle,
    BarChart3
} from 'lucide-react';
import { analyticsAPI, AnalyticsConfig } from '../services/api';

interface AnalyticsDashboardProps {
    measurementId?: string;
}

export default function AnalyticsDashboard({ measurementId }: AnalyticsDashboardProps) {
    const [config, setConfig] = useState<AnalyticsConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await analyticsAPI.getConfig();
            setConfig(response.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setConfig({ configured: false });
            } else {
                setError('Failed to fetch analytics configuration');
            }
        } finally {
            setLoading(false);
        }
    };

    // Use prop if available, otherwise use fetched config
    const gaId = measurementId || config?.measurementId;
    const isConfigured = !!(gaId && gaId.startsWith('G-'));

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
                </div>
            </motion.div>
        );
    }

    if (!isConfigured) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    Analytics Dashboard
                </h2>
                <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-700">Google Analytics Not Configured</p>
                    <p className="text-sm mt-1">
                        Enter your Google Analytics 4 Measurement ID above to enable analytics tracking.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    Analytics Dashboard
                </h2>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Connected
                    </span>
                    <a
                        href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/realtime`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open Full Dashboard
                    </a>
                </div>
            </div>

            {/* Analytics Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-orange-600 font-medium">Status</p>
                            <p className="text-lg font-bold text-orange-900">Active</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Property ID</p>
                            <p className="text-lg font-bold text-blue-900 font-mono">{gaId}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-green-600 font-medium">Tracking</p>
                            <p className="text-lg font-bold text-green-900">Enabled</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Data Collection</p>
                            <p className="text-lg font-bold text-purple-900">24/7</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <a
                        href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/realtime/rt-content`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all text-gray-700 hover:text-orange-600"
                    >
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-medium">Real-time</span>
                    </a>
                    <a
                        href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/reports/acquisition-overview`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all text-gray-700 hover:text-orange-600"
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm font-medium">Acquisition</span>
                    </a>
                    <a
                        href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/reports/engagement-overview`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all text-gray-700 hover:text-orange-600"
                    >
                        <Eye className="w-5 h-5" />
                        <span className="text-sm font-medium">Engagement</span>
                    </a>
                    <a
                        href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/reports/demographics-detail`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all text-gray-700 hover:text-orange-600"
                    >
                        <Globe className="w-5 h-5" />
                        <span className="text-sm font-medium">Demographics</span>
                    </a>
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Page views and events are being tracked automatically.
                    Visit the <a href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/realtime`} target="_blank" rel="noopener noreferrer" className="underline">Google Analytics Dashboard</a> to view detailed metrics,
                    user behavior, and real-time data.
                </p>
            </div>
        </motion.div>
    );
}
