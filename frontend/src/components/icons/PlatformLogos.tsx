// Image assets for platform logos
import youtubeLogo from '../../assets/platforms/youtube.png';
import spotifyLogo from '../../assets/platforms/spotify.png';
import appleLogo from '../../assets/platforms/apple-podcasts.png';
import amazonLogo from '../../assets/platforms/amazon-music.png';
import audibleLogo from '../../assets/platforms/audible.jpg';
import soundcloudLogo from '../../assets/platforms/soundcloud.png';

// Map platform to image
const PLATFORM_IMAGES = {
    youtube: youtubeLogo,
    spotify: spotifyLogo,
    apple: appleLogo,
    amazon: amazonLogo,
    audible: audibleLogo,
    soundcloud: soundcloudLogo,
};

interface PlatformButtonProps {
    platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud';
    url: string;
    label: string;
    className?: string;
}

export const PlatformButton = ({ platform, url, label, className = "" }: PlatformButtonProps) => {
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700', shadow: 'hover:shadow-red-600/50' },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600', shadow: 'hover:shadow-green-500/50' },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', shadow: 'hover:shadow-purple-600/50' },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', shadow: 'hover:shadow-blue-500/50' },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', shadow: 'hover:shadow-orange-500/50' },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', shadow: 'hover:shadow-orange-600/50' },
    };

    const config = platformConfig[platform];
    const imageSrc = PLATFORM_IMAGES[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-row items-center justify-center gap-2 px-3 py-1.5 min-w-[125px] ${config.bg} text-white rounded-md ${config.hover} transition-all duration-200 shadow-md ${config.shadow} hover:scale-105 flex-shrink-0 ${className}`}
        >
            <div className="bg-white/95 rounded p-0.5 flex items-center justify-center">
                <img
                    src={imageSrc}
                    alt={`${label} logo`}
                    className="w-5 h-5 object-contain"
                    loading="lazy"
                />
            </div>
            <span className="font-semibold text-xs whitespace-nowrap">{label}</span>
        </a>
    );
};

// Small icon version for footer and cards
export const PlatformIcon = ({ platform, url, size = "md" }: { platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud', url: string, size?: 'sm' | 'md' | 'lg' }) => {
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700', shadow: 'hover:shadow-red-600/50' },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600', shadow: 'hover:shadow-green-500/50' },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', shadow: 'hover:shadow-purple-600/50' },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', shadow: 'hover:shadow-blue-500/50' },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', shadow: 'hover:shadow-orange-500/50' },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', shadow: 'hover:shadow-orange-600/50' },
    };

    const sizeConfig = {
        sm: { circle: 'w-12 h-12', icon: 'w-7 h-7', padding: 'p-2' },
        md: { circle: 'w-16 h-16', icon: 'w-9 h-9', padding: 'p-2.5' },
        lg: { circle: 'w-20 h-20', icon: 'w-12 h-12', padding: 'p-3' },
    };

    const config = platformConfig[platform];
    const sizes = sizeConfig[size];
    const imageSrc = PLATFORM_IMAGES[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizes.circle} rounded-full ${config.bg} ${config.hover} flex items-center justify-center transition-all duration-300 shadow-lg ${config.shadow} hover:scale-110 hover:shadow-xl flex-shrink-0`}
        >
            <div className={`bg-white/95 rounded-full ${sizes.padding} flex items-center justify-center shadow-md backdrop-blur-sm`}>
                <img
                    src={imageSrc}
                    alt={`${platform} logo`}
                    className={`${sizes.icon} object-contain`}
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                    loading="lazy"
                />
            </div>
        </a>
    );
};

