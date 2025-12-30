import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';

// Platform URLs
const PLATFORM_URLS = {
    youtube: 'https://www.youtube.com/@businesstalkwithdeepakbhatt',
    applePodcasts: 'https://podcasts.apple.com/us/podcast/business-talk/id1596076450',
    amazonMusic: 'https://music.amazon.in/podcasts/1803c906-ea83-406b-82c6-fcacd13873af/business-talk',
    audible: 'https://www.audible.in/podcast/Business-Talk/B0DC5NTGMS?qid=1723093390&sr=1-1',
    spotify: 'https://open.spotify.com/show/3IB2aXm9eZkLiSVaUZEQuK?si=M_9QZ3AlSC65B9HIMYXbmg',
    soundcloud: 'https://soundcloud.com/business_talk',
};

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src={logoImage}
                                alt="Business Talk Logo"
                                className="w-12 h-12 object-contain rounded-full"
                            />
                            <span className="text-xl font-bold text-white">
                                Business Talk
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-md text-justify leading-relaxed">
                            Your premier podcast for cutting-edge trends, groundbreaking research,
                            valuable insights from notable books, and engaging discussions from the
                            realms of business and academia.
                        </p>
                    </div>

                    {/* Quick Links - Only Home, Blog, Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Listen On - All platform logos */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Listen On</h3>
                        <div className="space-y-3">
                            <a
                                href={PLATFORM_URLS.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Official YouTube Logo */}
                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span>YouTube</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.applePodcasts}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Apple Podcasts - Microphone icon */}
                                <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                    <circle cx="12" cy="9.5" r="2.5" />
                                    <path d="M12 14c-.552 0-1 .448-1 1v3.5a1 1 0 002 0V15c0-.552-.448-1-1-1z" />
                                </svg>
                                <span>Apple Podcasts</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.amazonMusic}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Amazon Music - Music note */}
                                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                                </svg>
                                <span>Amazon Music</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.audible}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Audible - Headphones icon */}
                                <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 1C7.03 1 3 5.03 3 10v8c0 1.66 1.34 3 3 3h1v-9H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-2v9h1c1.66 0 3-1.34 3-3v-8c0-4.97-4.03-9-9-9zM7 14v6H6c-.55 0-1-.45-1-1v-5h2zm12 5c0 .55-.45 1-1 1h-1v-6h2v5z" />
                                </svg>
                                <span>Audible</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Spotify */}
                                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                <span>Spotify</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.soundcloud}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* SoundCloud - Cloud icon */}
                                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                                </svg>
                                <span>SoundCloud</span>
                            </a>
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
                    </div>
                </div>
            </div>
        </footer>
    );
}
