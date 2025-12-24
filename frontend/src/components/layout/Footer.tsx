import { Youtube, ExternalLink } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-xl font-bold heading-serif text-white">
                                Business Talk
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            Your premier podcast for cutting-edge trends, groundbreaking research,
                            valuable insights from notable books, and engaging discussions from the
                            realms of business and academia.
                        </p>
                        <p className="mt-4 text-sm text-gray-500">
                            Brought to you by{' '}
                            <a
                                href="https://www.globalmanagementconsultancy.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-maroon-400 hover:text-maroon-300"
                            >
                                Global Management Consultancy
                            </a>
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="hover:text-white transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/" className="hover:text-white transition-colors">
                                    Podcast Episodes
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="hover:text-white transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="hover:text-white transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Listen On */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Listen On</h3>
                        <div className="space-y-3">
                            <a
                                href="https://www.youtube.com/@BusinessTalk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <Youtube className="w-5 h-5 text-red-500" />
                                <span>YouTube</span>
                            </a>
                            <a
                                href="https://open.spotify.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                <span>Spotify</span>
                            </a>
                            <a
                                href="https://podcasts.apple.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59-.26 1.166-.85 1.286a1.077 1.077 0 01-1.283-.853c-.263-1.32-.789-2.373-1.713-3.332-1.932-2.004-4.978-2.49-7.42-1.18-1.852 1.003-3.126 2.96-3.126 5.228 0 1.028.253 2.036.736 2.934.161.299.353.573.588.857.312.374.39.88.185 1.32-.203.44-.646.726-1.132.726l-.067-.002a1.159 1.159 0 01-.967-.652c-.386-.593-.622-1.16-.823-1.75-.247-.721-.38-1.48-.391-2.254 0-2.953 1.633-5.625 4.22-7.047a7.956 7.956 0 013.723-.96zm-.143 3.344c1.292 0 2.524.513 3.46 1.445a4.985 4.985 0 011.408 3.68c-.054.742-.214 1.414-.516 2.132-.184.439-.64.706-1.13.66a1.115 1.115 0 01-.985-1.353c.226-.67.307-1.16.304-1.622a2.823 2.823 0 00-.817-2.088 2.834 2.834 0 00-4.042 0 2.873 2.873 0 00-.828 2.14c0 .673.19 1.328.548 1.906.328.528.145 1.22-.408 1.543-.18.105-.38.159-.58.159a1.136 1.136 0 01-.972-.54v-.001a5.22 5.22 0 01-.972-3.056c-.001-1.401.528-2.715 1.492-3.698a4.83 4.83 0 013.538-1.407zm-.104 4.08c.742 0 1.345.603 1.345 1.346v5.324a2.67 2.67 0 01-.25 1.123l-.008.016-.005.01-.039.076a2.735 2.735 0 01-2.143 1.44c-.395.04-.79-.017-1.15-.166l-.023-.01a2.694 2.694 0 01-.658-.39l-.01-.008a2.655 2.655 0 01-.994-2.07V13.8l.001-.022a2.656 2.656 0 012.588-2.44l.022-.001h.022c.253 0 .508-.016.775-.016.098 0 .197.164.293.326.05.085.1.172.145.238.005.008.01.014.015.02.087.116.22.29.43.29.097 0 .195-.051.29-.2.1-.157.17-.354.24-.55.04-.108.078-.216.12-.32.05-.12.098-.238.15-.346l.002-.006a1.16 1.16 0 01-.158-.097z" />
                                </svg>
                                <span>Apple Podcasts</span>
                            </a>
                            <a
                                href="https://music.amazon.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-white transition-colors"
                            >
                                <ExternalLink className="w-5 h-5 text-blue-400" />
                                <span>Amazon Music</span>
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
                            © {currentYear} Business Talk. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-500">
                            Brought to you by Deepak Bhatt & Global Management Consultancy
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
