'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    [key: string]: any;
}

function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    fill = false,
    sizes,
    onClick,
    fallbackSrc,
    ...props
}: AppImageProps) {
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
    };

    // If no src, or image errored, show initials avatar
    if (!src || hasError) {
        const initial = alt ? alt[0]?.toUpperCase() : '?';
        return (
            <div
                className={`${className} bg-gradient-to-br from-[#1B365D] to-[#2E5984] flex items-center justify-center`}
                onClick={onClick}
                style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
            >
                <span className="text-white font-bold text-2xl">{initial}</span>
            </div>
        );
    }

    const isExternal = src.startsWith('http://') || src.startsWith('https://');
    const isDataUrl = src.startsWith('data:');

    // List of domains configured in next.config.mjs for optimization
    const OPTIMIZED_DOMAINS = [
        'images.unsplash.com',
        'images.pexels.com',
        'images.pixabay.com',
        'img.rocket.new',
        'lh3.googleusercontent.com',
        'res.cloudinary.com'
    ];

    let isOptimizedDomain = false;
    if (isExternal) {
        try {
            const url = new URL(src);
            isOptimizedDomain = OPTIMIZED_DOMAINS.includes(url.hostname);
        } catch (e) {
            isOptimizedDomain = false;
        }
    }

    // For data URLs or unoptimized external domains, use plain img tag
    if (isDataUrl || (isExternal && !isOptimizedDomain)) {
        return (
            <img
                src={src}
                alt={alt}
                className={className}
                onError={handleError}
                onClick={onClick}
                style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : { width, height }}
                {...props}
            />
        );
    }

    // For local and whitelisted external images, use Next.js Image
    if (fill) {
        return (
            <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                    style={{ objectFit: 'cover' }}
                    priority={priority}
                    quality={quality}
                    onError={handleError}
                    onClick={onClick}
                    {...props}
                />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={width || 400}
            height={height || 300}
            className={className}
            priority={priority}
            quality={quality}
            onError={handleError}
            onClick={onClick}
            {...props}
        />
    );
}

export default AppImage;

