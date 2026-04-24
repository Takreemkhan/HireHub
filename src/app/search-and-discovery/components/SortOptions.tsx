'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SortOption {
  id: string;
  label: string;
  icon: string;
}

interface SortOptionsProps {
  options: SortOption[];
  activeSort: string;
  onSortChange: (sortId: string) => void;
}

const SortOptions = ({ options, activeSort, onSortChange }: SortOptionsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="relative">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg font-body font-medium text-foreground">
          <Icon name="AdjustmentsHorizontalIcon" size={20} />
          <span>Sort by</span>
        </button>
      </div>
    );
  }

  const activeOption = options.find(opt => opt.id === activeSort);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg font-body font-medium text-foreground hover:bg-muted transition-colors duration-200"
      >
        <Icon name="AdjustmentsHorizontalIcon" size={20} />
        <span>Sort: {activeOption?.label || 'Select'}</span>
        <Icon
          name="ChevronDownIcon"
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg shadow-brand-lg border border-border z-20 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSortChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-200 ${
                  activeSort === option.id ? 'bg-muted text-primary' : 'text-foreground'
                }`}
              >
                <Icon name={option.icon as any} size={20} />
                <span className="font-body font-medium">{option.label}</span>
                {activeSort === option.id && (
                  <Icon name="CheckIcon" size={20} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortOptions;