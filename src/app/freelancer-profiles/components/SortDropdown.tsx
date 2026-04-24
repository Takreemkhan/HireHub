'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortOption {
  id: string;
  label: string;
  icon: string;
}

interface SortDropdownProps {
  onSortChange: (sortBy: string) => void;
}

const SortDropdown = ({ onSortChange }: SortDropdownProps) => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedSort, setSelectedSort] = React.useState('recommended');

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const sortOptions: SortOption[] = [
    { id: 'recommended', label: 'Recommended', icon: 'SparklesIcon' },
    { id: 'rating', label: 'Highest Rated', icon: 'StarIcon' },
    { id: 'price-low', label: 'Price: Low to High', icon: 'ArrowUpIcon' },
    { id: 'price-high', label: 'Price: High to Low', icon: 'ArrowDownIcon' },
    { id: 'recent', label: 'Recently Active', icon: 'ClockIcon' },
    { id: 'experience', label: 'Most Experienced', icon: 'AcademicCapIcon' },
  ];

  const handleSortSelect = (sortId: string) => {
    if (!isHydrated) return;
    setSelectedSort(sortId);
    setIsOpen(false);
    onSortChange(sortId);
  };

  const selectedOption = sortOptions.find(opt => opt.id === selectedSort);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isHydrated}
        className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-300 disabled:opacity-50"
      >
        <Icon name="BarsArrowDownIcon" size={20} />
        <span className="text-sm font-medium hidden sm:inline">Sort by:</span>
        <span className="text-sm font-semibold">{selectedOption?.label}</span>
        <Icon name={isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-lg shadow-brand-lg border border-border z-10">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSortSelect(option.id)}
              disabled={!isHydrated}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg disabled:opacity-50 ${
                selectedSort === option.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={option.icon as any} size={18} />
              <span className="text-sm font-medium">{option.label}</span>
              {selectedSort === option.id && (
                <Icon name="CheckIcon" size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;