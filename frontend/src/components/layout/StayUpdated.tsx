import { motion } from 'framer-motion';
import { PlatformButton } from '../icons/PlatformLogos';

// Platform URLs
const PLATFORM_URLS = {
    youtube: 'https://www.youtube.com/@businesstalkwithdeepakbhatt',
    applePodcasts: 'https://podcasts.apple.com/us/podcast/business-talk/id1596076450',
    amazonMusic: 'https://music.amazon.in/podcasts/1803c906-ea83-406b-82c6-fcacd13873af/business-talk',
    audible: 'https://www.audible.in/podcast/Business-Talk/B0DC5NTGMS?qid=1723093390&sr=1-1',
    spotify: 'https://open.spotify.com/show/3IB2aXm9eZkLiSVaUZEQuK?si=M_9QZ3AlSC65B9HIMYXbmg',
    soundcloud: 'https://soundcloud.com/business_talk',
};

export default function StayUpdated() {
    return (
        <section className="py-16 px-4 bg-gradient-to-r from-maroon-900 to-maroon-800 text-white relative overflow-hidden">
            {/* Background Pattern similar to Podcast Hero */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Stay Updated with Our <span className="text-gold-400">Latest Episodes</span>
                    </h2>
                    <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                        Subscribe to Business Talk on your favorite podcast platform and never miss an episode.
                    </p>
                    <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-3 lg:gap-3 max-w-7xl mx-auto overflow-x-auto pb-2">
                        <PlatformButton platform="youtube" url={PLATFORM_URLS.youtube} label="YouTube" />
                        <PlatformButton platform="apple" url={PLATFORM_URLS.applePodcasts} label="Apple Podcasts" />
                        <PlatformButton platform="spotify" url={PLATFORM_URLS.spotify} label="Spotify" />
                        <PlatformButton platform="amazon" url={PLATFORM_URLS.amazonMusic} label="Amazon Music" />
                        <PlatformButton platform="audible" url={PLATFORM_URLS.audible} label="Audible" />
                        <PlatformButton platform="soundcloud" url={PLATFORM_URLS.soundcloud} label="SoundCloud" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
