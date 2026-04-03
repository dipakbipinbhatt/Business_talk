import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, Eye, TrendingUp, Globe, Clock,
    RefreshCw, ExternalLink, CheckCircle, BarChart3,
    AlertCircle, Wifi, FileText, Zap,
} from 'lucide-react';
import { analyticsAPI, AnalyticsConfig, GA4AnalyticsData } from '../services/api';

interface AnalyticsDashboardProps {
    measurementId?: string;
    propertyId?: string;
    /** compact=true: show only summary cards (used inside Settings tab) */
    compact?: boolean;
}

function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

// ── Sparkline (line chart) ─────────────────────────────────────────────────
function SparkLine({ data, color = '#f97316' }: { data: number[]; color?: string }) {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const W = 400; const H = 80; const pad = 4;
    const pts = data.map((v, i) => {
        const x = pad + (i / (data.length - 1 || 1)) * (W - pad * 2);
        const y = H - pad - ((v - min) / range) * (H - pad * 2);
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {/* fill under line */}
            <polyline
                points={`${pad},${H} ${pts} ${W - pad},${H}`}
                fill={color}
                fillOpacity="0.12"
                stroke="none"
            />
        </svg>
    );
}

// ── Bar chart ──────────────────────────────────────────────────────────────
function BarChart({ data, color = '#f97316' }: { data: { label: string; value: number }[]; color?: string }) {
    if (!data.length) return null;
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex items-end gap-1 h-24 w-full">
            {data.map((d, i) => {
                const pct = Math.max((d.value / max) * 100, 2);
                return (
                    <div key={i} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
                        <div
                            className="w-full rounded-t-sm transition-all duration-300"
                            style={{ height: `${pct}%`, backgroundColor: color, opacity: 0.85 }}
                            title={`${d.label}: ${d.value.toLocaleString()}`}
                        />
                        <span className="text-[9px] text-gray-400 truncate w-full text-center leading-none">
                            {d.label.slice(5)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Skeleton loader ────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AnalyticsDashboard({ measurementId, propertyId, compact = false }: AnalyticsDashboardProps) {
    const [config, setConfig]               = useState<AnalyticsConfig | null>(null);
    const [configLoading, setConfigLoading] = useState(true);
    const [gaData, setGaData]               = useState<GA4AnalyticsData | null>(null);
    const [dataLoading, setDataLoading]     = useState(false);
    const [dataError, setDataError]         = useState<string | null>(null);
    const [lastFetched, setLastFetched]     = useState<Date | null>(null);
    const [activeTrend, setActiveTrend]     = useState<'activeUsers' | 'eventCount' | 'pageViews' | 'sessions'>('activeUsers');
    const [trendRange, setTrendRange]       = useState<'7d' | '28d'>('7d');

    // Fetch config (existing behaviour)
    useEffect(() => {
        const run = async () => {
            setConfigLoading(true);
            try {
                const r = await analyticsAPI.getConfig();
                setConfig(r.data);
            } catch (e: any) {
                setConfig(e.response?.status === 404 ? { configured: false } : null);
            } finally {
                setConfigLoading(false);
            }
        };
        run();
    }, []);

    // Fetch real GA4 data
    const fetchGAData = useCallback(async () => {
        const pid = propertyId?.trim();
        if (!pid || !/^\d+$/.test(pid)) return;
        setDataLoading(true);
        setDataError(null);
        try {
            const r = await analyticsAPI.getData(pid);
            setGaData(r.data);
            setLastFetched(new Date());
        } catch (e: any) {
            setDataError(e.response?.data?.message || e.message || 'Failed to fetch analytics data.');
            setGaData(null);
        } finally {
            setDataLoading(false);
        }
    }, [propertyId]);

    useEffect(() => { fetchGAData(); }, [fetchGAData]);

    const gaId          = measurementId || config?.measurementId;
    const isConfigured  = !!(gaId && gaId.startsWith('G-'));
    const hasPropertyId = !!(propertyId?.trim() && /^\d+$/.test(propertyId.trim()));

    // ── Loading spinner ────────────────────────────────────────────────────
    if (configLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
                </div>
            </motion.div>
        );
    }

    // ── Not configured ─────────────────────────────────────────────────────
    if (!isConfigured) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    Analytics Dashboard
                </h2>
                <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-700">Google Analytics Not Configured</p>
                    <p className="text-sm mt-1">Enter your Measurement ID in Settings → Google Analytics.</p>
                </div>
            </motion.div>
        );
    }

    // ── Trend data selection ───────────────────────────────────────────────
    const trendRows = trendRange === '7d' ? (gaData?.sevenDayTrend ?? []) : (gaData?.dailyTrend ?? []);
    const trendValues = trendRows.map(r => r[activeTrend]);
    const trendLabels = trendRows.map(r => ({ label: r.date, value: r[activeTrend] }));

    const metricButtons: { key: typeof activeTrend; label: string; color: string }[] = [
        { key: 'activeUsers', label: 'Active Users', color: '#3b82f6' },
        { key: 'eventCount',  label: 'Event Count',  color: '#f97316' },
        { key: 'pageViews',   label: 'Views',        color: '#8b5cf6' },
        { key: 'sessions',    label: 'Sessions',     color: '#10b981' },
    ];
    const activeMetric = metricButtons.find(m => m.key === activeTrend)!;

    // ── COMPACT mode (used in Settings tab) ───────────────────────────────
    if (compact) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-orange-600" />
                        Analytics Dashboard
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" /> Connected
                        </span>
                        {hasPropertyId && (
                            <button onClick={fetchGAData} disabled={dataLoading}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                                {lastFetched ? `Updated ${lastFetched.toLocaleTimeString()}` : 'Refresh'}
                            </button>
                        )}
                        <a href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/realtime`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                            <ExternalLink className="w-4 h-4" /> Open Full Dashboard
                        </a>
                    </div>
                </div>

                {dataError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-700">Failed to load analytics data</p>
                            <p className="text-sm text-red-600 mt-0.5">{dataError}</p>
                            <p className="text-xs text-red-500 mt-2">
                                Fix: Go to <strong>analytics.google.com → Admin → Property Access Management</strong> and add your service account email as a <strong>Viewer</strong>.
                            </p>
                        </div>
                    </div>
                )}

                {!hasPropertyId && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <p className="text-sm text-amber-700">Enter your <strong>GA4 Property ID</strong> above to load live data.</p>
                    </div>
                )}

                {/* 4 summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: <Activity className="w-5 h-5 text-white" />, bg: 'bg-orange-500', label: 'Active Now', value: gaData ? gaData.activeUsersRightNow.toLocaleString() : 'Active', skeletonW: 'w-8' },
                        { icon: <Globe className="w-5 h-5 text-white" />,    bg: 'bg-blue-500',   label: 'Sessions (30d)', value: gaData ? fmt(gaData.totalSessions) : gaId, skeletonW: 'w-12' },
                        { icon: <TrendingUp className="w-5 h-5 text-white" />, bg: 'bg-green-500', label: 'Page Views (30d)', value: gaData ? fmt(gaData.totalPageViews) : 'Enabled', skeletonW: 'w-12' },
                        { icon: <Clock className="w-5 h-5 text-white" />,   bg: 'bg-purple-500', label: 'Users (30d)', value: gaData ? fmt(gaData.totalUsers) : '24/7', skeletonW: 'w-10' },
                    ].map((card, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                            <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>{card.icon}</div>
                            <div>
                                <p className="text-xs text-gray-500">{card.label}</p>
                                {dataLoading ? <Skeleton className={`h-5 ${card.skeletonW} mt-1`} /> :
                                    <p className="text-base font-bold text-gray-900">{card.value}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                        <strong>Note:</strong> Page views are tracked automatically.{' '}
                        <a href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/realtime`}
                            target="_blank" rel="noopener noreferrer" className="underline">Open GA4 Dashboard</a>
                        {' '}for full detail.{gaData && <span className="ml-1 text-xs text-blue-400">Last fetched: {new Date(gaData.fetchedAt).toLocaleString()}</span>}
                    </p>
                </div>
            </motion.div>
        );
    }

    // ── FULL mode (Analytics tab) ─────────────────────────────────────────
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* ── Header bar ── */}
            <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-orange-600" /> Analytics Overview
                    </h2>
                    {gaData && <p className="text-xs text-gray-400 mt-0.5">Last fetched: {new Date(gaData.fetchedAt).toLocaleString()}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                        <CheckCircle className="w-4 h-4" /> Tracking Active
                    </span>
                    {hasPropertyId && (
                        <button onClick={fetchGAData} disabled={dataLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50 text-sm font-medium">
                            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </button>
                    )}
                    <a href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/realtime`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        <ExternalLink className="w-4 h-4" /> Open GA4
                    </a>
                </div>
            </div>

            {/* ── Error banner ── */}
            {dataError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-700">Failed to load analytics data</p>
                        <p className="text-sm text-red-600 mt-1">{dataError}</p>
                        <div className="mt-3 p-3 bg-red-100 rounded-lg text-sm text-red-700">
                            <p className="font-semibold mb-1">How to fix the permission error:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">analytics.google.com</a></li>
                                <li>Click the gear icon (Admin) at the bottom left</li>
                                <li>Under Property column → click <strong>Property Access Management</strong></li>
                                <li>Click <strong>+</strong> → <strong>Add users</strong></li>
                                <li>Enter your service account email: <code className="bg-red-200 px-1 rounded">{'{GA4_CLIENT_EMAIL from .env}'}</code></li>
                                <li>Set role to <strong>Viewer</strong> → click Add</li>
                                <li>Wait 1–2 minutes then refresh</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}

            {/* ── No property ID warning ── */}
            {!hasPropertyId && !dataError && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-amber-700">GA4 Property ID not configured</p>
                        <p className="text-sm text-amber-600 mt-0.5">Go to <strong>Settings tab → Google Analytics</strong> and enter your numeric Property ID to load live data.</p>
                    </div>
                </div>
            )}

            {/* ── 6 summary cards (matches GA4 home page metrics) ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: <Users className="w-5 h-5 text-white" />,      bg: 'from-blue-500 to-blue-600',   border: 'border-blue-200',   label: 'Active Users (30d)', value: gaData?.totalUsers,       skW: 'w-16', suffix: '' },
                    { icon: <Zap className="w-5 h-5 text-white" />,        bg: 'from-orange-500 to-orange-600', border: 'border-orange-200', label: 'Event Count (30d)', value: gaData?.totalEventCount,  skW: 'w-16', suffix: '' },
                    { icon: <Eye className="w-5 h-5 text-white" />,        bg: 'from-purple-500 to-purple-600', border: 'border-purple-200', label: 'Views (30d)',       value: gaData?.totalPageViews,  skW: 'w-16', suffix: '' },
                    { icon: <Activity className="w-5 h-5 text-white" />,   bg: 'from-red-500 to-red-600',     border: 'border-red-200',    label: 'Active Right Now',  value: gaData?.activeUsersRightNow, skW: 'w-8',  suffix: '' },
                    { icon: <TrendingUp className="w-5 h-5 text-white" />, bg: 'from-green-500 to-green-600', border: 'border-green-200',  label: 'Sessions (30d)',    value: gaData?.totalSessions,   skW: 'w-16', suffix: '' },
                    { icon: <Wifi className="w-5 h-5 text-white" />,      bg: 'from-teal-500 to-teal-600',   border: 'border-teal-200',   label: 'Bounce Rate',       value: gaData?.bounceRate,      skW: 'w-14', suffix: '', isStr: true },
                    { icon: <Clock className="w-5 h-5 text-white" />,     bg: 'from-indigo-500 to-indigo-600', border: 'border-indigo-200', label: 'Avg Duration',      value: gaData?.avgSessionDuration, skW: 'w-14', suffix: '', isStr: true },
                    { icon: <Globe className="w-5 h-5 text-white" />,     bg: 'from-pink-500 to-pink-600',   border: 'border-pink-200',   label: 'New Users (30d)',   value: gaData?.newUsers,        skW: 'w-12', suffix: '' },
                ].map((card, i) => (
                    <div key={i} className={`bg-white rounded-xl shadow-sm p-5 border ${card.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-9 h-9 bg-gradient-to-br ${card.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>{card.icon}</div>
                            <p className="text-xs text-gray-500 font-medium leading-tight">{card.label}</p>
                        </div>
                        {dataLoading ? <Skeleton className={`h-7 ${card.skW} mt-1`} /> :
                            <p className="text-2xl font-bold text-gray-900">
                                {card.value === undefined ? '—' :
                                 (card as any).isStr ? card.value :
                                 fmt(card.value as number)}
                            </p>}
                    </div>
                ))}
            </div>

            {/* ── Active Users / Event Count / Views / Sessions trend (matches GA4 home chart) ── */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Trend Over Time</h3>
                    <div className="flex flex-wrap gap-2">
                        {/* Metric selector */}
                        {metricButtons.map(m => (
                            <button key={m.key} onClick={() => setActiveTrend(m.key)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTrend === m.key ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                style={activeTrend === m.key ? { backgroundColor: m.color } : {}}>
                                {m.label}
                            </button>
                        ))}
                        {/* Range selector */}
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 ml-2">
                            {(['7d', '28d'] as const).map(r => (
                                <button key={r} onClick={() => setTrendRange(r)}
                                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${trendRange === r ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                                    {r === '7d' ? 'Last 7 days' : 'Last 28 days'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {dataLoading ? (
                    <Skeleton className="w-full h-24 rounded-lg" />
                ) : trendValues.length > 0 ? (
                    <>
                        <SparkLine data={trendValues} color={activeMetric.color} />
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-400">{trendRows[0]?.date}</span>
                            <span className="text-xs font-semibold text-gray-700">
                                Total: {fmt(trendValues.reduce((a, b) => a + b, 0))}
                            </span>
                            <span className="text-xs text-gray-400">{trendRows[trendRows.length - 1]?.date}</span>
                        </div>
                    </>
                ) : (
                    <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
                        No trend data available
                    </div>
                )}
            </div>

            {/* ── Views by Page + Active Users by Country (matches GA4 home suggested) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Views by Page Title */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        Views by Page Title and Screen
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    {dataLoading ? (
                        <div className="space-y-3">
                            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-6 w-full" />)}
                        </div>
                    ) : gaData?.topPages.length ? (
                        <div className="space-y-3">
                            {/* Header */}
                            <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide pb-1 border-b border-gray-100">
                                <span>Page Title</span>
                                <span>Views</span>
                            </div>
                            {gaData.topPages.map((page, i) => {
                                const maxV = gaData.topPages[0].screenPageViews;
                                const pct = Math.round((page.screenPageViews / maxV) * 100);
                                return (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-xs text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                                                <span className="text-sm text-gray-700 truncate group-hover:text-purple-600 transition-colors"
                                                    title={page.pageTitle}>
                                                    {page.pageTitle && page.pageTitle !== '(not set)' ? page.pageTitle : page.pagePath}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 ml-3 flex-shrink-0">
                                                {page.screenPageViews.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-400 rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No page data</div>
                    )}
                </div>

                {/* Active Users by Country */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Active Users by Country
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    {dataLoading ? (
                        <div className="space-y-3">
                            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-6 w-full" />)}
                        </div>
                    ) : gaData?.topCountries.length ? (
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide pb-1 border-b border-gray-100">
                                <span>Country</span>
                                <span>Active Users</span>
                            </div>
                            {gaData.topCountries.map((row, i) => {
                                const maxV = gaData.topCountries[0].activeUsers;
                                const pct = Math.round((row.activeUsers / maxV) * 100);
                                return (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                                                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{row.country}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{row.activeUsers.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-400 rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No country data</div>
                    )}
                </div>
            </div>

            {/* ── Bar chart: daily page views ── */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Daily Page Views
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                    {trendRange === '7d' ? 'Last 7 days' : 'Last 28 days'}
                </p>
                {dataLoading ? (
                    <Skeleton className="w-full h-28 rounded-lg" />
                ) : trendLabels.length > 0 ? (
                    <BarChart
                        data={trendRows.map(r => ({ label: r.date, value: r.pageViews }))}
                        color="#f97316"
                    />
                ) : (
                    <div className="h-28 flex items-center justify-center text-gray-400 text-sm">No data</div>
                )}
            </div>

            {/* ── Quick links row ── */}
            <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links to GA4</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Real-time', icon: <Users className="w-4 h-4" />, path: 'realtime/rt-content' },
                        { label: 'Acquisition', icon: <TrendingUp className="w-4 h-4" />, path: 'reports/acquisition-overview' },
                        { label: 'Engagement', icon: <Eye className="w-4 h-4" />, path: 'reports/engagement-overview' },
                        { label: 'Demographics', icon: <Globe className="w-4 h-4" />, path: 'reports/demographics-detail' },
                    ].map(link => (
                        <a key={link.label}
                            href={`https://analytics.google.com/analytics/web/#/p${gaId?.replace('G-', '')}/${link.path}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-all text-gray-700 text-sm font-medium">
                            {link.icon} {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}