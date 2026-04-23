import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';
import { Mail, Globe, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <Link to="/" className="flex items-center space-x-3 hover:text-white transition-colors">
                                <img
                                    src={logoImage}
                                    alt="Business Talk Logo"
                                    className="w-12 h-12 object-contain rounded-full"
                                />
                                <span className="text-xl font-bold text-white">
                                    Business Talk
                                </span>
                            </Link>
                        </div>
                        <p className="text-gray-400 max-w-md text-justify leading-relaxed">
                            Your premier podcast for cutting-edge trends, groundbreaking research,
                            valuable insights from notable books, and engaging discussions from the
                            realms of business and academia.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-start md:items-center text-left md:text-center">
                        <div className="text-left w-full max-w-[140px]">
                            <h3 className="text-white font-semibold mb-4">Quick Links</h3>

                            <ul className="space-y-2 list-none p-0 m-0">
                                <li>
                                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/podcasts" className="text-gray-400 hover:text-white transition-colors">
                                        Podcast Library
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Details</h3>

                        <div className="space-y-5">

                            {/* Email */}
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-maroon-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-maroon-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email Us</p>
                                    <a
                                        href="mailto:hellomrbhatt@gmail.com"
                                        className="hover:underline text-sm"
                                    >
                                        hellomrbhatt@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Website */}
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-maroon-100 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-maroon-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Website</p>
                                    <a
                                        href="https://www.deepakbbhatt.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline text-sm"
                                    >
                                        www.deepakbbhatt.com
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-maroon-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-maroon-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Location</p>
                                    <p className="text-gray-300 text-sm">
                                        Ahmedabad, Gujarat (India)
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-sm text-gray-500">
                            © 2026 Business Talk. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-500">
                            Made with <span role="img" aria-label="heart">❤️</span> |{" "}
                            <a
                            href="https://gfuturetech.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300 transition"
                            >
                            GFutureTech Pvt. Ltd.
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
