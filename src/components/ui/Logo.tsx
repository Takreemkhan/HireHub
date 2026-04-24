import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = '', showText = true }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`}>
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <rect width="40" height="40" rx="8" fill="#1B365D" />
          <path
            d="M12 28V12H18C19.6569 12 21 13.3431 21 15V15C21 16.6569 19.6569 18 18 18H12"
            stroke="#FF6B35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M20 28V18H26C27.6569 18 29 19.3431 29 21V21C29 22.6569 27.6569 24 26 24H20"
            stroke="#4299E1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <div>
          <span className="text-xl font-display font-bold text-primary tracking-tight">
            FreelanceHub
          </span>
          <span className="text-xl font-display font-bold text-accent ml-1">
            Pro
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;