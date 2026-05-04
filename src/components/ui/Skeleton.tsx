import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'rect' | 'circle' | 'text';
    width?: string | number;
    height?: string | number;
}

const Skeleton = ({ className = '', variant = 'rect', width, height }: SkeletonProps) => {
    const baseStyles = "bg-slate-200 animate-pulse-slow relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

    const variantStyles = {
        rect: "rounded-lg",
        circle: "rounded-full",
        text: "rounded h-4 w-full",
    };

    const style: React.CSSProperties = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
