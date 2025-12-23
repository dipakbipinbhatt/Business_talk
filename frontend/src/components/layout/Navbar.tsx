import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PODCAST', path: '/', active: true },
    { name: 'BLOG', path: '/blog' },
    { name: 'CONTACT', path: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 glass shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img
                            src="https://static.wixstatic.com/media/70d1c9_f0f4073d229d4e559e4cc6cea217ea88~mv2.png/v1/fill/w_200,h_202,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Trademarked%20Logo.png"
                            alt="Business Talk Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-xl font-bold heading-serif text-maroon-700">
                            Business Talk
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors duration-200 hover:text-maroon-700 ${link.active || location.pathname === link.path
                                    ? 'text-maroon-700 border-b-2 border-maroon-700 pb-1'
                                    : 'text-gray-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/admin/login"
                            className="px-4 py-2 text-sm font-medium text-white bg-maroon-700 rounded-lg hover:bg-maroon-800 transition-colors"
                        >
                            Admin Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-4 py-4 space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-2 rounded-lg font-medium ${link.active || location.pathname === link.path
                                        ? 'bg-maroon-50 text-maroon-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/admin/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 text-center font-medium text-white bg-maroon-700 rounded-lg hover:bg-maroon-800"
                            >
                                Admin Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
