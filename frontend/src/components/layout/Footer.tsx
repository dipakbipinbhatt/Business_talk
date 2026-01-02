import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.jpg';
import youtubeLogo from '../../assets/platforms/youtube.png';
import spotifyLogo from '../../assets/platforms/spotify.png';
import appleLogo from '../../assets/platforms/apple-podcasts.png';
import amazonLogo from '../../assets/platforms/amazon-music.png';
import audibleLogo from '../../assets/platforms/audible.jpg';
import soundcloudLogo from '../../assets/platforms/soundcloud.png';

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

                    {/* Listen On - Original Platform Logos */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Listen On</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <a
                                href={PLATFORM_URLS.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg p-2 hover:scale-110 transition-transform shadow-md"
                                title="YouTube"
                            >
                                <img src={youtubeLogo} alt="YouTube" className="w-full h-8 object-contain" />
                            </a>
                            <a
                                href={PLATFORM_URLS.applePodcasts}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg p-2 hover:scale-110 transition-transform shadow-md"
                                title="Apple Podcasts"
                            >
                                <img src={appleLogo} alt="Apple Podcasts" className="w-full h-8 object-contain" />
                            </a>
                            <a
                                href={PLATFORM_URLS.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg p-2 hover:scale-110 transition-transform shadow-md"
                                title="Spotify"
                            >
                                <img src={spotifyLogo} alt="Spotify" className="w-full h-8 object-contain" />
                            </a>
                            <a
                                href={PLATFORM_URLS.amazonMusic}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg p-2 hover:scale-110 transition-transform shadow-md"
                                title="Amazon Music"
                            >
                                <img src={amazonLogo} alt="Amazon Music" className="w-full h-8 object-contain" />
                            </a>
                            <a
                                href={PLATFORM_URLS.audible}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg p-2 hover:scale-110 transition-transform shadow-md"
                                title="Audible"
                            >
                                <img src={audibleLogo} alt="Audible" className="w-full h-8 object-contain" />
                            </a>
                            <a
                                href={PLATFORM_URLS.soundcloud}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg p-2 hover:scale-110 transition-transform shadow-md"
                                title="SoundCloud"
                            >
                                <img src={soundcloudLogo} alt="SoundCloud" className="w-full h-8 object-contain" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
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
