"use client";

import React, { useState } from "react";

interface Job {
  title: string;
  dateRange?: string;
  feedback?: string;
  startDate?: string;
  description?: string;
}

export default function CompletedJobs({
  completedJobsList = [],
  activeJobsList = [],
  completedCount = 0,
  inProgressCount = 0,
}: {
  completedJobsList?: Job[];
  activeJobsList?: Job[];
  completedCount?: number;
  inProgressCount?: number;
  // legacy props kept for compat
  freelancer?: any;
  freelancerData?: any;
  dynamicCompletedCount?: number;
  dynamicInProgressCount?: number;
}) {
  const [activeTab, setActiveTab] = useState<"completed" | "progress">("completed");

  return (
    <section className="border-t border-gray-100 pt-10">
      <h3 className="text-2xl font-bold text-center mb-10">Work history</h3>

      <div className="flex border-b border-gray-200 mb-8 text-[15px] font-bold justify-center gap-8">
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-4 px-2 cursor-pointer transition-all ${activeTab === "completed"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400 hover:text-gray-600"
            }`}
        >
          Completed jobs ({completedCount})
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`pb-4 px-2 cursor-pointer transition-all ${activeTab === "progress"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400 hover:text-gray-600"
            }`}
        >
          In progress ({inProgressCount})
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {activeTab === "completed" ? (
          <div className="divide-y divide-gray-100">
            {completedJobsList.length > 0 ? (
              completedJobsList.map((job, index) => (
                <div
                  key={index}
                  className="py-6 transition-colors hover:bg-gray-50 px-4 rounded-lg group"
                >
                  <h4 className="text-blue-500 font-bold text-lg group-hover:underline cursor-pointer">
                    {job.title}
                  </h4>
                  {job.dateRange && (
                    <p className="text-xs text-gray-400 mt-1 italic">{job.dateRange}</p>
                  )}
                  {job.feedback && (
                    <p className="text-[15px] text-gray-600 mt-4 italic">"{job.feedback}"</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Private earnings</p>
                </div>
              ))
            ) : completedCount > 0 ? (
              Array.from({ length: completedCount }).map((_, index) => (
                <div key={index} className="py-6 px-4 rounded-lg">
                  <h4 className="text-blue-500 font-bold text-lg">Completed Project</h4>
                  <p className="text-[15px] text-gray-600 mt-4 italic">Successfully completed.</p>
                  <p className="text-xs text-gray-400 mt-2">Private earnings</p>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-gray-400">No completed jobs yet.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activeJobsList.length > 0 ? (
              activeJobsList.map((job, index) => (
                <div
                  key={index}
                  className="py-6 transition-colors hover:bg-gray-50 px-4 rounded-lg group"
                >
                  <h4 className="text-blue-500 font-bold text-lg group-hover:underline cursor-pointer">
                    {job.title}
                  </h4>
                  {job.startDate && (
                    <p className="text-xs text-gray-400 mt-1 italic">Started {job.startDate}</p>
                  )}
                  {job.description && (
                    <p className="text-[15px] text-gray-600 mt-4 italic">{job.description}</p>
                  )}
                </div>
              ))
            ) : inProgressCount > 0 ? (
              Array.from({ length: inProgressCount }).map((_, index) => (
                <div key={index} className="py-6 px-4 rounded-lg">
                  <h4 className="text-blue-500 font-bold text-lg">Ongoing Project</h4>
                  <p className="text-[15px] text-gray-600 mt-4 italic">Job is currently in progress.</p>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-gray-400">No jobs currently in progress.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
