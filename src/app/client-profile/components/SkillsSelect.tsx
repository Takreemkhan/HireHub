"use client";

import { useState, useRef } from "react";

const ALL_SKILLS = [
  "PHP",
  "Website Design",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Tailwind CSS",
  "React",
  "Next.js",
  "Node.js",
  "Laravel",
  "Express",
  "Shopify",
  "WordPress",
  "Magento",
  "Prestashop",
  "BigCommerce",
  "MySQL",
  "MongoDB",
  "PostgreSQL",
  "NoSQL Couch & Mongo",
  "Software Architecture",
  "Mobile App Development",
  "Android",
  "iOS",
  "Azure",
  "Figma",
  "AWS",
  "UI/UX Design",
];

const MAX_SKILLS = 15;

interface Props {
  selected: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsSelect({ selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSkills = ALL_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(query.toLowerCase()) &&
      !selected.includes(skill)
  );

  const addSkill = (skill: string) => {
    if (selected.length >= MAX_SKILLS) return;
    onChange([...selected, skill]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    onChange(selected.filter((s) => s !== skill));
  };

  return (
    <div className="relative">
      {/* Selected skills */}
      <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-[48px]">
        {selected.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="hover:text-gray-200"
            >
              ✕
            </button>
          </span>
        ))}

        {selected.length < MAX_SKILLS && (
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Type a skill..."
            className="flex-1 min-w-[120px] outline-none text-lg py-1"
          />
        )}
      </div>

      {/* Dropdown */}
      {open && query && filteredSkills.length > 0 && selected.length < MAX_SKILLS && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow max-h-48 overflow-auto">
          {filteredSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{selected.length} / {MAX_SKILLS} skills selected</span>
        {selected.length >= MAX_SKILLS && (
          <span className="text-orange-500">Skill limit reached</span>
        )}
      </div>
    </div>
  );
}
