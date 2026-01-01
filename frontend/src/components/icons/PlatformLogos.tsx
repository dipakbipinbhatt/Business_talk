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
            className={`group inline-flex items-center gap-3 px-5 py-3 ${config.bg} text-white rounded-lg ${config.hover} transition-all duration-300 shadow-lg ${config.shadow} hover:scale-105 ${className}`}
        >
            <div className="bg-white rounded-md p-1.5 flex items-center justify-center shadow-inner">
                <img
                    src={imageSrc}
                    alt={`${label} logo`}
                    className="w-6 h-6 object-contain"
                />
            </div>
            <span className="font-bold text-sm whitespace-nowrap tracking-wide">{label}</span>
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
        sm: { circle: 'w-10 h-10', icon: 'w-6 h-6', padding: 'p-1.5' },
        md: { circle: 'w-14 h-14', icon: 'w-8 h-8', padding: 'p-2' },
        lg: { circle: 'w-20 h-20', icon: 'w-12 h-12', padding: 'p-2.5' },
    };

    const config = platformConfig[platform];
    const sizes = sizeConfig[size];
    const imageSrc = PLATFORM_IMAGES[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizes.circle} rounded-full ${config.bg} ${config.hover} flex items-center justify-center transition-all duration-300 shadow-lg ${config.shadow} hover:scale-110 flex-shrink-0`}
        >
            <div className={`bg-white rounded-full ${sizes.padding} flex items-center justify-center shadow-inner`}>
                <img
                    src={imageSrc}
                    alt={`${platform} logo`}
                    className={`${sizes.icon} object-contain`}
                />
            </div>
        </a>
    );
};

