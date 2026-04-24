'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, string[]>;
  resultCount: number;
  createdAt: string;
  alertEnabled: boolean;
}

interface SavedSearchesProps {
  searches: SavedSearch[];
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch: (id: string) => void;
  onToggleAlert: (id: string) => void;
}

const SavedSearches = ({ searches, onLoadSearch, onDeleteSearch, onToggleAlert }: SavedSearchesProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [expandedSearch, setExpandedSearch] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-display font-bold text-foreground mb-4">Saved Searches</h3>
        <div className="space-y-3">
          {searches.slice(0, 2).map((search) => (
            <div key={search.id} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-body font-semibold text-foreground">{search.name}</h4>
                  <p className="text-sm text-muted-foreground">{search.resultCount} results</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-bold text-foreground">Saved Searches</h3>
        <span className="text-sm font-body text-muted-foreground">{searches.length} saved</span>
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="BookmarkIcon" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-body text-muted-foreground">No saved searches yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((search) => (
            <div key={search.id} className="p-4 bg-muted rounded-lg hover:bg-opacity-80 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => onLoadSearch(search)}
                  className="flex-1 min-w-0 text-left"
                >
                  <h4 className="font-body font-semibold text-foreground hover:text-primary transition-colors duration-200">
                    {search.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {search.resultCount} results • {search.query}
                  </p>
                </button>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onToggleAlert(search.id)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      search.alertEnabled
                        ? 'bg-accent text-white' :'bg-card text-muted-foreground hover:bg-background'
                    }`}
                    aria-label={search.alertEnabled ? 'Disable alerts' : 'Enable alerts'}
                  >
                    <Icon name="BellIcon" size={18} variant={search.alertEnabled ? 'solid' : 'outline'} />
                  </button>
                  <button
                    onClick={() => setExpandedSearch(expandedSearch === search.id ? null : search.id)}
                    className="p-2 rounded-lg bg-card text-muted-foreground hover:bg-background transition-colors duration-200"
                    aria-label="More options"
                  >
                    <Icon name="EllipsisVerticalIcon" size={18} />
                  </button>
                </div>
              </div>

              {expandedSearch === search.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => onDeleteSearch(search.id)}
                    className="flex items-center gap-2 text-sm font-body text-error hover:text-opacity-80 transition-colors duration-200"
                  >
                    <Icon name="TrashIcon" size={16} />
                    <span>Delete search</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearches;