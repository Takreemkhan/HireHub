'use client';

import { Star, Clock, PoundSterling } from 'lucide-react';

export interface CompletedJobCardProps {
  title: string;
  rating: number;
  duration: string;
  price: string;
}

export default function CompletedJobCard({
  title,
  rating,
  duration,
  price,
}: CompletedJobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition mt-10">
      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 lg:text-lg md:text-md xl:text-xl ">
        {title}
      </h3>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 xl:w-5 xl:h-5" />
          <span className="font-medium xl:text-lg">{rating} / 5</span>
        </div>

        <div className="flex items-center gap-2 xl:text-lg">
          <Clock className="w-4 h-4 xl:w-5 xl:h-5" />
          <span>{duration}</span>
        </div>

        <div className="flex items-center gap-2 font-semibold text-gray-900 xl:text-lg">
          <PoundSterling className="w-4 h-4 xl:w-5 xl:h-5" />
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
}
