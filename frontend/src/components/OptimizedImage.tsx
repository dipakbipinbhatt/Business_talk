import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    placeholder?: string;
    quality?: number;
}

/**
 * OptimizedImage component with lazy loading and blur placeholder
 * - Uses native browser lazy loading
 * - Shows blur placeholder while loading
 * - Handles loading errors gracefully
 */
export default function OptimizedImage({
    src,
    alt,
    className = '',
    width,
    height,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==',
    quality = 80,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [imageSrc, setImageSrc] = useState(placeholder);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Reset state when src changes
        setIsLoaded(false);
        setError(false);
        setImageSrc(placeholder);

        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Optimize external image URLs with quality parameter
                        let optimizedSrc = src;

                        // For Unsplash images, add quality and format parameters
                        if (src.includes('unsplash.com')) {
                            const url = new URL(src);
                            url.searchParams.set('q', quality.toString());
                            url.searchParams.set('fm', 'webp');
                            url.searchParams.set('auto', 'format');
                            if (width) url.searchParams.set('w', width.toString());
                            if (height) url.searchParams.set('h', height.toString());
                            optimizedSrc = url.toString();
                        }

                        setImageSrc(optimizedSrc);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.1,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [src, placeholder, quality, width, height]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setError(true);
        setImageSrc(placeholder);
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                ref={imgRef}
                src={imageSrc}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
            />
            {/* Blur placeholder overlay */}
            <div
                className={`absolute inset-0 bg-gray-200 transition-opacity duration-300 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                style={{
                    backgroundImage: `url(${placeholder})`,
                    backgroundSize: 'cover',
                    filter: 'blur(10px)',
                }}
            />
            {/* Loading shimmer effect */}
            {!isLoaded && !error && (
                <div className="absolute inset-0 skeleton" />
            )}
        </div>
    );
}

/**
 * Utility function to generate optimized image URLs
 */
export function getOptimizedImageUrl(
    src: string,
    options: { width?: number; height?: number; quality?: number } = {}
): string {
    const { width, height, quality = 80 } = options;

    // Handle Unsplash images
    if (src.includes('unsplash.com')) {
        const url = new URL(src);
        url.searchParams.set('q', quality.toString());
        url.searchParams.set('fm', 'webp');
        url.searchParams.set('auto', 'format');
        if (width) url.searchParams.set('w', width.toString());
        if (height) url.searchParams.set('h', height.toString());
        return url.toString();
    }

    return src;
}
