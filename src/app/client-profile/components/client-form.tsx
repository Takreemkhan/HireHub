
"use client";

import { useState } from "react";
import SkillsSelect from "./SkillsSelect";

interface ClientFormProps {
  onSave: () => void;
}

export default function ClientProfileForm({ onSave }: ClientFormProps) {
  const [hourlyRate, setHourlyRate] = useState("25");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

   const handleSave = () => {
    localStorage.setItem(
      "clientProfile",
      JSON.stringify({ hourlyRate, headline, summary, skills })
    );

    onSave(); // 🚀 redirect
  };

  return (
  <>
    <div className="w-full max-w-7xl bg-white rounded-lg shadow-sm px-6 sm:px-10 md:px-14 lg:px-16 py-10">
      
      {/* Title */}
      <h1 className="font-semibold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        Edit profile
      </h1>
      <p className="mt-3 text-gray-600 text-base sm:text-lg md:text-xl">
        You will have the ability to choose which profile to display in your bids
      </p>

      <hr className="my-8" />

      {/* Hourly Rate */}
      <div className="mb-6">
        <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
          HOURLY RATE
        </label>

        <div className="flex items-center gap-2">
          <span className="px-4 py-3 border rounded-md bg-gray-50 text-lg">$</span>

          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-28 border rounded-md px-4 py-3 text-lg
            focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <span className="text-sm text-gray-500">USD / hour</span>
        </div>
      </div>

      {/* Professional Headline */}
      <div className="mb-6">
        <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
          PROFESSIONAL HEADLINE
        </label>

        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="🚀 8+ Years Exp. | Web & Mobile App Experts"
          className="w-full border rounded-md px-4 py-3 text-lg
          focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Top Skills */}
      <div className="mb-6">
        <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
          TOP SKILLS
        </label>

        <SkillsSelect selected={skills} onChange={setSkills} />

        <p className="text-xs text-gray-500 mt-2">
          Select up to 15 skills that best describe your expertise
        </p>
      </div>

      {/* Summary */}
      <div className="mb-10">
        <label className="block font-semibold uppercase text-gray-600 mb-2 text-sm">
          SUMMARY
        </label>

        <textarea
          rows={6}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Welcome to our profile. We are a team of senior developers..."
          className="w-full border rounded-md px-4 py-3 text-lg resize-none
          focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100">
          Cancel
        </button>

        <button  onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Changes
        </button>
        
      </div>
    </div>
  </>
  );
}
