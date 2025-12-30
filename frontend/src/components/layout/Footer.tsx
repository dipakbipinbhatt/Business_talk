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
                                <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 5.455c-1.8 0-3.273 1.472-3.273 3.272S10.2 12 12 12s3.273-1.473 3.273-3.273S13.8 5.455 12 5.455zm0 7.636c-.9 0-1.636.737-1.636 1.637v3.817c0 .9.736 1.637 1.636 1.637s1.636-.737 1.636-1.637v-3.817c0-.9-.736-1.637-1.636-1.637z" />
                                </svg>
                                <span>Apple Podcasts</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.amazonMusic}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.439-2.186 1.439-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.684zm3.186 7.705a.66.66 0 01-.753.076c-1.057-.878-1.247-1.286-1.827-2.124-1.747 1.782-2.983 2.315-5.244 2.315-2.676 0-4.76-1.651-4.76-4.957 0-2.58 1.396-4.337 3.383-5.193 1.722-.753 4.128-.89 5.967-1.097v-.409c0-.753.057-1.642-.384-2.292-.385-.577-1.125-.816-1.775-.816-1.206 0-2.281.618-2.544 1.899-.054.285-.262.566-.549.58l-3.072-.331c-.259-.057-.546-.266-.472-.66C5.97 1.391 9.259 0 12.188 0c1.5 0 3.458.398 4.64 1.534 1.5 1.397 1.356 3.26 1.356 5.291v4.792c0 1.441.6 2.076 1.163 2.856.2.277.244.61-.011.813-.639.536-1.778 1.533-2.405 2.09l.013-.581zM21.779 20.553C19.39 22.327 15.86 23.254 12.797 23.254c-4.333 0-8.236-1.602-11.19-4.267-.231-.209-.024-.495.254-.333 3.188 1.854 7.127 2.97 11.2 2.97 2.746 0 5.764-.568 8.543-1.746.42-.179.77.274.375.675zm1.072-1.219c-.314-.404-2.085-.19-2.88-.095-.241.028-.278-.182-.061-.336 1.411-.99 3.725-.704 3.994-.373.27.333-.071 2.64-1.394 3.742-.204.17-.398.08-.307-.145.298-.745.965-2.399.648-2.793z" />
                                </svg>
                                <span>Amazon Music</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.audible}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.232 16.8c-.48.384-1.152.288-1.536-.192-.24-.24-.384-.576-.384-.912 0-.24.048-.48.192-.672.72-.96 1.104-2.112 1.104-3.36 0-2.976-2.352-5.376-5.28-5.472h-.528c-2.928.096-5.28 2.496-5.28 5.472 0 1.248.384 2.4 1.104 3.36.144.192.192.432.192.672 0 .336-.144.672-.384.912-.384.48-1.056.576-1.536.192C3.72 15.072 2.976 13.344 2.976 11.52c0-4.992 4.032-9.024 9.024-9.024s9.024 4.032 9.024 9.024c0 1.824-.744 3.552-1.792 5.28z" />
                                </svg>
                                <span>Audible</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.soundcloud}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.084-.1zm-.899 1.065c-.051 0-.094.037-.106.094l-.154 1.189.154 1.143c.012.057.055.094.106.094s.092-.037.106-.094l.209-1.143-.21-1.189c-.013-.057-.055-.094-.105-.094zm1.79-.756c-.067 0-.12.047-.12.119l-.209 2.021.209 1.973c0 .072.053.119.12.119.069 0 .124-.047.124-.119l.234-1.973-.234-2.021c0-.072-.055-.119-.124-.119zm.915-.451c-.084 0-.149.057-.149.134l-.191 2.127.191 2.07c0 .079.065.136.149.136.084 0 .151-.057.151-.136l.216-2.07-.216-2.127c0-.077-.067-.134-.151-.134zm.949-.27c-.094 0-.169.069-.169.156l-.176 2.208.176 2.126c0 .089.075.157.169.157.096 0 .171-.068.171-.157l.2-2.126-.2-2.208c0-.087-.075-.156-.171-.156zm.977-.222c-.109 0-.196.078-.196.173l-.161 2.274.161 2.156c0 .095.087.175.196.175.108 0 .194-.08.194-.175l.185-2.156-.185-2.274c0-.095-.086-.173-.194-.173zm1.016-.138c-.123 0-.221.089-.221.199l-.145 2.313.145 2.189c0 .108.098.2.221.2.123 0 .218-.092.218-.2l.168-2.189-.168-2.313c0-.11-.095-.199-.218-.199zm5.818 1.028c-.21 0-.406.031-.59.089-.122-1.381-1.289-2.462-2.711-2.462-.35 0-.689.066-1.003.186-.119.046-.15.093-.15.186v4.871c0 .097.076.178.171.186h4.283c.997 0 1.811-.814 1.811-1.818s-.814-1.838-1.811-1.838zm-4.798-.625c-.136 0-.238.101-.238.215l-.13 2.423.13 2.23c0 .116.102.215.238.215.133 0 .236-.099.236-.215l.148-2.23-.148-2.423c0-.114-.103-.215-.236-.215zm-1.023.149c-.121 0-.217.09-.217.204l-.143 2.285.143 2.205c0 .114.096.205.217.205.122 0 .219-.091.219-.205l.164-2.205-.164-2.285c0-.114-.097-.204-.219-.204z" />
                                </svg>
                                <span>SoundCloud</span>
                            </a>
                            <a
                                href={PLATFORM_URLS.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                <span>Spotify</span>
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
