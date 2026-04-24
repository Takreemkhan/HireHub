'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        disabled={!isHydrated}
        className={`p-2 rounded-md transition-all duration-300 disabled:opacity-50 ${
          view === 'grid' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
        aria-label="Grid view"
      >
        <Icon name="Squares2X2Icon" size={20} />
      </button>
      <button
        onClick={() => onViewChange('list')}
        disabled={!isHydrated}
        className={`p-2 rounded-md transition-all duration-300 disabled:opacity-50 ${
          view === 'list' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
        aria-label="List view"
      >
        <Icon name="ListBulletIcon" size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;