'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface SearchResult {
  id: string;
  type: 'freelancer' | 'project';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  price?: string;
  location?: string;
  availability?: string;
  featured?: boolean;
  bids?: number;
  averageBid?: string;
  budget?: string;
  isNew?: boolean;
  postedAt?: string;
}

interface SearchResultCardProps {
  result: SearchResult;
  onSave: (id: string) => void;
  isSaved: boolean;
  onClick: (result: SearchResult) => void;
}

const SearchResultCard = ({ result, onSave, isSaved, onClick }: SearchResultCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Stop propagation for save button to avoid triggering card click
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(result.id);
  };

  return (
    <div
      id={`job-${result.id}`}
      onClick={() => onClick(result)}
      className="bg-card rounded-none border-b border-border p-6 hover:bg-muted/30 transition-all duration-200 cursor-pointer group first:rounded-t-xl last:rounded-b-xl last:border-b-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Header Line: Title, Bids, Price */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h3 className="text-2xl font-display font-semibold text-primary group-hover:underline decoration-2 underline-offset-2">
                  {result.title}
                </h3>
                {result.featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-[0_2px_12px_rgba(249,115,22,0.45)] border border-orange-300/40 flex-shrink-0">
                    <svg className="w-3.5 h-3.5 fill-white flex-shrink-0" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 flex-shrink-0 ml-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-3 text-lg">
                  {result.bids !== undefined && (
                    <span className="font-medium text-foreground text-base">{result.bids} bids</span>
                  )}
                  {result.averageBid && (
                    <span className="font-bold text-foreground text-xl">{result.averageBid}</span>
                  )}
                  {!result.averageBid && result.price && (
                    <span className="font-bold text-foreground text-xl">{result.price}</span>
                  )}
                </div>
                {(result.averageBid || result.bids) && <span className="text-sm text-muted-foreground">average bid</span>}
              </div>
              <button
                onClick={handleSave}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-accent transition-colors mt-0.5"
              >
                <Icon
                  name="BookmarkIcon"
                  size={24}
                  variant={isSaved ? "solid" : "outline"}
                  className={isSaved ? "text-accent" : ""}
                />
              </button>
            </div>
          </div>

          {/* Subheader: Budget, New Badge */}
          <div className="flex items-center gap-3 text-base text-muted-foreground font-medium">
            <span>Budget {result.budget || result.price}</span>
            {result.isNew && (
              <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-primary text-primary-foreground">
                New
              </span>
            )}
          </div>

          {/* Description Excerpt */}
          <p className="text-base font-body text-foreground line-clamp-2 md:line-clamp-3 leading-relaxed">
            {result.description}
          </p>

          {/* Footer: Tags and Time */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-y-2">
            <div className="flex flex-wrap items-center gap-2 text-primary text-base">
              {result.tags.map((tag, i) => (
                <span key={i} className="hover:underline cursor-pointer">{tag}</span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    name="StarIcon"
                    size={16}
                    variant={i < Math.round(result.rating) ? "solid" : "outline"}
                  />
                ))}
                <span className="text-foreground ml-1">{result.rating.toFixed(1)}</span>
              </div>
              <span>{result.reviewCount} reviews</span>
              <span className="pl-2 border-l border-border">{result.postedAt || 'Recently'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
