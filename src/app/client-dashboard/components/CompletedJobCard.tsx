'use client';

import { Star, Clock } from 'lucide-react';

export interface CompletedJobCardProps {
  title: string;
  rating: number;
  duration: string;
  price: string;
  completedAt?: string;
  onClick?: () => void;
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

export default function CompletedJobCard({
  title,
  rating,
  duration,
  price,
  completedAt,
  onClick,
}: CompletedJobCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-blue-200"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 lg:text-xl">
          {title}
        </h2>

        <div className="space-y-2 text-sm text-gray-600 lg:text-base">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            <span className="font-medium text-gray-900">{rating} / 5</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            {completedAt ? <span>Completed {timeAgo(completedAt)}</span> : <span>{duration}</span>}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Final Amount</p>
          <p className="text-xl font-bold text-gray-900 flex items-center">
            {price}
          </p>
        </div>

        {/* Status badge */}
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          Completed
        </span>
      </div>
    </div>
  );
}
