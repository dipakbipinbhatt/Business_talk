// Original SVG logos for podcast platforms

interface LogoProps {
    className?: string;
}

export const YouTubeLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

export const SpotifyLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.44 1.56.42.24.599.84.301 1.261zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
);

export const ApplePodcastsLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 5.455c-1.8 0-3.273 1.472-3.273 3.272S10.2 12 12 12s3.273-1.473 3.273-3.273S13.8 5.455 12 5.455zm0 7.636c-.9 0-1.636.737-1.636 1.637v3.817c0 .9.736 1.637 1.636 1.637s1.636-.737 1.636-1.637v-3.817c0-.9-.736-1.637-1.636-1.637z" />
    </svg>
);

export const AmazonMusicLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.2 17.328c-.037-.039-.076-.076-.076-.152 0-.076.039-.114.153-.114.19 0 .419.076.609.076.532 0 .799-.19.799-.685v-6.08c0-.533-.114-.761-.646-.875-.076-.02-.152-.039-.152-.133 0-.076.038-.114.114-.133.761-.133 1.294-.305 1.827-.495.076-.02.133-.02.171.038.038.076.02.133.02.21v7.582c0 .495.267.685.8.685.189 0 .418-.076.608-.076.114 0 .152.038.152.114 0 .076-.038.113-.114.152-.494.267-.988.456-1.521.456-.533 0-.951-.152-1.218-.456-.762.304-1.333.456-1.903.456-.57-.001-1.065-.19-1.598-.57zm18.933-.228c-.038.038-.076.076-.152.076-.076 0-.114-.038-.152-.114-.343-.495-.647-.913-1.065-1.331-.609.762-1.104 1.332-1.979 1.332-.913 0-1.445-.647-1.445-1.522 0-.875.456-1.446 1.141-1.979.647-.494 1.408-.837 2.169-1.179v-.951c0-1.141-.228-2.017-1.256-2.017-.456 0-.837.152-1.103.457-.267.304-.381.647-.381 1.103 0 .152.076.266.076.418 0 .342-.228.532-.532.532-.305 0-.533-.228-.533-.532 0-.456.267-.913.685-1.255.457-.381 1.104-.609 1.789-.609 1.293 0 2.206.609 2.206 2.017v3.158c0 .609.152.951.571 1.446.076.038.076.114.076.19-.001.113-.039.151-.115.227zm-2.168-3.576c-.723.342-1.484.685-1.979 1.179-.304.266-.495.608-.495 1.065 0 .608.304.989.837.989.608 0 1.027-.419 1.407-.914.113-.152.228-.342.228-.533l.002-1.786zM8.053 13.143c0 1.598.647 2.893 2.092 2.893.647 0 1.179-.228 1.598-.685.495-.495.685-1.141.761-1.789.02-.114.076-.19.19-.19h.381c.114 0 .19.076.19.19v2.739c0 .114-.076.152-.152.152h-.38c-.114 0-.19-.076-.19-.19v-.495c-.571.533-1.218.876-2.017.876-1.864 0-2.968-1.484-2.968-3.615 0-2.13 1.179-3.576 3.044-3.576.837 0 1.522.304 2.093.951.114.152.076.228-.038.342l-.19.19c-.076.076-.152.076-.228 0-.456-.494-.951-.761-1.522-.761-1.218.001-2.664.875-2.664 2.968zm13.055-8.77c0 .99-.803 1.793-1.793 1.793s-1.793-.803-1.793-1.793.803-1.793 1.793-1.793 1.793.803 1.793 1.793z" />
    </svg>
);

export const AudibleLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.232 16.8c-.48.384-1.152.288-1.536-.192-.24-.24-.384-.576-.384-.912 0-.24.048-.48.192-.672.72-.96 1.104-2.112 1.104-3.36 0-2.976-2.352-5.376-5.28-5.472h-.528c-2.928.096-5.28 2.496-5.28 5.472 0 1.248.384 2.4 1.104 3.36.144.192.192.432.192.672 0 .336-.144.672-.384.912-.384.48-1.056.576-1.536.192C3.72 15.072 2.976 13.344 2.976 11.52c0-4.992 4.032-9.024 9.024-9.024s9.024 4.032 9.024 9.024c0 1.824-.744 3.552-1.792 5.28z" />
    </svg>
);

export const SoundCloudLogo = ({ className = "w-6 h-6" }: LogoProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.084-.1zm-.899 1.065c-.051 0-.094.037-.106.094l-.154 1.189.154 1.143c.012.057.055.094.106.094s.092-.037.106-.094l.209-1.143-.21-1.189c-.013-.057-.055-.094-.105-.094zm1.79-.756c-.067 0-.12.047-.12.119l-.209 2.021.209 1.973c0 .072.053.119.12.119.069 0 .124-.047.124-.119l.234-1.973-.234-2.021c0-.072-.055-.119-.124-.119zm.915-.451c-.084 0-.149.057-.149.134l-.191 2.127.191 2.07c0 .079.065.136.149.136.084 0 .151-.057.151-.136l.216-2.07-.216-2.127c0-.077-.067-.134-.151-.134zm.949-.27c-.094 0-.169.069-.169.156l-.176 2.208.176 2.126c0 .089.075.157.169.157.096 0 .171-.068.171-.157l.2-2.126-.2-2.208c0-.087-.075-.156-.171-.156zm.977-.222c-.109 0-.196.078-.196.173l-.161 2.274.161 2.156c0 .095.087.175.196.175.108 0 .194-.08.194-.175l.185-2.156-.185-2.274c0-.095-.086-.173-.194-.173zm1.016-.138c-.123 0-.221.089-.221.199l-.145 2.313.145 2.189c0 .108.098.2.221.2.123 0 .218-.092.218-.2l.168-2.189-.168-2.313c0-.11-.095-.199-.218-.199zm5.818 1.028c-.21 0-.406.031-.59.089-.122-1.381-1.289-2.462-2.711-2.462-.35 0-.689.066-1.003.186-.119.046-.15.093-.15.186v4.871c0 .097.076.178.171.186h4.283c.997 0 1.811-.814 1.811-1.818s-.814-1.838-1.811-1.838zm-4.798-.625c-.136 0-.238.101-.238.215l-.13 2.423.13 2.23c0 .116.102.215.238.215.133 0 .236-.099.236-.215l.148-2.23-.148-2.423c0-.114-.103-.215-.236-.215zm-1.023.149c-.121 0-.217.09-.217.204l-.143 2.285.143 2.205c0 .114.096.205.217.205.122 0 .219-.091.219-.205l.164-2.205-.164-2.285c0-.114-.097-.204-.219-.204z" />
    </svg>
);

// Platform button component with proper logos
interface PlatformButtonProps {
    platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud';
    url: string;
    label: string;
    className?: string;
}

export const PlatformButton = ({ platform, url, label, className = "" }: PlatformButtonProps) => {
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700', Logo: YouTubeLogo },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600', Logo: SpotifyLogo },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', Logo: ApplePodcastsLogo },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', Logo: AmazonMusicLogo },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', Logo: AudibleLogo },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', Logo: SoundCloudLogo },
    };

    const config = platformConfig[platform];
    const { Logo } = config;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center space-x-1.5 px-3 py-2 ${config.bg} text-white rounded-lg ${config.hover} transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${className}`}
        >
            <Logo className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold text-xs">{label}</span>
        </a>
    );
};

// Small icon version for footer and cards
export const PlatformIcon = ({ platform, url, size = "md" }: { platform: 'youtube' | 'spotify' | 'apple' | 'amazon' | 'audible' | 'soundcloud', url: string, size?: 'sm' | 'md' | 'lg' }) => {
    const platformConfig = {
        youtube: { bg: 'bg-red-600', hover: 'hover:bg-red-700', Logo: YouTubeLogo },
        spotify: { bg: 'bg-green-500', hover: 'hover:bg-green-600', Logo: SpotifyLogo },
        apple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', Logo: ApplePodcastsLogo },
        amazon: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', Logo: AmazonMusicLogo },
        audible: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', Logo: AudibleLogo },
        soundcloud: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', Logo: SoundCloudLogo },
    };

    const sizeConfig = {
        sm: { circle: 'w-6 h-6', icon: 'w-3 h-3' },
        md: { circle: 'w-12 h-12', icon: 'w-7 h-7' },
        lg: { circle: 'w-16 h-16', icon: 'w-9 h-9' },
    };

    const config = platformConfig[platform];
    const sizes = sizeConfig[size];
    const { Logo } = config;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizes.circle} rounded-full ${config.bg} ${config.hover} flex items-center justify-center transition-colors shadow-lg flex-shrink-0`}
        >
            <Logo className={`${sizes.icon} text-white`} />
        </a>
    );
};

