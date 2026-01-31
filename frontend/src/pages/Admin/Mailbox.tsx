import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';
import {
    Mail,
    MailOpen,
    Archive,
    Trash2,
    LogOut,
    Mic,
    FileText,
    Calendar,
    Upload,
    Settings,
    Info,
    Loader2,
    X,
    Clock,
    User,
    RefreshCw,
    Inbox,
} from 'lucide-react';
import { contactAPI, ContactMessage } from '../../services/api';
import { useAuthStore } from '../../store/useStore';

type FilterType = 'all' | 'unread' | 'read' | 'archived';

export default function Mailbox() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, archived: 0 });
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }
        fetchMessages();
        fetchStats();
    }, [isAuthenticated, navigate, filter]);

    // Set page title
    useEffect(() => {
        document.title = "Business Talk | Mailbox";
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await contactAPI.getMessages(params);
            setMessages(response.data.messages);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await contactAPI.getStats();
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleMessageClick = async (message: ContactMessage) => {
        setSelectedMessage(message);

        // Mark as read if unread
        if (message.status === 'unread') {
            try {
                await contactAPI.markAsRead(message._id);
                setMessages(prev =>
                    prev.map(m => m._id === message._id ? { ...m, status: 'read' as const } : m)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
                fetchStats();
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        }
    };

    const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'archived') => {
        try {
            await contactAPI.updateStatus(id, status);
            setMessages(prev =>
                prev.map(m => m._id === id ? { ...m, status } : m)
            );
            if (selectedMessage?._id === id) {
                setSelectedMessage(prev => prev ? { ...prev, status } : null);
            }
            fetchStats();
            if (filter !== 'all') {
                fetchMessages();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        setDeleteId(id);
        try {
            await contactAPI.delete(id);
            setMessages(prev => prev.filter(m => m._id !== id));
            if (selectedMessage?._id === id) {
                setSelectedMessage(null);
            }
            fetchStats();
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        } finally {
            setDeleteId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins