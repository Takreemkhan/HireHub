'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SavedJob {
    id: string;
    title: string;
    budget: string;
    category: string;
    postedAt: string;
    clientName: string;
    clientInitials: string;
    bids: number;
}

interface SavedJobsPanelProps {
    jobs: SavedJob[];
    loading: boolean;
    onJobClick: (id: string) => void;
    onUnsave: (id: string) => void;
}

const SavedJobsPanel = ({ jobs, loading, onJobClick, onUnsave }: SavedJobsPanelProps) => {
    if (loading) {
        return (
            <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-base font-display font-bold text-foreground mb-3 flex items-center gap-2">
                    <Icon name="BookmarkIcon" size={18} variant="solid" className="text-accent" />
                    Saved Jobs
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-base font-display font-bold text-foreground mb-3 flex items-center gap-2">
                    <Icon name="BookmarkIcon" size={18} variant="solid" className="text-accent" />
                    Saved Jobs
                </h3>
                <div className="text-center py-4">
                    <Icon name="BookmarkIcon" size={32} className="text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-muted-foreground">No saved jobs yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Click 🔖 on any job to save it.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-base font-display font-bold text-foreground mb-3 flex items-center gap-2">
                <Icon name="BookmarkIcon" size={18} variant="solid" className="text-accent" />
                Saved Jobs
                <span className="ml-auto text-xs font-normal bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                    {jobs.length}
                </span>
            </h3>

            <div className="space-y-2">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className="group relative p-3 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border"
                        onClick={() => onJobClick(job.id)}
                    >
                        {/* Unsave button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onUnsave(job.id); }}
                            className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                            title="Remove from saved"
                        >
                            <Icon name="XMarkIcon" size={14} className="text-muted-foreground hover:text-red-500" />
                        </button>

                        <p className="text-sm font-semibold text-foreground pr-6 line-clamp-2 leading-snug">
                            {job.title}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs font-medium text-primary">{job.budget}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{job.bids} bids</span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                            {/* Client initials mini-avatar */}
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0">
                                {job.clientInitials.slice(0, 2)}
                            </div>
                            <span className="text-xs text-muted-foreground truncate">{job.clientName}</span>
                            <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">{job.postedAt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedJobsPanel;