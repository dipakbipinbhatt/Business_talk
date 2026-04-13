import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';
import {
    Mic,
    Plus,
    Edit,
    Trash2,
    BarChart3,
    Calendar,
    Clock,
    Loader2,
    FileText,
    Eye,
    EyeOff,
    Upload,
    Info,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    Copy,
    FileJson,
    Save,
    XCircle,
    CheckCircle,
    Settings,
    Activity,
    RefreshCw,
    Server,
    Database,
    ExternalLink,
    Mail,
    MailOpen,
    Download,
    User,
    File,
    // ArrowUpIcon,
} from 'lucide-react';
import { podcastAPI, blogAPI, Blog, importAPI, aboutUsAPI, AboutUsContent, renderAPI, systemHealthAPI, settingsAPI, SiteSettings, mongoAPI, contactAPI, ContactMessage, ContactStats, Podcast } from '../../services/api';
import { useAuthStore, usePodcastStore } from '../../store/useStore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import AdminHeader from '../../components/layout/AdminHeader';
import * as XLSX from 'xlsx';

type ActiveTab = 'podcasts' | 'blogs' | 'import' | 'about' | 'settings' | 'calendar' | 'inbox' | 'analytics' | 'pages';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { podcasts, setPodcasts, removePodcast } = usePodcastStore();
    const [isLoading, setIsLoading] = useState(true);
    const [_searchTerm, _setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

    // Determine active tab from URL pathname
    const getInitialTab = (): ActiveTab => {
        const path = location.pathname;
        if (path.includes('/admin/dashboard/analytics'))        return 'analytics';
        if (path.includes('/admin/dashboard/podcasts'))         return 'podcasts';
        if (path.includes('/admin/dashboard/blogs'))            return 'blogs';
        if (path.includes('/admin/dashboard/calendar'))         return 'calendar';
        if (path.includes('/admin/dashboard/inbox'))            return 'inbox';
        if (path.includes('/admin/dashboard/pages/about'))      return 'about';
        if (path.includes('/admin/dashboard/settings/general')) return 'settings';
        if (path.includes('/admin/dashboard/settings/import'))  return 'import';
        // Legacy ?tab= query param support (backward compat)
        const params = new URLSearchParams(location.search);
        const tabParam = params.get('tab');
        if (tabParam && ['podcasts', 'blogs', 'import', 'about', 'settings', 'calendar', 'inbox', 'analytics', 'pages'].includes(tabParam)) {
            return tabParam as ActiveTab;
        }
        return 'analytics';
    };

    const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab());

    // Sidebar state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [settingsGroupOpen, setSettingsGroupOpen] = useState(
        () => ['settings', 'import'].includes(getInitialTab())
    );
    const [pagesGroupOpen, setPagesGroupOpen] = useState(
        () => ['about'].includes(getInitialTab())
    );
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const extractServiceId = (input: string) => {
        const match = input.match(/(srv-[a-z0-9]+)/i);
        return match ? match[0] : input;
    };

    // Settings State
    const [frontendServiceId, setFrontendServiceId] = useState('');
    const [backendServiceId, setBackendServiceId] = useState('');
    const [frontendDeployments, setFrontendDeployments] = useState<any[]>([]);
    const [backendDeployments, setBackendDeployments] = useState<any[]>([]);
    const [renderLoading, setRenderLoading] = useState(false);



    const [systemHealth, setSystemHealth] = useState<{ status: string; database?: { state: string; host: string } } | null>(null);
    const [healthLoading, setHealthLoading] = useState(false);

    const [settingsSaved, setSettingsSaved] = useState(false);
    const [settingsError, setSettingsError] = useState<string | null>(null);
    const [settingsSaving, setSettingsSaving] = useState(false);

    // Episode Loading Settings State
    const [episodeSettings, setEpisodeSettings] = useState<SiteSettings>({
        upcomingInitialLoad: 4,
        upcomingBatchSize: 4,
        pastInitialLoad: 4,
        pastBatchSize: 6,
        googleAnalyticsId: '',
    });

    // GA4 Property ID (numeric) -- stored in localStorage, used by AnalyticsDashboard
    const [ga4PropertyId, setGa4PropertyId] = useState<string>(
        () => localStorage.getItem('ga4PropertyId') || ''
    );

    // MongoDB Atlas Cluster State
    // const [mongoCluster, setMongoCluster] = useState<{ name: string; mongoDBVersion: string; stateName: string; providerSettings?: { regionName: string } } | null>(null);
    // const [mongoLoading, setMongoLoading] = useState(false);
    // const [mongoError, setMongoError] = useState<string | null>(null);

    // Inbox State
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [contactStats, setContactStats] = useState<ContactStats>({ total: 0, unread: 0, read: 0, archived: 0 });
    const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');

    // Calendar State
    const [calCurrentDate, setCalCurrentDate] = useState(new Date());
    const [calPodcasts, setCalPodcasts] = useState<Podcast[]>([]);
    const [calSelectedPodcast, setCalSelectedPodcast] = useState<Podcast | null>(null);
    const [calLoading, setCalLoading] = useState(false);
    const [calFetched, setCalFetched] = useState(false);


    // Set page title dynamically per active tab
    const tabTitles: Record<ActiveTab, string> = {
        analytics: 'Analytics | Business Talk Admin',
        podcasts:  'Podcasts | Business Talk Admin',
        blogs:     'Blogs | Business Talk Admin',
        calendar:  'Calendar | Business Talk Admin',
        inbox:     'Inbox | Business Talk Admin',
        about:     'About Us — Pages | Business Talk Admin',
        settings:  'Settings — General | Business Talk Admin',
        import:    'Settings — Import | Business Talk Admin',
        pages:     'Pages | Business Talk Admin',
    };
    useEffect(() => {
        document.title = tabTitles[activeTab];
    }, [activeTab]);

    // Sync active tab when URL changes (browser back/forward buttons)
    useEffect(() => {
        setActiveTab(getInitialTab());
    }, [location.pathname]);

    // Fetch Render Config and Deployments on load
    useEffect(() => {
        if (activeTab === 'settings') {
            checkSystemHealth();
            fetchRenderConfig();
            fetchEpisodeSettings();
            // fetchMongoCluster();
        }
        if (activeTab === 'inbox') {
            fetchMessages();
        }
        if (activeTab === 'calendar' && !calFetched) {
            fetchCalendarPodcasts();
        }
    }, [activeTab, messageFilter, calFetched]);

    const fetchRenderConfig = async () => {
        try {
            const response = await renderAPI.getConfig();
            const { frontendServiceId: feId, backendServiceId: beId } = response.data;

            setFrontendServiceId(feId);
            setBackendServiceId(beId);

            if (feId || beId) {
                fetchRenderDeployments(feId, beId);
            }
        } catch (error) {
            console.error('Error fetching Render config:', error);
        }
    };

    const saveSettings = async () => {
        setSettingsSaving(true);
        setSettingsError(null);

        const cleanFe = extractServiceId(frontendServiceId);
        const cleanBe = extractServiceId(backendServiceId);

        // Update state if needed
        setFrontendServiceId(cleanFe);
        setBackendServiceId(cleanBe);

        // Note: API Key is now managed via backend env vars, not local storage
        localStorage.setItem('frontendServiceId', cleanFe);
        localStorage.setItem('backendServiceId', cleanBe);

        // Save episode settings and handle errors
        const success = await saveEpisodeSettings();

        setSettingsSaving(false);

        if (success) {
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 3000);
            fetchRenderDeployments(cleanFe, cleanBe);
        } else {
            setSettingsError('Failed to save episode settings. Please try again.');
            setTimeout(() => setSettingsError(null), 5000);
        }
    };

    const checkSystemHealth = async () => {
        setHealthLoading(true);
        try {
            const response = await systemHealthAPI.check();
            setSystemHealth(response.data);
        } catch (error) {
            console.error('Health check failed:', error);
            setSystemHealth({ status: 'error', database: { state: 'disconnected', host: 'unknown' } });
        } finally {
            setHealthLoading(false);
        }
    };

    const fetchRenderDeployments = async (feId = frontendServiceId, beId = backendServiceId) => {
        // Ensure we are using clean IDs even if passed args are dirty (though we try to pass clean ones)
        const cleanFe = extractServiceId(feId);
        const cleanBe = extractServiceId(beId);

        setRenderLoading(true);
        try {
            if (cleanFe) {
                try {
                    const feRes = await renderAPI.getDeployments(cleanFe);
                    setFrontendDeployments(feRes.data);
                } catch (e) {
                    console.error("Error fetching frontend deployments", e);
                }
            }

            if (cleanBe) {
                try {
                    const beRes = await renderAPI.getDeployments(cleanBe);
                    setBackendDeployments(beRes.data);
                } catch (e) {
                    console.error("Error fetching backend deployments", e);
                }
            }
        } catch (error) {
            console.error('Failed to load deployments:', error);
        } finally {
            setRenderLoading(false);
        }
    };

    // Fetch episode loading settings
    const fetchEpisodeSettings = async () => {
        try {
            const response = await settingsAPI.get();
            setEpisodeSettings(response.data);
        } catch (error) {
            console.error('Error fetching episode settings:', error);
        }
    };

    // Fetch MongoDB Atlas cluster status
    // const fetchMongoCluster = async () => {
    //     setMongoLoading(true);
    //     setMongoError(null);
    //     try {
    //         const response = await mongoAPI.getClusters();
    //         console.log('[Dashboard] MongoDB API response:', response.data);
    //         if (response.data?.results && response.data.results.length > 0) {
    //             setMongoCluster(response.data.results[0]);
    //         } else {
    //             setMongoError('No clusters found in the response');
    //         }
    //     } catch (error: any) {
    //         console.error('Error fetching MongoDB cluster:', error);
    //         const errorMessage = error.response?.data?.message ||
    //             error.response?.data?.error ||
    //             error.message ||
    //             'Failed to fetch cluster status';
    //         setMongoError(errorMessage);
    //     } finally {
    //         setMongoLoading(false);
    //     }
    // };

    // Save episode loading settings
    const saveEpisodeSettings = async (): Promise<boolean> => {
        try {
            await settingsAPI.update(episodeSettings);
            return true;
        } catch (error) {
            console.error('Error saving episode settings:', error);
            return false;
        }
    };

    // Fetch contact messages
    const fetchMessages = async () => {
        setMessagesLoading(true);
        try {
            const [messagesRes, statsRes] = await Promise.all([
                contactAPI.getMessages({ status: messageFilter === 'all' ? undefined : messageFilter }),
                contactAPI.getStats(),
            ]);
            setMessages(messagesRes.data.messages);
            setContactStats(statsRes.data.stats);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setMessagesLoading(false);
        }
    };

    // Fetch all podcasts for calendar (separate from paginated podcast list)
    const fetchCalendarPodcasts = async () => {
        setCalLoading(true);
        try {
            const response = await podcastAPI.getAll({ limit: 1000 });
            setCalPodcasts(response.data.podcasts);
            setCalFetched(true);
        } catch (error) {
            console.error('Error fetching calendar podcasts:', error);
        } finally {
            setCalLoading(false);
        }
    };

    // Calendar helpers
    const calGetDaysInMonth = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();

    const calGetFirstDay = (year: number, month: number) =>
        new Date(year, month, 1).getDay();

    const calFormatMonth = (date: Date) =>
        date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const calPrevMonth = () =>
        setCalCurrentDate(new Date(calCurrentDate.getFullYear(), calCurrentDate.getMonth() - 1, 1));

    const calNextMonth = () =>
        setCalCurrentDate(new Date(calCurrentDate.getFullYear(), calCurrentDate.getMonth() + 1, 1));

    const calGoToToday = () => setCalCurrentDate(new Date());

    const calGetPodcastsForDate = (day: number) => {
        const year = calCurrentDate.getFullYear();
        const month = calCurrentDate.getMonth();
        return calPodcasts.filter(p => {
            const d = new Date(p.scheduledDate);
            return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
        });
    };

    // Mark message as read
    const handleMarkAsRead = async (id: string) => {
        try {
            await contactAPI.markAsRead(id);
            fetchMessages();
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    // Delete message
    const handleDeleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await contactAPI.delete(id);
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    // Helper component for Deployment Table
    const DeploymentsTable = ({ deployments, title }: { deployments: any[]; title: string }) => (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ExternalLink className="w-6 h-6 text-maroon-700" />
                    {title} Deployments
                </h2>
                <button
                    onClick={() => fetchRenderDeployments()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={renderLoading}
                >
                    <RefreshCw className={`w-5 h-5 text-gray-600 ${renderLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {renderLoading && deployments.length === 0 ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
                </div>
            ) : deployments.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-4 font-medium text-gray-500">Status</th>
                                <th className="pb-4 font-medium text-gray-500">Commit</th>
                                <th className="pb-4 font-medium text-gray-500">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {deployments.map((deploy: any) => {
                                // Handle potential snake_case or missing fields
                                const createdAt = deploy.createdAt || deploy.created_at || new Date().toISOString();
                                const status = deploy.status || deploy.state || 'unknown';
                                const commitMsg = deploy.commit?.message || deploy.commit?.title || 'Manual Deployment';

                                return (
                                    <tr key={deploy.id} className="group hover:bg-gray-50">
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'live' ? 'bg-green-100 text-green-800' :
                                                status === 'build_in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    status === 'failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-600 font-mono text-sm max-w-[200px] truncate" title={commitMsg}>
                                            {commitMsg}
                                        </td>
                                        <td className="py-4 text-gray-500 text-sm">
                                            {new Date(createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    No deployments found
                </div>
            )}
        </div>
    );

    const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
    const [blogStats, setBlogStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [blogsLoading, setBlogsLoading] = useState(false);

    // Search and Pagination state
    const ITEMS_PER_PAGE = 10;
    const [podcastSearch, setPodcastSearch] = useState('');
    const [podcastPage, setPodcastPage] = useState(1);
    const [totalPodcastCount, setTotalPodcastCount] = useState(0);
    const [blogSearch, setBlogSearch] = useState('');
    const [blogPage, setBlogPage] = useState(1);
    const [totalBlogCount, setTotalBlogCount] = useState(0);

    // Import tab state
    const [jsonData, setJsonData] = useState('');
    const [importLoading, setImportLoading] = useState(false);
    const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[]; message: string } | null>(null);
    const [importError, setImportError] = useState('');

    // About Us tab state
    const defaultAboutContent: AboutUsContent = {
        title: 'About Business Talk',
        paragraphs: [
            'Business Talk is your premier podcast for cutting-edge trends, groundbreaking research, valuable insights from notable books, and engaging discussions from the realms of business and academia.',
            'Whether you\'re an academic scholar, researcher, business professional, or entrepreneur, our episodes will inspire you to question the status quo and spark actionable ideas.',
        ],
    };
    const [aboutContent, setAboutContent] = useState<AboutUsContent>(defaultAboutContent);
    const [aboutSaving, setAboutSaving] = useState(false);
    const [aboutSuccess, setAboutSuccess] = useState(false);
    const [aboutError, setAboutError] = useState<string | null>(null);
    const [aboutLoading, setAboutLoading] = useState(false);

    // Sample JSON for Import
    const SAMPLE_JSON = `[
        {
            "title": "Episode Title Here",
            "guestName": "Dr. Guest Name",
            "guestTitle": "Professor of Subject",
            "guestInstitution": "University Name",
            "youtubeUrl": "https://www.youtube.com/watch?v=...",
            "category": "past",
            "scheduledDate": "2024-12-20",
            "scheduledTime": "10:00 PM IST",
            "episodeNumber": 309,
            "description": "Episode description",
            "tags": ["tag1", "tag2"]
        }
    ]`;

    // Fetch podcasts with server-side pagination
    const fetchPodcasts = async (page: number, search: string, category: 'all' | 'upcoming' | 'past') => {
        setIsLoading(true);
        try {
            const params: { limit: number; page: number; search?: string; category?: string } = {
                limit: ITEMS_PER_PAGE,
                page,
            };
            if (search) params.search = search;
            if (category !== 'all') params.category = category;

            const [podcastsRes, statsRes] = await Promise.all([
                podcastAPI.getAll(params),
                podcastAPI.getStats(),
            ]);

            setPodcasts(podcastsRes.data.podcasts || []);
            setTotalPodcastCount(podcastsRes.data.pagination?.total || podcastsRes.data.total || podcastsRes.data.podcasts?.length || 0);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching podcasts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial podcast fetch and when page/search/filter changes
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }
        fetchPodcasts(podcastPage, podcastSearch, filter);
    }, [isAuthenticated, navigate, podcastPage, podcastSearch, filter]);

    // Fetch blogs with server-side pagination
    const fetchBlogs = async (page: number, search: string) => {
        setBlogsLoading(true);
        try {
            const [blogsRes, statsRes] = await Promise.all([
                blogAPI.getAdminAll(),  // TODO: Add pagination to blog API
                blogAPI.getStats(),
            ]);

            // Client-side filtering and pagination for blogs (until backend supports it)
            let allBlogs = blogsRes.data.blogs || [];
            if (search) {
                const searchLower = search.toLowerCase();
                allBlogs = allBlogs.filter((blog: Blog) =>
                    blog.title?.toLowerCase().includes(searchLower) ||
                    blog.category?.toLowerCase().includes(searchLower) ||
                    blog.author?.toLowerCase().includes(searchLower)
                );
            }
            setTotalBlogCount(allBlogs.length);
            const start = (page - 1) * ITEMS_PER_PAGE;
            setBlogs(allBlogs.slice(start, start + ITEMS_PER_PAGE));
            setBlogStats(statsRes.data.stats || { total: 0, published: 0, drafts: 0 });
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setBlogsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'blogs') {
            fetchBlogs(blogPage, blogSearch);
        }
    }, [activeTab, blogPage, blogSearch]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleDeletePodcast = async (id: string) => {
        if (!confirm('Are you sure you want to delete this podcast?')) return;

        setDeleteId(id);
        try {
            await podcastAPI.delete(id);
            removePodcast(id);
            setStats((prev) => ({
                ...prev,
                total: prev.total - 1,
                [podcasts.find((p) => p._id === id)?.category || 'past']:
                    prev[podcasts.find((p) => p._id === id)?.category === 'upcoming' ? 'upcoming' : 'past'] - 1,
            }));
        } catch (error) {
            console.error('Error deleting podcast:', error);
            alert('Failed to delete podcast');
        } finally {
            setDeleteId(null);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        setDeleteId(id);
        try {
            await blogAPI.delete(id);
            setBlogs((prev) => prev.filter((b) => b._id !== id));
            setBlogStats((prev) => ({
                ...prev,
                total: prev.total - 1,
            }));
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        } finally {
            setDeleteId(null);
        }
    };

    // Import tab handlers
    const handleCopySample = () => {
        navigator.clipboard.writeText(SAMPLE_JSON);
        alert('Sample JSON copied to clipboard!');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setJsonData(e.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const handleImport = async () => {
        if (!jsonData.trim()) {
            setImportError('Please enter JSON data');
            return;
        }

        try {
            JSON.parse(jsonData);
        } catch {
            setImportError('Invalid JSON format');
            return;
        }

        setImportLoading(true);
        setImportError('');
        setImportResult(null);

        try {
            const podcasts = JSON.parse(jsonData);
            const response = await importAPI.importPodcasts(podcasts);
            setImportResult(response.data);
            if (response.data.success > 0) {
                setJsonData('');
                // Refresh podcasts list
                fetchPodcasts(podcastPage, podcastSearch, filter);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setImportError(err.response?.data?.message || err.message || 'Import failed');
        } finally {
            setImportLoading(false);
        }
    };

    // About Us tab handlers
    const fetchAboutContent = async () => {
        setAboutLoading(true);
        try {
            const response = await aboutUsAPI.get();
            if (response.data) {
                setAboutContent(response.data);
            }
        } catch (error) {
            console.error('Error fetching about content:', error);
        } finally {
            setAboutLoading(false);
        }
    };

    const handleSaveAbout = async () => {
        setAboutSaving(true);
        setAboutError(null);
        setAboutSuccess(false);

        try {
            await aboutUsAPI.update(aboutContent);
            setAboutSuccess(true);
            setTimeout(() => setAboutSuccess(false), 3000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setAboutError(err.response?.data?.message || 'Failed to save');
        } finally {
            setAboutSaving(false);
        }
    };

    const handleAddParagraph = () => {
        setAboutContent(prev => ({
            ...prev,
            paragraphs: [...prev.paragraphs, ''],
        }));
    };

    const handleRemoveParagraph = (index: number) => {
        setAboutContent(prev => ({
            ...prev,
            paragraphs: prev.paragraphs.filter((_, i) => i !== index),
        }));
    };

    const handleUpdateParagraph = (index: number, value: string) => {
        setAboutContent(prev => ({
            ...prev,
            paragraphs: prev.paragraphs.map((p, i) => (i === index ? value : p)),
        }));
    };

    // Fetch about content when switching to About tab
    useEffect(() => {
        if (activeTab === 'about') {
            fetchAboutContent();
        }
    }, [activeTab]);

    // Calculate total pages from server counts (podcasts are already paginated from server)
    const totalPodcastPages = Math.ceil(totalPodcastCount / ITEMS_PER_PAGE);
    const totalBlogPages = Math.ceil(totalBlogCount / ITEMS_PER_PAGE);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleExportExcel = async (exportCategory: 'all' | 'upcoming' | 'past') => {
            setIsExporting(true);
            setExportDropdownOpen(false);
            try {
                // Fetch podcasts filtered by selected category (no pagination limit)
                const params: { category?: string } = {};
                if (exportCategory !== 'all') params.category = exportCategory;
                const response = await podcastAPI.getAll(params);
                const allPodcasts: Podcast[] = response.data.podcasts || [];
    
                // Build rows — one row per guest (or one row if no guests)
                const rows = allPodcasts.flatMap((podcast) => {
                    const guestList = podcast.guests && podcast.guests.length > 0
                        ? podcast.guests
                        : [{
                            name: podcast.guestName || '',
                            title: podcast.guestTitle || '',
                            institution: podcast.guestInstitution || '',
                            image: podcast.guestImage || '',
                            gender: podcast.guestGender || '',
                        }];
    
                    return guestList.map((guest, guestIndex) => ({
                        'Episode #': podcast.episodeNumber || '',
                        'Title': podcast.title || '',
                        'Description': podcast.description || '',
                        'Scheduled Date': podcast.scheduledDate
                            ? new Date(podcast.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '',
                        'Scheduled Time': podcast.scheduledTime || '',
                        'Guest #': guestIndex + 1,
                        'Guest Name': guest.name || '',
                        'Guest Title': guest.title || '',
                        'Guest Institution': guest.institution || '',
                        'Guest Gender': guest.gender || '',
                        'Tags': Array.isArray(podcast.tags) ? podcast.tags.join(', ') : '',
                        'YouTube URL': podcast.youtubeUrl || '',
                        'Spotify URL': podcast.spotifyUrl || '',
                        'Apple Podcasts URL': podcast.applePodcastUrl || '',
                        'Amazon Music URL': podcast.amazonMusicUrl || '',
                        'Audible URL': podcast.audibleUrl || '',
                        'SoundCloud URL': podcast.soundcloudUrl || '',
                    }));
                });
    
                // Create workbook
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(rows);
    
                // Column widths
                ws['!cols'] = [
                    { wch: 12 },  // Episode #
                    { wch: 50 },  // Title
                    { wch: 70 },  // Description
                    { wch: 18 },  // Scheduled Date
                    { wch: 18 },  // Scheduled Time
                    { wch: 10 },  // Guest #
                    { wch: 30 },  // Guest Name
                    { wch: 35 },  // Guest Title
                    { wch: 35 },  // Guest Institution
                    { wch: 14 },  // Guest Gender
                    { wch: 30 },  // Tags
                    { wch: 40 },  // YouTube URL
                    { wch: 40 },  // Spotify URL
                    { wch: 40 },  // Apple Podcasts URL
                    { wch: 40 },  // Amazon Music URL
                    { wch: 40 },  // Audible URL
                    { wch: 40 },  // SoundCloud URL
                ];
    
                XLSX.utils.book_append_sheet(wb, ws, 'Podcast Episodes');
    
                // Download
                const today = new Date().toISOString().split('T')[0];
                const categoryLabel = exportCategory === 'all' ? 'All' : exportCategory.charAt(0).toUpperCase() + exportCategory.slice(1);
                XLSX.writeFile(wb, `BusinessTalk_Podcasts_${categoryLabel}_${today}.xlsx`);
            } catch (err) {
                console.error('Error exporting podcasts:', err);
                alert('Failed to export podcasts. Please try again.');
            } finally {
                setIsExporting(false);
            }
        };

    // Navigate to a tab — updates both URL and local state
    const tabPaths: Record<ActiveTab, string> = {
        analytics: '/admin/dashboard/analytics',
        podcasts:  '/admin/dashboard/podcasts',
        blogs:     '/admin/dashboard/blogs',
        calendar:  '/admin/dashboard/calendar',
        inbox:     '/admin/dashboard/inbox',
        about:     '/admin/dashboard/pages/about',
        settings:  '/admin/dashboard/settings/general',
        import:    '/admin/dashboard/settings/import',
        pages:     '/admin/dashboard/pages/about',
    };
    const goToTab = (tab: ActiveTab) => {
        setActiveTab(tab);
        setMobileSidebarOpen(false);
        navigate(tabPaths[tab]);
    };

    // Sidebar nav item helper
    const navItemClass = (tab: ActiveTab) =>
        `group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-150 relative ${activeTab === tab
            ? 'bg-maroon-700 text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    const subNavItemClass = (tab: ActiveTab) =>
        `group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${activeTab === tab
            ? 'bg-maroon-700 text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`;

    const SidebarTooltip = ({ label }: { label: string }) => (
        sidebarCollapsed ? (
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md">
                {label}
            </span>
        ) : null
    );

    const SidebarContent = () => (
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
            {/* Analytics */}
            <button onClick={() => goToTab('analytics')} className={navItemClass('analytics')}>
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Analytics</span>}
                <SidebarTooltip label="Analytics" />
            </button>

            {/* Inbox */}
            <button onClick={() => goToTab('inbox')} className={`${navItemClass('inbox')} relative`}>
                <Mail className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Inbox</span>}
                {contactStats.unread > 0 && (
                    <span className={`${sidebarCollapsed ? 'absolute top-1 right-1' : 'ml-auto'} min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1`}>
                        {contactStats.unread}
                    </span>
                )}
                <SidebarTooltip label="Inbox" />
            </button>

            {/* Podcasts */}
            <button onClick={() => goToTab('podcasts')} className={navItemClass('podcasts')}>
                <Mic className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Podcasts</span>}
                <SidebarTooltip label="Podcasts" />
            </button>

            {/* Blogs */}
            <button onClick={() => goToTab('blogs')} className={navItemClass('blogs')}>
                <FileText className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Blogs</span>}
                <SidebarTooltip label="Blogs" />
            </button>

            {/* Calendar */}
            <button onClick={() => goToTab('calendar')} className={navItemClass('calendar')}>
                <Calendar className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Calendar</span>}
                <SidebarTooltip label="Calendar" />
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-gray-100" />

            
           {/* Pages Group Dropdown */}
             <div>
                 <button
                     onClick={() => {
                         if (sidebarCollapsed) {
                             // In collapsed mode, clicking the pages icon opens About directly
                             goToTab('about');
                         } else {
                             setPagesGroupOpen(prev => !prev);
                         }
                     }}
                     className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-150 relative ${
                         ['about'].includes(activeTab)
                             ? 'bg-maroon-50 text-maroon-700'
                             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                     }`}
                 >
                     <File className="w-5 h-5 flex-shrink-0" />
                     {!sidebarCollapsed && (
                         <>
                             <span className="flex-1 text-left">Pages</span>
                             <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${pagesGroupOpen ? 'rotate-180' : ''}`} />
                         </>
                     )}
                     <SidebarTooltip label="Settings" />
                 </button>

                 {/* Sub-items — only visible when expanded and group is open */}
                 {!sidebarCollapsed && pagesGroupOpen && (
                     <div className="mt-1 ml-3 pl-3 border-l-2 border-gray-100 space-y-0.5">
                         <button onClick={() => goToTab('about')} className={subNavItemClass('about')}>
                             <Info className="w-4 h-4 flex-shrink-0" />
                             <span>About Us</span>
                         </button>
                     </div>
                 )}
             </div>


            {/* Settings Group Dropdown */}
            <div>
                <button
                    onClick={() => {
                        if (sidebarCollapsed) {
                            // In collapsed mode, clicking the settings icon opens settings directly
                            goToTab('settings');
                        } else {
                            setSettingsGroupOpen(prev => !prev);
                        }
                    }}
                    className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-150 relative ${
                        ['settings', 'import'].includes(activeTab)
                            ? 'bg-maroon-50 text-maroon-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                        <>
                            <span className="flex-1 text-left">Settings</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${settingsGroupOpen ? 'rotate-180' : ''}`} />
                        </>
                    )}
                    <SidebarTooltip label="Settings" />
                </button>

                {/* Sub-items — only visible when expanded and group is open */}
                {!sidebarCollapsed && settingsGroupOpen && (
                    <div className="mt-1 ml-3 pl-3 border-l-2 border-gray-100 space-y-0.5">
                        <button onClick={() => goToTab('settings')} className={subNavItemClass('settings')}>
                            <Settings className="w-4 h-4 flex-shrink-0" />
                            <span>General</span>
                        </button>
                        <button onClick={() => goToTab('import')} className={subNavItemClass('import')}>
                            <Upload className="w-4 h-4 flex-shrink-0" />
                            <span>Import</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* ── DESKTOP SIDEBAR ── */}
            <aside
                className={`hidden md:flex flex-col bg-white border-r border-gray-200 fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-60'}`}
            >
                {/* Sidebar Header - Logo */}
                <div className={`flex items-center h-16 border-b border-gray-100 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'px-4 gap-3'}`}>
                    <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                        <img
                            src={logoImage}
                            alt="Business Talk Logo"
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=BT&size=200&background=800000&color=fff&bold=true'; }}
                        />
                    </Link>
                    {!sidebarCollapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">Business Talk</p>
                            <p className="text-[10px] text-gray-400 truncate">Enterprise Edition</p>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle Button */}
                <div className="p-2 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={() => setSidebarCollapsed(prev => !prev)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-maroon-100 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" />
                        <span className="text-xs">Collapse</span>
                        </>}
                    </button>
                </div>

                {/* Nav Items */}
                <SidebarContent />

            </aside>

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
                    {/* Drawer */}
                    <aside className="absolute top-0 left-0 h-full w-60 bg-white shadow-xl flex flex-col z-50">
                        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                                    <img
                                        src={logoImage}
                                        alt="Business Talk Logo"
                                        className="h-8 w-8 rounded-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=BT&size=200&background=800000&color=fff&bold=true'; }}
                                    />
                                </Link>
                                <p className="text-sm font-bold text-gray-900">Business Talk</p>
                            </div>
                            <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* ── MAIN CONTENT AREA ── */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>

                {/* Header — shared AdminHeader component */}
                <AdminHeader
                    userName={user?.name}
                    onLogout={handleLogout}
                    onMenuClick={() => setMobileSidebarOpen(true)}
                />

                {/* Page Content */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                {/* Content wrapper with fixed height to prevent jumping */}
                <div className="relative" style={{ minHeight: '800px' }}>
                
                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="tab-content-wrapper">
                        <AnalyticsDashboard
                            measurementId={episodeSettings.googleAnalyticsId}
                            propertyId={ga4PropertyId}
                            compact={false}
                        />
                    </div>
                )}

                {/* Podcasts Tab */}
                {activeTab === 'podcasts' && (
                    <div className="tab-content-wrapper">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Episodes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Upcoming</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Published</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.past}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Podcasts Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">All Podcasts</h2>
                                        <p className="text-sm text-gray-500">
                                            Showing {podcasts.length} of {totalPodcastCount} podcasts
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        {/* Filter */}
                                        <div className="flex items-center space-x-2">
                                            {(['all', 'upcoming', 'past'] as const).map((f) => (
                                                <button
                                                    key={f}
                                                    onClick={() => { setFilter(f); setPodcastPage(1); }}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === f
                                                        ? 'bg-maroon-700 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <Link
                                            to="/admin/podcast/new"
                                            className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Podcast</span>
                                        </Link>
                                        {/* Download Section */}
                                        <div className="relative">
                                            {/* Trigger Button */}
                                            <button
                                                onClick={() => setExportDropdownOpen(prev => !prev)}
                                                disabled={isExporting}
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm"
                                            >
                                                {isExporting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Exporting</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-4 h-4" />
                                                        <span>Export</span>
                                                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${exportDropdownOpen ? 'rotate-90' : ''}`} />
                                                    </>
                                                )}
                                            </button>

                                            {/* Dropdown Menu */}
                                            {exportDropdownOpen && (
                                                <>
                                                    {/* Backdrop — closes dropdown on outside click */}
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setExportDropdownOpen(false)}
                                                    />
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                                                        {([
                                                            { label: 'All Podcasts',  value: 'all'      as const },
                                                            { label: 'Upcoming Only', value: 'upcoming' as const },
                                                            { label: 'Past Only',     value: 'past'     as const },
                                                        ]).map(({ label, value }) => (
                                                            <button
                                                                key={value}
                                                                onClick={() => handleExportExcel(value)}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-maroon-50 hover:text-maroon-700 transition-colors text-left"
                                                            >
                                                                <Download className="w-4 h-4 shrink-0" />
                                                                {label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by title, guest, episode #..."
                                        value={podcastSearch}
                                        onChange={(e) => { setPodcastSearch(e.target.value); setPodcastPage(1); }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="divide-y">
                                {isLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading podcasts...</p>
                                    </div>
                                ) : podcasts.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-gray-500">{podcastSearch ? 'No podcasts match your search.' : 'No podcasts found.'}</p>
                                        {!podcastSearch && (
                                            <Link
                                                to="/admin/podcast/new"
                                                className="inline-flex items-center space-x-2 mt-4 text-maroon-700 hover:text-maroon-800"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Create your first podcast</span>
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    podcasts.map((podcast) => (
                                        <div
                                            key={podcast._id}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="text-sm font-bold text-maroon-700">
                                                            #{podcast.episodeNumber}
                                                        </span>
                                                        <span
                                                            className={`badge ${podcast.category === 'upcoming'
                                                                ? 'badge-upcoming'
                                                                : 'badge-past'
                                                                }`}
                                                        >
                                                            {podcast.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {podcast.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        Guest: {podcast.guestName} • {podcast.guestTitle}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {formatDate(podcast.scheduledDate)} • {podcast.scheduledTime}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/admin/podcast/edit/${podcast._id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeletePodcast(podcast._id)}
                                                        disabled={deleteId === podcast._id}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteId === podcast._id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPodcastPages > 1 && (
                                <div className="p-4 border-t flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Page {podcastPage} of {totalPodcastPages}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setPodcastPage(p => Math.max(1, p - 1))}
                                            disabled={podcastPage === 1}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </button>
                                        {/* Page numbers */}
                                        <div className="hidden sm:flex items-center space-x-1">
                                            {Array.from({ length: Math.min(5, totalPodcastPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPodcastPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (podcastPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (podcastPage >= totalPodcastPages - 2) {
                                                    pageNum = totalPodcastPages - 4 + i;
                                                } else {
                                                    pageNum = podcastPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPodcastPage(pageNum)}
                                                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${podcastPage === pageNum
                                                            ? 'bg-maroon-700 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setPodcastPage(p => Math.min(totalPodcastPages, p + 1))}
                                            disabled={podcastPage === totalPodcastPages}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Blogs Tab */}
                {activeTab === 'blogs' && (
                    <div className="tab-content-wrapper">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-maroon-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Blogs</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.total}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Published</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.published}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                        <EyeOff className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Drafts</p>
                                        <p className="text-2xl font-bold text-gray-900">{blogStats.drafts}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blogs Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">All Blogs</h2>
                                        <p className="text-sm text-gray-500">
                                            Showing {blogs.length} of {totalBlogCount} blogs
                                        </p>
                                    </div>
                                    <Link
                                        to="/admin/blog/new"
                                        className="flex items-center space-x-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Blog</span>
                                    </Link>
                                </div>
                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by title, category, author..."
                                        value={blogSearch}
                                        onChange={(e) => { setBlogSearch(e.target.value); setBlogPage(1); }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="divide-y">
                                {blogsLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading blogs...</p>
                                    </div>
                                ) : blogs.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-gray-500">{blogSearch ? 'No blogs match your search.' : 'No blogs found.'}</p>
                                        {!blogSearch && (
                                            <Link
                                                to="/admin/blog/new"
                                                className="inline-flex items-center space-x-2 mt-4 text-maroon-700 hover:text-maroon-800"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Create your first blog post</span>
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    blogs.map((blog) => (
                                        <div
                                            key={blog._id}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                            {blog.category}
                                                        </span>
                                                        {blog.isPublished ? (
                                                            <span className="flex items-center gap-1 text-xs text-green-600">
                                                                <Eye className="w-3 h-3" /> Published
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-xs text-yellow-600">
                                                                <EyeOff className="w-3 h-3" /> Draft
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                                                        {blog.excerpt}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        By {blog.author} • {formatDate(blog.createdAt)} • {blog.readTime}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/admin/blog/edit/${blog._id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                        disabled={deleteId === blog._id}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteId === blog._id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalBlogPages > 1 && (
                                <div className="p-4 border-t flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Page {blogPage} of {totalBlogPages}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                                            disabled={blogPage === 1}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </button>
                                        {/* Page numbers */}
                                        <div className="hidden sm:flex items-center space-x-1">
                                            {Array.from({ length: Math.min(5, totalBlogPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalBlogPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (blogPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (blogPage >= totalBlogPages - 2) {
                                                    pageNum = totalBlogPages - 4 + i;
                                                } else {
                                                    pageNum = blogPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setBlogPage(pageNum)}
                                                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${blogPage === pageNum
                                                            ? 'bg-maroon-700 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setBlogPage(p => Math.min(totalBlogPages, p + 1))}
                                            disabled={blogPage === totalBlogPages}
                                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* About Us Tab */}
                {activeTab === 'about' && (
                    <div className="tab-content-wrapper">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Info className="w-6 h-6 text-maroon-700" />
                            Edit About Us Content
                        </h2>

                        {aboutLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-maroon-700" />
                            </div>
                        ) : (
                            <>
                                {/* Title */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={aboutContent.title}
                                        onChange={(e) => setAboutContent(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Paragraphs */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Paragraphs
                                    </label>
                                    <div className="space-y-6">
                                        {aboutContent.paragraphs.map((paragraph, index) => (
                                            <div key={index} className="relative">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs text-gray-500 mt-3 w-6">{index + 1}.</span>
                                                    <div className="flex-1">
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={paragraph}
                                                            onChange={(value: string) => handleUpdateParagraph(index, value)}
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
                                                            placeholder={`Enter paragraph ${index + 1}...`}
                                                        />
                                                    </div>
                                                    {aboutContent.paragraphs.length > 1 && (
                                                        <button
                                                            onClick={() => handleRemoveParagraph(index)}
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
                                    <button
                                        onClick={handleAddParagraph}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 text-maroon-700 border border-maroon-700 rounded-lg hover:bg-maroon-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Paragraph
                                    </button>
                                </div>

                                {/* Error/Success Messages */}
                                {aboutError && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                        <XCircle className="w-5 h-5" />
                                        {aboutError}
                                    </div>
                                )}
                                {aboutSuccess && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                                        <CheckCircle className="w-5 h-5" />
                                        About Us content saved successfully!
                                    </div>
                                )}

                                {/* Save Button */}
                                <button
                                    onClick={handleSaveAbout}
                                    disabled={aboutSaving}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {aboutSaving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="tab-content-wrapper">
                    <div className="space-y-6">
                        {/* System Health Section */}
                        <div
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Activity className="w-6 h-6 text-maroon-700" />
                                    System Status
                                </h2>
                                <button
                                    onClick={checkSystemHealth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Refresh Status"
                                >
                                    <RefreshCw className={`w-5 h-5 text-gray-600 ${healthLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Server className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-gray-700">Backend API</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className={`text-sm font-medium ${systemHealth?.status === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
                                            {systemHealth?.status === 'ok' ? 'Operational' : 'Unreachable'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Database className="w-5 h-5 text-gray-600" />
                                        <span className="font-medium text-gray-700">Database</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${systemHealth?.database?.state === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className={`text-sm font-medium ${systemHealth?.database?.state === 'connected' ? 'text-green-700' : 'text-red-700'}`}>
                                            {systemHealth?.database?.state === 'connected' ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MongoDB Atlas Cluster Status */}
                        {/* <div
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Database className="w-6 h-6 text-green-600" />
                                    MongoDB Atlas Cluster
                                </h2>
                                <button
                                    onClick={fetchMongoCluster}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Refresh Cluster Status"
                                >
                                    <RefreshCw className={`w-5 h-5 text-gray-600 ${mongoLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {mongoLoading && !mongoCluster ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                                </div>
                            ) : mongoCluster ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">Cluster Name</p>
                                        <p className="font-semibold text-gray-900">{mongoCluster.name}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">MongoDB Version</p>
                                        <p className="font-semibold text-gray-900">{mongoCluster.mongoDBVersion}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">State</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${mongoCluster.stateName === 'IDLE' ? 'bg-green-500' : mongoCluster.stateName === 'CREATING' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                            <span className={`font-semibold ${mongoCluster.stateName === 'IDLE' ? 'text-green-700' : mongoCluster.stateName === 'CREATING' ? 'text-yellow-700' : 'text-red-700'}`}>
                                                {mongoCluster.stateName === 'IDLE' ? 'Running' : mongoCluster.stateName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">Region</p>
                                        <p className="font-semibold text-gray-900">{mongoCluster.providerSettings?.regionName || 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    {mongoError ? (
                                        <>
                                            <p className="text-red-600 font-medium">Error: {mongoError}</p>
                                            {mongoError.includes('401') && (
                                                <div className="mt-4 text-left bg-red-50 p-4 rounded text-sm text-gray-700">
                                                    <p className="font-bold mb-2">How to fix 401 Unauthorized:</p>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Go to <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">MongoDB Atlas Dashboard</a></li>
                                                        <li>Click <strong>Access Manager</strong> {'>'} <strong>Project Access</strong></li>
                                                        <li>Find your API Key <strong>({(mongoCluster as any)?.publicKey || '...'})</strong></li>
                                                        <li>Click <strong>Edit</strong> {'>'} <strong>Access List</strong></li>
                                                        <li>Add Entry: <code>0.0.0.0/0</code> (Allow from anywhere)</li>
                                                        <li>Save changes and wait 1 minute</li>
                                                    </ul>
                                                    <p className="mt-2 text-xs text-gray-500">Note: This is required because Render servers use dynamic IPs.</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p>MongoDB Atlas credentials not configured or cluster unavailable.</p>
                                            <p className="text-sm mt-1">Configure MONGO_PUBLIC_KEY, MONGO_PRIVATE_KEY, and MONGO_PROJECT_ID in backend environment.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div> */}


                        {/* Episode Loading Configuration */}
                        <div
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                                Episode Loading Configuration
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Configure how many episodes are displayed initially and loaded on scroll for the home page.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Upcoming Episodes */}
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Upcoming Episodes
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Initial Load
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="50"
                                                value={episodeSettings.upcomingInitialLoad}
                                                onChange={(e) => setEpisodeSettings(prev => ({
                                                    ...prev,
                                                    upcomingInitialLoad: parseInt(e.target.value) || 4
                                                }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Episodes on page load</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Scroll Batch
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="50"
                                                value={episodeSettings.upcomingBatchSize}
                                                onChange={(e) => setEpisodeSettings(prev => ({
                                                    ...prev,
                                                    upcomingBatchSize: parseInt(e.target.value) || 4
                                                }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Episodes per scroll</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Past Episodes */}
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Past Episodes
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Initial Load
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="50"
                                                value={episodeSettings.pastInitialLoad}
                                                onChange={(e) => setEpisodeSettings(prev => ({
                                                    ...prev,
                                                    pastInitialLoad: parseInt(e.target.value) || 4
                                                }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Episodes on page load</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Scroll Batch
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="50"
                                                value={episodeSettings.pastBatchSize}
                                                onChange={(e) => setEpisodeSettings(prev => ({
                                                    ...prev,
                                                    pastBatchSize: parseInt(e.target.value) || 6
                                                }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Episodes per scroll</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Google Analytics Configuration */}
                        <div
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-orange-600" />
                                Google Analytics
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Track website traffic and user behavior.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Measurement ID (G-XXXXXXXXXX)
                                    </label>
                                    <input
                                        type="text"
                                        value={episodeSettings.googleAnalyticsId || ''}
                                        onChange={(e) => setEpisodeSettings(prev => ({
                                            ...prev,
                                            googleAnalyticsId: e.target.value
                                        }))}
                                        placeholder="G-XXXXXXXXXX"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Enter your Google Analytics 4 Measurement ID to enable tracking.
                                    </p>
                                </div>
                                {/* NEW: GA4 Property ID field for Data API */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        GA4 Property ID <span className="text-gray-400 font-normal">(numeric, for live analytics data)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={ga4PropertyId}
                                        onChange={(e) => {
                                            setGa4PropertyId(e.target.value);
                                            localStorage.setItem('ga4PropertyId', e.target.value);
                                        }}
                                        placeholder="123456789"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Find this in GA4 Admin &rarr; Property Settings &rarr; Property ID.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Analytics Dashboard - compact summary in Settings tab */}
                        <AnalyticsDashboard measurementId={episodeSettings.googleAnalyticsId} propertyId={ga4PropertyId} compact={true} />

                        {/* MongoDB Configuration */}

                        {/* Save Button with Error Display */}
                        <div className="space-y-4">
                            {settingsError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                    <XCircle className="w-5 h-5" />
                                    {settingsError}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    onClick={saveSettings}
                                    disabled={settingsSaving}
                                    className="px-6 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {settingsSaving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : settingsSaved ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Saved!
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Configuration
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Recent Deployments */}
                        <div className="space-y-6">
                            <DeploymentsTable deployments={frontendDeployments} title="Frontend" />
                            <DeploymentsTable deployments={backendDeployments} title="Backend" />
                        </div>
                    </div>
                    </div>
                )
                }

                {/* Inbox Tab */}
                {activeTab === 'inbox' && (
                    <div className="tab-content-wrapper">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Messages</p>
                                        <p className="text-2xl font-bold text-gray-900">{contactStats.total}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Unread</p>
                                        <p className="text-2xl font-bold text-gray-900">{contactStats.unread}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <MailOpen className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Read</p>
                                        <p className="text-2xl font-bold text-gray-900">{contactStats.read}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Archived</p>
                                        <p className="text-2xl font-bold text-gray-900">{contactStats.archived}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Section */}
                        <div className="bg-white rounded-xl shadow-sm">
                            {/* Header */}
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Contact Messages</h2>
                                        <p className="text-sm text-gray-500">Messages from your contact form</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {/* <button
                                            // onClick={handleRefresh}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg"
                                        >
                                            <ArrowUpIcon  className="w-5 h-5" />
                                        </button> */}

                                        {(['all', 'unread', 'read', 'archived'] as const).map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setMessageFilter(f)}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${messageFilter === f
                                                    ? 'bg-maroon-700 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="divide-y">
                                {messagesLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-maroon-700 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No messages found</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <div
                                            key={message._id}
                                            className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${message.status === 'unread' ? 'bg-blue-50' : ''
                                                }`}
                                            onClick={() => {
                                                if (message.status === 'unread') {
                                                    handleMarkAsRead(message._id);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        {message.status === 'unread' && (
                                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                        )}
                                                        <h3 className={`font-semibold text-gray-900 ${message.status === 'unread' ? 'font-bold' : ''
                                                            }`}>
                                                            {message.name}
                                                        </h3>
                                                        <span className="text-sm text-gray-400">
                                                            {new Date(message.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{message.message}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteMessage(message._id);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Import Tab */}
                {activeTab === 'import' && (
                    <div className="tab-content-wrapper">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileJson className="w-6 h-6 text-maroon-700" />
                            Import Podcasts
                        </h2>

                        {/* Sample JSON Format */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">JSON Format</h3>
                            <p className="text-gray-600 text-sm mb-3">
                                Paste a JSON array of podcasts to import. Each podcast should have the following fields:
                            </p>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                <pre className="text-sm font-mono whitespace-pre-wrap">{SAMPLE_JSON}</pre>
                            </div>
                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={handleCopySample}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Sample
                                </button>
                                <button
                                    onClick={() => setJsonData(SAMPLE_JSON)}
                                    className="flex items-center gap-2 px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                >
                                    Load Sample
                                </button>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Upload JSON File (optional)</h3>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-maroon-700 file:text-white hover:file:bg-maroon-800"
                            />
                        </div>

                        {/* JSON Input */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Or paste JSON directly</h3>
                            <textarea
                                value={jsonData}
                                onChange={(e) => setJsonData(e.target.value)}
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                                placeholder="Paste your JSON here..."
                            />
                        </div>

                        {/* Error Message */}
                        {importError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                <XCircle className="w-5 h-5" />
                                {importError}
                            </div>
                        )}

                        {/* Success Result */}
                        {importResult && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Import Complete
                                </div>
                                <p className="text-sm text-green-600">
                                    Successfully imported {importResult.success} podcasts.
                                    {importResult.failed > 0 && ` Failed: ${importResult.failed}`}
                                </p>
                                {importResult.errors.length > 0 && (
                                    <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                                        {importResult.errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Import Button */}
                        <button
                            onClick={handleImport}
                            disabled={importLoading || !jsonData.trim()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {importLoading ? (
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
                    </div>
                    </div>
                )}

                {/* Calendar Tab */}
                {activeTab === 'calendar' && (() => {
                    const calYear = calCurrentDate.getFullYear();
                    const calMonth = calCurrentDate.getMonth();
                    const calDaysInMonth = calGetDaysInMonth(calYear, calMonth);
                    const calFirstDay = calGetFirstDay(calYear, calMonth);
                    const calToday = new Date();
                    const calIsCurrentMonth = calToday.getMonth() === calMonth && calToday.getFullYear() === calYear;
                    const calDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const calendarDays: (number | null)[] = [];
                    for (let i = 0; i < calFirstDay; i++) calendarDays.push(null);
                    for (let d = 1; d <= calDaysInMonth; d++) calendarDays.push(d);

                    return (
                        <div className="tab-content-wrapper">
                            {calLoading ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <Calendar className="w-12 h-12 mx-auto text-maroon-600 animate-pulse" />
                                    <p className="mt-4 text-gray-600">Loading calendar...</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm">
                                    {/* Card Header */}
                                    <div className="p-6 border-b">
                                        <h2 className="text-lg font-bold text-gray-900">Podcast Calendar</h2>
                                        <p className="text-sm text-gray-500">View all {calPodcasts.length} podcast episodes by date</p>
                                    </div>

                                    <div className="p-6">
                                        {/* Month Controls */}
                                        <div className="flex items-center justify-between mb-6">
                                            <button onClick={calPrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-xl font-semibold text-gray-900">{calFormatMonth(calCurrentDate)}</h2>
                                                <button
                                                    onClick={calGoToToday}
                                                    className="px-3 py-1 text-sm bg-maroon-100 text-maroon-700 rounded-full hover:bg-maroon-200 transition-colors"
                                                >
                                                    Today
                                                </button>
                                            </div>
                                            <button onClick={calNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="border rounded-lg overflow-hidden">
                                            {/* Day Name Row */}
                                            <div className="grid grid-cols-7 bg-gray-50 border-b">
                                                {calDayNames.map(day => (
                                                    <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">{day}</div>
                                                ))}
                                            </div>

                                            {/* Day Cells */}
                                            <div className="grid grid-cols-7">
                                                {calendarDays.map((day, index) => {
                                                    const dayPodcasts = day ? calGetPodcastsForDate(day) : [];
                                                    const isToday = calIsCurrentMonth && day === calToday.getDate();
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`p-2 border-b border-r ${day ? 'bg-white' : 'bg-gray-50'} ${isToday ? 'bg-maroon-50' : ''}`}
                                                            style={{ minHeight: '120px', height: '120px' }}
                                                        >
                                                            {day && (
                                                                <>
                                                                    <span className={`inline-flex items-center justify-center w-7 h-7 text-sm ${isToday ? 'bg-maroon-600 text-white rounded-full font-bold' : 'text-gray-700'}`}>
                                                                        {day}
                                                                    </span>
                                                                    <div className="mt-1 space-y-1">
                                                                        {dayPodcasts.slice(0, 3).map(podcast => {
                                                                            const isPast = new Date(podcast.scheduledDate) < calToday;
                                                                            return (
                                                                                <button
                                                                                    key={podcast._id}
                                                                                    onClick={() => setCalSelectedPodcast(podcast)}
                                                                                    className={`w-full text-left px-2 py-1 rounded text-xs truncate ${isPast ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-maroon-100 text-maroon-700 hover:bg-maroon-200'}`}
                                                                                >
                                                                                    EP {podcast.episodeNumber}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                        {dayPodcasts.length > 3 && (
                                                                            <span className="text-xs text-gray-500 px-2">+{dayPodcasts.length - 3} more</span>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Legend */}
                                        <div className="mt-6 flex gap-6 justify-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 bg-maroon-100 rounded"></span>
                                                <span className="text-gray-600">Upcoming</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 bg-gray-100 rounded"></span>
                                                <span className="text-gray-600">Past</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Podcast Detail Modal */}
                            {calSelectedPodcast && (
                                <div
                                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                                    onClick={() => setCalSelectedPodcast(null)}
                                >
                                    <div
                                        className="bg-white rounded-xl shadow-xl max-w-lg w-full flex flex-col"
                                        style={{ maxHeight: '90vh' }}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {/* Modal Header */}
                                        <div className="flex justify-between items-start p-6 pb-4 border-b flex-shrink-0">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${new Date(calSelectedPodcast.scheduledDate) < calToday ? 'bg-gray-100 text-gray-700' : 'bg-maroon-100 text-maroon-700'}`}>
                                                Episode {calSelectedPodcast.episodeNumber} — {new Date(calSelectedPodcast.scheduledDate) < calToday ? 'Past' : 'Upcoming'}
                                            </span>
                                            <button onClick={() => setCalSelectedPodcast(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                                        </div>

                                        {/* Scrollable Content */}
                                        <div className="overflow-y-auto flex-1 px-6 py-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">{calSelectedPodcast.title}</h3>
                                            <div className="space-y-3 text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 flex-shrink-0" />
                                                    <span>{calSelectedPodcast.guestName} — {calSelectedPodcast.guestTitle}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                                    <span>{new Date(calSelectedPodcast.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                                    <span>{calSelectedPodcast.scheduledTime}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">{calSelectedPodcast.description}</p>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="p-6 pt-4 border-t flex-shrink-0">
                                            <div className="flex gap-3">
                                                <Link
                                                    to={`/admin/podcast/edit/${calSelectedPodcast._id}`}
                                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-maroon-600 text-white font-semibold rounded-lg hover:bg-maroon-700 transition-colors"
                                                >
                                                    Edit Episode
                                                </Link>
                                                {calSelectedPodcast.youtubeUrl && new Date(calSelectedPodcast.scheduledDate) < calToday && (
                                                    <a
                                                        href={calSelectedPodcast.youtubeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Watch
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })()}


                </div>
                </main>
            </div>
        </div>
    );
}