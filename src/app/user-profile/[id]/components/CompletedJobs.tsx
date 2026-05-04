"use client";

import React, { useState } from "react";

export default function CompletedJobs({ freelancer,freelancerData}: { freelancer: any; freelancerData: any }) {
  const [activeTab, setActiveTab] = useState<"completed" | "progress">("completed");

  const completedJobs = freelancer.completedJobsData || [];
  const inProgressJobs = freelancer.inProgressData || [];
const {completedJobs: freelancerCompletedJobs} = freelancerData || {};
  return (
    <section className="border-t border-gray-100 pt-10">
      <h3 className="text-2xl font-bold text-center mb-10">Work history</h3>

      <div className="flex border-b border-gray-200 mb-8 text-[15px] font-bold justify-center gap-8">
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-4 px-2 cursor-pointer transition-all ${
            activeTab === "completed"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Completed jobs ({freelancerCompletedJobs || 0})
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`pb-4 px-2 cursor-pointer transition-all ${
            activeTab === "progress"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          In progress ({freelancer.inProgressCount})
        </button>
      </div>

      {/* Content Logic */}
      <div className="max-w-3xl mx-auto">
        {activeTab === "completed" ? (
          <div className="divide-y divide-gray-100">
            {completedJobs.length > 0 ? (
              completedJobs.map((job: any, index: number) => (
                <div key={index} className="py-6 transition-colors hover:bg-gray-50 px-4 rounded-lg group">
                  <h4 className="text-blue-500 font-bold text-lg group-hover:underline cursor-pointer">
                    {job.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 italic">{job.dateRange}</p>
                  <p className="text-[15px] text-gray-600 mt-4 italic">
                    {job.feedback ? `"${job.feedback}"` : "No feedback given"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Private earnings</p>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-gray-400">No completed jobs yet.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {inProgressJobs.length > 0 ? (
              inProgressJobs.map((job: any, index: number) => (
                <div key={index} className="py-6 transition-colors hover:bg-gray-50 px-4 rounded-lg group">
                  <h4 className="text-blue-500 font-bold text-lg group-hover:underline cursor-pointer">
                    {job.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 italic">Started {job.startDate}</p>
                  <p className="text-[15px] text-gray-600 mt-4 italic">
                    {job.description || "Job is currently in progress."}
                  </p>
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


