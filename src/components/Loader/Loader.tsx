import React from 'react';

interface CardSkeletonProps {
    view?: 'grid' | 'list';
    count?: number;
}
interface MainLoaderProps {
  name?: string;
}

const SkeletonCard = ({ view }: { view: 'grid' | 'list' }) => (
    <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
        <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
            </div>
        </div>
        <div className="h-px bg-border mb-4" />
        <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-4/5" />
        </div>
        <div className="flex gap-2 mt-4">
            <div className="h-10 bg-muted rounded-lg flex-1" />
            <div className="h-10 w-12 bg-muted rounded-lg" />
        </div>
    </div>
);

const CardSkeleton = ({
    view = 'grid',
    count = 6,
}: CardSkeletonProps) => {
    return (
        <div
            className={`grid gap-6 mb-8 ${view === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}
        >
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} view={view} />
            ))}
        </div>
    );
};

export default CardSkeleton;


export const MainLoader = ({ name }: MainLoaderProps) => (
     <div className="flex items-center justify-center min-h-screen bg-[#F3F7FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            {status === "loading" ? "Loading..." : name }
          </p>
        </div>
      </div>
)