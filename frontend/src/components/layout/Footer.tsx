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
                                {/* Official Apple Podcasts Logo */}
                                <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.604-.314 1.179-.932 1.179-.46 0-.884-.313-.976-.771-.252-1.239-.697-2.218-1.51-3.006-1.39-1.394-3.19-2.104-5.014-2.028-1.89.079-3.541.9-4.764 2.203-1.264 1.347-1.925 3.17-1.866 5.14.093 3.085 2.005 5.61 4.79 6.583.075.027.148.07.22.121.468.327.458 1.036-.024 1.413-.316.248-.737.283-1.077.127-3.591-1.452-5.88-5.153-5.88-9.086 0-2.343.942-4.669 2.64-6.465a9.168 9.168 0 016.073-2.89zm.117 3.727c3.258.1 5.749 2.667 5.749 5.926 0 1.405-.483 2.775-1.365 3.895-.34.432-.972.512-1.418.188-.387-.28-.504-.794-.26-1.198.632-.954.96-2.045.96-3.143 0-2.324-1.652-4.325-3.913-4.735-.4-.072-.756-.367-.756-.774 0-.454.388-.835.843-.805a5.9 5.9 0 01.16.004zm-.12 9.722c.04 0 .08.002.12.008.774.077 1.366.743 1.366 1.523v4.538c0 .843-.683 1.526-1.526 1.526s-1.526-.683-1.526-1.526v-4.538c0-.843.683-1.526 1.526-1.526zm0-5.404c1.64 0 2.974 1.334 2.974 2.974s-1.334 2.974-2.974 2.974-2.974-1.334-2.974-2.974 1.334-2.974 2.974-2.974z" />
                                </svg>
                                <span>Apple Podcasts</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.amazonMusic}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Official Amazon Music Logo */}
                                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.436 18.42c-3.102 2.21-7.732 3.396-11.676 3.396C2.547 21.816 0 19.73 0 16.728c0-.653.072-1.296.216-1.92.073-.288.29-.432.505-.432.144 0 .29.072.433.144 2.45 1.368 5.838 2.088 8.939 2.088 2.234 0 4.467-.36 6.557-1.08.144-.072.288-.072.432-.072.36 0 .648.288.648.648 0 .288-.144.576-.432.72-.504.288-1.08.576-1.656.864-.36.144-.792.288-1.152.432.504.216.936.504 1.296.864.504.504.792 1.152.792 1.872 0 .288-.072.576-.144.864zM12 0C5.376 0 0 5.376 0 12c0 2.304.648 4.464 1.8 6.264.072.144.216.216.36.216.072 0 .144 0 .216-.072.216-.144.288-.432.144-.648C1.368 15.84.792 13.968.792 12 .792 5.808 5.808.792 12 .792S23.208 5.808 23.208 12c0 1.968-.576 3.84-1.728 5.472-.144.216-.072.504.144.648.072.072.144.072.216.072.144 0 .288-.072.36-.216C23.352 16.176 24 14.016 24 12 24 5.376 18.624 0 12 0z" />
                                </svg>
                                <span>Amazon Music</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.audible}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Official Audible Logo */}
                                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.586 17.586c-.39.39-1.024.39-1.414 0L12 15.414l-2.172 2.172c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414L10.586 14 8.414 11.828c-.39-.39-.39-1.024 0-1.414s1.024-.39 1.414 0L12 12.586l2.172-2.172c.39-.39 1.024-.39 1.414 0s.39 1.024 0 1.414L13.414 14l2.172 2.172c.39.39.39 1.024 0 1.414zM12 4.8c3.978 0 7.2 3.222 7.2 7.2s-3.222 7.2-7.2 7.2-7.2-3.222-7.2-7.2 3.222-7.2 7.2-7.2z" />
                                </svg>
                                <span>Audible</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                {/* Official Spotify Logo */}
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
                                {/* Official SoundCloud Logo */}
                                <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.084-.1zm-.899 1.065c-.051 0-.094.037-.106.094l-.154 1.189.154 1.143c.012.057.055.094.106.094s.092-.037.106-.094l.209-1.143-.21-1.189c-.013-.057-.055-.094-.105-.094zm1.79-.756c-.067 0-.12.047-.12.119l-.209 2.021.209 1.973c0 .072.053.119.12.119.069 0 .124-.047.124-.119l.234-1.973-.234-2.021c0-.072-.055-.119-.124-.119zm.915-.451c-.084 0-.149.057-.149.134l-.191 2.127.191 2.07c0 .079.065.136.149.136.084 0 .151-.057.151-.136l.216-2.07-.216-2.127c0-.077-.067-.134-.151-.134zm.949-.27c-.094 0-.169.069-.169.156l-.176 2.208.176 2.126c0 .089.075.157.169.157.096 0 .171-.068.171-.157l.2-2.126-.2-2.208c0-.087-.075-.156-.171-.156zm.977-.222c-.109 0-.196.078-.196.173l-.161 2.274.161 2.156c0 .095.087.175.196.175.108 0 .194-.08.194-.175l.185-2.156-.185-2.274c0-.095-.086-.173-.194-.173zm1.016-.138c-.123 0-.221.089-.221.199l-.145 2.313.145 2.189c0 .108.098.2.221.2.123 0 .218-.092.218-.2l.168-2.189-.168-2.313c0-.11-.095-.199-.218-.199zm5.818 1.028c-.21 0-.406.031-.59.089-.122-1.381-1.289-2.462-2.711-2.462-.35 0-.689.066-1.003.186-.119.046-.15.093-.15.186v4.871c0 .097.076.178.171.186h4.283c.997 0 1.811-.814 1.811-1.818s-.814-1.838-1.811-1.838zm-4.798-.625c-.136 0-.238.101-.238.215l-.13 2.423.13 2.23c0 .116.102.215.238.215.133 0 .236-.099.236-.215l.148-2.23-.148-2.423c0-.114-.103-.215-.236-.215zm-1.023.149c-.121 0-.217.09-.217.204l-.143 2.285.143 2.205c0 .114.096.205.217.205.122 0 .219-.091.219-.205l.164-2.205-.164-2.285c0-.114-.097-.204-.219-.204z" />
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
