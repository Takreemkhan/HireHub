'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterCategory {
  id: string;
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range';
}

interface FilterPanelProps {
  categories: FilterCategory[];
  onFilterChange: (filters: Record<string, string[]>) => void;
  activeFilters: Record<string, string[]>;
}

const FilterPanel = ({ categories, onFilterChange, activeFilters }: FilterPanelProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<Record<string, string[]>>(activeFilters);

  useEffect(() => {
    setIsHydrated(true);
    setExpandedCategories(categories.map(cat => cat.id));
  }, [categories]);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-foreground">Filters</h3>
        </div>
        {categories.slice(0, 3).map((category) => (
          <div key={category.id} className="border-t border-border pt-4">
            <h4 className="font-body font-semibold text-foreground mb-3">{category.title}</h4>
          </div>
        ))}
      </div>
    );
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFilterToggle = (categoryId: string, optionId: string) => {
    const newFilters = { ...localFilters };
    
    if (!newFilters[categoryId]) {
      newFilters[categoryId] = [];
    }

    if (newFilters[categoryId].includes(optionId)) {
      newFilters[categoryId] = newFilters[categoryId].filter(id => id !== optionId);
    } else {
      newFilters[categoryId] = [...newFilters[categoryId], optionId];
    }

    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).reduce((sum, arr) => sum + arr.length, 0);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold text-foreground">Filters</h3>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm font-body font-medium text-accent hover:text-opacity-80 transition-colors duration-200"
          >
            Clear All ({getActiveFilterCount()})
          </button>
        )}
      </div>

      {categories.map((category) => (
        <div key={category.id} className="border-t border-border pt-4">
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center justify-between mb-3 group"
          >
            <h4 className="font-body font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {category.title}
            </h4>
            <Icon
              name="ChevronDownIcon"
              size={20}
              className={`text-muted-foreground transition-transform duration-300 ${
                expandedCategories.includes(category.id) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedCategories.includes(category.id) && (
            <div className="space-y-2">
              {category.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={localFilters[category.id]?.includes(option.id) || false}
                    onChange={() => handleFilterToggle(category.id, option.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="flex-1 text-sm font-body text-foreground group-hover:text-primary transition-colors duration-200">
                    {option.label}
                  </span>
                  {option.count !== undefined && (
                    <span className="text-xs font-body text-muted-foreground">
                      ({option.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterPanel;