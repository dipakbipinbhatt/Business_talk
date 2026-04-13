/**
 * AdminHeader — shared header for all admin pages.
 *
 * Used by: Dashboard, PodcastForm, BlogForm, AboutEditor,
 *          AdminCalendar, ImportPage.
 *
 * Props
 * ─────
 * userName      – display name shown under "Admin Dashboard"
 * onLogout      – called when the Logout button is clicked
 * onMenuClick   – (optional) hamburger click handler; only Dashboard
 *                 passes this because it controls the mobile sidebar.
 *                 Other pages don't need a sidebar toggle.
 * sticky        – (optional, default true) make header sticky top-0
 */

import { Link } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import logoImage from '../../assets/logo.jpg';

interface AdminHeaderProps {
    userName?: string;
    onLogout: () => void;
    onMenuClick?: () => void;
    sticky?: boolean;
}

export default function AdminHeader({
    userName,
    onLogout,
    onMenuClick,
    sticky = true,
}: AdminHeaderProps) {
    return (
        <header
            className={`bg-white shadow-sm z-10 ${sticky ? 'sticky top-0' : ''}`}
        >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Left — hamburger (mobile sidebar toggle) + branding */}
                    <div className="flex items-center space-x-3">
                        {/* Hamburger: only rendered when a handler is supplied (Dashboard) */}
                        {onMenuClick && (
                            <button
                                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                                onClick={onMenuClick}
                                aria-label="Open navigation menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}

                        {/* Logo — links back to dashboard */}
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center space-x-3 shrink-0"
                        >
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="h-10 w-10 object-contain rounded-full"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://ui-avatars.com/api/?name=BT&size=200&background=800000&color=fff&bold=true';
                                }}
                            />
                        </Link>

                        <div>
                            <h1 className="text-base font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            {userName && (
                                <p className="text-xs text-gray-400">
                                    Welcome, {userName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right — View Site + Logout */}
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:block text-sm text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            View Site
                        </Link>

                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}