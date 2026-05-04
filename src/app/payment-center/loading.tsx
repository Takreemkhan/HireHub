import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Skeleton className="h-10 w-64 mb-4" />
                    <Skeleton className="h-5 w-96" />
                </div>

                <div className="flex space-x-2 mb-8 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-12 w-32 rounded-lg" />
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </div>
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
