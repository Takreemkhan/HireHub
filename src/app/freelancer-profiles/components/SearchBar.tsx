// 'use client';

// import React, { useState, useEffect } from 'react';
// import Icon from '@/components/ui/AppIcon';

// interface SearchBarProps {
//   onSearch: (query: string) => void;
// }

// const SearchBar = ({ onSearch }: SearchBarProps) => {
//   const [isHydrated, setIsHydrated] = React.useState(false);
//   const [searchQuery, setSearchQuery] = React.useState('');

//   React.useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isHydrated) return;
//     onSearch(searchQuery);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//   };

//   return (
//     <form onSubmit={handleSearch} className="w-full">
//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//           <Icon name="MagnifyingGlassIcon" size={20} className="text-muted-foreground" />
//         </div>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={handleInputChange}
//           disabled={!isHydrated}
//           placeholder="Search by skills, name, or expertise..."
//           className="w-full pl-12 pr-32 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 disabled:opacity-50"
//         />
//         <button
//           type="submit"
//           disabled={!isHydrated}
//           className="absolute inset-y-0 right-0 mr-2 px-6 bg-primary text-primary-foreground rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
//         >
//           <span className="hidden sm:inline">Search</span>
//           <Icon name="ArrowRightIcon" size={18} />
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SearchBar;

'use client';

import React, { useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setIsHydrated(true); }, []);

  // Live search: fire after 400 ms of no typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);
  };

  // Immediate search on form submit (Enter / button click)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHydrated) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch(searchQuery);
  };

  // Clear button
  const handleClear = () => {
    setSearchQuery('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="MagnifyingGlassIcon" size={20} className="text-muted-foreground" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          disabled={!isHydrated}
          placeholder="Search by skills, name, or expertise…"
          className="w-full pl-12 pr-32 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 disabled:opacity-50"
        />

        {/* Clear button — only shown when there's text */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-24 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <Icon name="XMarkIcon" size={18} />
          </button>
        )}

        {/* Search button */}
        <button
          type="submit"
          disabled={!isHydrated}
          className="absolute inset-y-0 right-0 mr-2 my-2 px-5 bg-primary text-primary-foreground rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
        >
          <span className="hidden sm:inline">Search</span>
          <Icon name="ArrowRightIcon" size={18} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;