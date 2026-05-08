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

    // For external URLs or data URLs, use plain img tag for reliability
    if (isExternal || isDataUrl) {
        const imgStyle: React.CSSProperties = fill
            ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }
            : {};
        if (!fill && width) imgStyle.width = width;
        if (!fill && height) imgStyle.height = height;

        return (
            <img
                src={src}
                alt={alt}
                className={className}
                onError={handleError}
                onClick={onClick}
                style={imgStyle}
                {...props}
            />
        );
    }

    // For local images, use Next.js Image
    if (fill) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes || '100vw'}
                    style={{ objectFit: 'cover' }}
                    priority={priority}
                    unoptimized
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
            unoptimized
            onError={handleError}
            onClick={onClick}
            {...props}
        />
    );
}

export default AppImage;

