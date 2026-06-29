import React from "react";

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-full p-4 rounded-xl border border-gray-100 bg-white flex flex-col gap-2 animate-pulse">
          <div className="flex items-center justify-between w-full">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-3 bg-gray-100 rounded w-20" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
          <div className="flex justify-between items-center text-[10px] mt-1 pt-1.5 border-t border-dashed border-gray-100">
            <div className="h-3 bg-gray-100 rounded w-16" />
            <div className="h-3 bg-gray-100 rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-white min-h-full animate-pulse">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between border-b pb-4 border-gray-100 gap-3">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-6 bg-gray-200 rounded w-64" />
        </div>
        <div className="h-8 bg-gray-200 rounded-xl w-32" />
      </div>

      {/* Contract Info */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-3 bg-gray-100 rounded w-36" />
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-100 rounded-xl p-3 bg-white space-y-2">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-100 rounded w-32" />
        </div>
        <div className="border border-gray-100 rounded-xl p-3 bg-white space-y-2">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-100 rounded w-32" />
        </div>
      </div>

      {/* Submissions */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-36" />
            <div className="h-16 bg-white border border-gray-100 rounded-xl" />
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-36" />
            <div className="h-16 bg-white border border-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-white min-h-full animate-pulse">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-xl" />
          <div className="space-y-1.5">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>

      <div className="space-y-5">
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-28" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-100 rounded w-28" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="space-y-3">
            <div className="h-10 bg-gray-100 rounded-xl w-full" />
            <div className="h-20 bg-gray-100 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
