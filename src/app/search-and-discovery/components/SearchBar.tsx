'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search for freelancers, skills, or projects..." }: SearchBarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            type="text"
            className="w-full h-14 pl-14 pr-32 rounded-xl border-2 border-border bg-card text-foreground font-body text-base focus:outline-none focus:border-primary transition-all duration-300"
            placeholder={placeholder}
            readOnly
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon name="MagnifyingGlassIcon" size={24} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-14 pl-14 pr-32 rounded-xl border-2 bg-card text-foreground font-body text-base focus:outline-none transition-all duration-300 ${
            isFocused ? 'border-primary shadow-brand-lg' : 'border-border'
          }`}
          placeholder={placeholder}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Icon 
            name="MagnifyingGlassIcon" 
            size={24} 
            className={`transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} 
          />
        </div>
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;