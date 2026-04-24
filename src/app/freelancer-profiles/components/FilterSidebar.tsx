// 'use client';

// import React, { useState, useEffect } from 'react';
// import Icon from '@/components/ui/AppIcon';

// interface FilterOption {
//   id: string;
//   label: string;
//   count?: number;
// }

// interface FilterSidebarProps {
//   onFilterChange: (filters: FilterState) => void;
// }

// interface FilterState {
//   categories: string[];
//   skills: string[];
//   priceRange: [number, number];
//   availability: string[];
//   rating: number;
//   verified: boolean;
// }

// const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
//   const [isHydrated, setIsHydrated] = React.useState(false);
//   const [isExpanded, setIsExpanded] = React.useState(true);
//   const [filters, setFilters] = React.useState<FilterState>({
//     categories: [],
//     skills: [],
//     priceRange: [0, 200],
//     availability: [],
//     rating: 0,
//     verified: false,
//   });

//   React.useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const categories: FilterOption[] = [
//     { id: 'web-dev', label: 'Web Development', count: 1247 },
//     { id: 'mobile-dev', label: 'Mobile Development', count: 856 },
//     { id: 'design', label: 'Design & Creative', count: 2134 },
//     { id: 'writing', label: 'Writing & Content', count: 1523 },
//     { id: 'marketing', label: 'Digital Marketing', count: 987 },
//     { id: 'data', label: 'Data Science', count: 654 },
//   ];

//   const topSkills: FilterOption[] = [
//     { id: 'react', label: 'React', count: 892 },
//     { id: 'nodejs', label: 'Node.js', count: 743 },
//     { id: 'python', label: 'Python', count: 1021 },
//     { id: 'figma', label: 'Figma', count: 567 },
//     { id: 'seo', label: 'SEO', count: 432 },
//   ];

//   const availabilityOptions: FilterOption[] = [
//     { id: 'now', label: 'Available Now' },
//     { id: 'week', label: 'Within a Week' },
//     { id: 'month', label: 'Within a Month' },
//   ];

//   const handleCategoryToggle = (categoryId: string) => {
//     if (!isHydrated) return;
//     const newCategories = filters.categories.includes(categoryId)
//       ? filters.categories.filter(c => c !== categoryId)
//       : [...filters.categories, categoryId];

//     const newFilters = { ...filters, categories: newCategories };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleSkillToggle = (skillId: string) => {
//     if (!isHydrated) return;
//     const newSkills = filters.skills.includes(skillId)
//       ? filters.skills.filter(s => s !== skillId)
//       : [...filters.skills, skillId];

//     const newFilters = { ...filters, skills: newSkills };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleAvailabilityToggle = (availId: string) => {
//     if (!isHydrated) return;
//     const newAvailability = filters.availability.includes(availId)
//       ? filters.availability.filter(a => a !== availId)
//       : [...filters.availability, availId];

//     const newFilters = { ...filters, availability: newAvailability };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleRatingChange = (rating: number) => {
//     if (!isHydrated) return;
//     const newFilters = { ...filters, rating };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleVerifiedToggle = () => {
//     if (!isHydrated) return;
//     const newFilters = { ...filters, verified: !filters.verified };
//     setFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   const handleClearAll = () => {
//     if (!isHydrated) return;
//     const clearedFilters: FilterState = {
//       categories: [],
//       skills: [],
//       priceRange: [0, 200],
//       availability: [],
//       rating: 0,
//       verified: false,
//     };
//     setFilters(clearedFilters);
//     onFilterChange(clearedFilters);
//   };

//   return (
//     <aside className="bg-card rounded-xl border border-border p-6 sticky top-20">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
//           <Icon name="AdjustmentsHorizontalIcon" size={20} />
//           Filters
//         </h2>
//         <button
//           onClick={() => setIsExpanded(!isExpanded)}
//           disabled={!isHydrated}
//           className="lg:hidden p-1 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
//         >
//           <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={20} />
//         </button>
//       </div>

//       <div className={`space-y-6 ${!isExpanded ? 'hidden lg:block' : ''}`}>
//         <div>
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-sm font-display font-semibold text-foreground">Categories</h3>
//             {filters.categories.length > 0 && (
//               <span className="text-xs text-primary font-medium">
//                 {filters.categories.length} selected
//               </span>
//             )}
//           </div>
//           <div className="space-y-2">
//             {categories.map((category) => (
//               <label
//                 key={category.id}
//                 className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
//               >
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={filters.categories.includes(category.id)}
//                     onChange={() => handleCategoryToggle(category.id)}
//                     disabled={!isHydrated}
//                     className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
//                   />
//                   <span className="text-sm text-foreground">{category.label}</span>
//                 </div>
//                 <span className="text-xs text-muted-foreground">{category.count}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="pt-6 border-t border-border">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-sm font-display font-semibold text-foreground">Top Skills</h3>
//             {filters.skills.length > 0 && (
//               <span className="text-xs text-primary font-medium">
//                 {filters.skills.length} selected
//               </span>
//             )}
//           </div>
//           <div className="space-y-2">
//             {topSkills.map((skill) => (
//               <label
//                 key={skill.id}
//                 className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
//               >
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={filters.skills.includes(skill.id)}
//                     onChange={() => handleSkillToggle(skill.id)}
//                     disabled={!isHydrated}
//                     className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
//                   />
//                   <span className="text-sm text-foreground">{skill.label}</span>
//                 </div>
//                 <span className="text-xs text-muted-foreground">{skill.count}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="pt-6 border-t border-border">
//           <h3 className="text-sm font-display font-semibold text-foreground mb-3">
//             Hourly Rate Range
//           </h3>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-muted-foreground">$0</span>
//               <span className="font-semibold text-primary">
//                 ${filters.priceRange[0]} - ${filters.priceRange[1]}+
//               </span>
//               <span className="text-muted-foreground">$200+</span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="200"
//               value={filters.priceRange[1]}
//               disabled={!isHydrated}
//               className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50"
//             />
//           </div>
//         </div>

//         <div className="pt-6 border-t border-border">
//           <h3 className="text-sm font-display font-semibold text-foreground mb-3">
//             Availability
//           </h3>
//           <div className="space-y-2">
//             {availabilityOptions.map((option) => (
//               <label
//                 key={option.id}
//                 className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
//               >
//                 <input
//                   type="checkbox"
//                   checked={filters.availability.includes(option.id)}
//                   onChange={() => handleAvailabilityToggle(option.id)}
//                   disabled={!isHydrated}
//                   className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
//                 />
//                 <span className="text-sm text-foreground">{option.label}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="pt-6 border-t border-border">
//           <h3 className="text-sm font-display font-semibold text-foreground mb-3">
//             Minimum Rating
//           </h3>
//           <div className="space-y-2">
//             {[5, 4, 3].map((rating) => (
//               <button
//                 key={rating}
//                 onClick={() => handleRatingChange(rating)}
//                 disabled={!isHydrated}
//                 className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors disabled:opacity-50 ${
//                   filters.rating === rating
//                     ? 'bg-primary text-primary-foreground'
//                     : 'hover:bg-muted text-foreground'
//                 }`}
//               >
//                 <div className="flex items-center gap-1">
//                   {[...Array(rating)].map((_, i) => (
//                     <Icon key={i} name="StarIcon" size={16} variant="solid" />
//                   ))}
//                 </div>
//                 <span className="text-sm font-medium">& up</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="pt-6 border-t border-border">
//           <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
//             <input
//               type="checkbox"
//               checked={filters.verified}
//               onChange={handleVerifiedToggle}
//               disabled={!isHydrated}
//               className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
//             />
//             <div className="flex items-center gap-2">
//               <Icon name="CheckBadgeIcon" size={18} className="text-success" variant="solid" />
//               <span className="text-sm font-medium text-foreground">Verified Only</span>
//             </div>
//           </label>
//         </div>

//         <button
//           onClick={handleClearAll}
//           disabled={!isHydrated}
//           className="w-full px-4 py-2.5 bg-muted text-foreground rounded-lg font-display font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
//         >
//           <Icon name="XMarkIcon" size={18} />
//           Clear All Filters
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default FilterSidebar;

'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useFreelancerCategories, useProfile } from '@/app/hook/useProfile';


interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  skills: string[];
  priceRange: [number, number];
  availability: string[];
  rating: number;
  verified: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  skills: [],
  priceRange: [0, 200],
  availability: [],
  rating: 0,
  verified: false,
};

const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);
  React.useEffect(() => { setIsHydrated(true); }, []);


  const { data, isLoading } = useProfile({
    title: "",
    skills: [""],

  });
  const { data: dataCategories, isLoading: Categoriesloading, error } = useFreelancerCategories();


  const list = data?.profiles || [];

  const filteredProfiles = list.filter((profile: any) => {
    if (profile.title === undefined || profile.title === null || profile.title !== "") {
      return profile
    }

  })


  // list.map((profile: any) => { 
  //    console.log("Profile title :", profile.title);
  // });
  // console.log("Fetched profiles with filters:", data, "Loading:", isLoading);
  // ─── Options ────────────────────────────────────────────────────────────────
  // const categories: FilterOption[] = [
  //   { id: 'web-dev',    label: 'Web Development ',  count: 1247 },
  //   { id: 'mobile-dev', label: 'Mobile Development', count: 856 },
  //   { id: 'design',     label: 'Design & Creative', count: 2134 },
  //   { id: 'writing',    label: 'Writing & Content', count: 1523 },
  //   { id: 'marketing',  label: 'Digital Marketing', count: 987 },
  //   { id: 'data',       label: 'Data Science',      count: 654 },
  // ];

  // IDs must match the SKILL_ID_TO_NAME map in FreelancerProfilesInteractive
  const topSkills: FilterOption[] = [
    { id: 'react', label: 'React', count: 892 },
    { id: 'nodejs', label: 'Node.js', count: 743 },
    { id: 'python', label: 'Python', count: 1021 },
    { id: 'figma', label: 'Figma', count: 567 },
    { id: 'seo', label: 'SEO', count: 432 },
  ];

  const availabilityOptions: FilterOption[] = [
    { id: 'now', label: 'Available Now' },
    { id: 'week', label: 'Within a Week' },
    { id: 'month', label: 'Within a Month' },
  ];

  // ─── Generic toggle helper ────────────────────────────────────────────────────
  const toggle = <K extends 'categories' | 'skills' | 'availability'>(
    key: K,
    id: string,
  ) => {
    if (!isHydrated) return;

    const arr = filters[key] as string[];
    const next = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
    const updated = { ...filters, [key]: next };

    setFilters(updated);
    onFilterChange(updated);
  };

  const update = (partial: Partial<FilterState>) => {
    if (!isHydrated) return;
    const updated = { ...filters, ...partial };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleClearAll = () => {
    if (!isHydrated) return;
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  const activeCount =
    filters.categories.length +
    filters.skills.length +
    filters.availability.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <aside className="bg-card rounded-xl border border-border p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
          <Icon name="AdjustmentsHorizontalIcon" size={20} />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full font-medium">
              {activeCount}
            </span>
          )}
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!isHydrated}
          className="lg:hidden p-1 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
        >
          <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={20} />
        </button>
      </div>

      <div className={`space-y-6 ${!isExpanded ? 'hidden lg:block' : ''}`}>

        {/* ── Categories ─────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display font-semibold text-foreground">Categories</h3>
            {filters.categories.length > 0 && (
              <span className="text-xs text-primary font-medium">{filters.categories.length} selected</span>
            )}
          </div>
          <div className="space-y-2">
            {dataCategories?.categories?.map((cat: any) => (

              <label
                key={cat.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.label)}
                    onChange={() => toggle('categories', cat.label)}
                    disabled={!isHydrated}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <span className="text-sm text-foreground">{cat.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{cat.count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Skills ─────────────────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display font-semibold text-foreground">Top Skills</h3>
            {filters.skills.length > 0 && (
              <span className="text-xs text-primary font-medium">{filters.skills.length} selected</span>
            )}
          </div>
          <div className="space-y-2">
            {topSkills.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.skills.includes(skill.id)}
                    onChange={() => toggle('skills', skill.id)}
                    disabled={!isHydrated}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <span className="text-sm text-foreground">{skill.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{skill.count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Price Range (dual slider) ───────────────────────────────────────── */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">
            Hourly Rate Range
          </h3>
          <div className="space-y-4">
            {/* Display */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">$0</span>
              <span className="font-semibold text-primary">
                ${filters.priceRange[0]} – ${filters.priceRange[1]}{filters.priceRange[1] >= 200 ? '+' : ''}
              </span>
              <span className="text-muted-foreground">$200+</span>
            </div>

            {/* Min slider */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min: ${filters.priceRange[0]}</label>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={filters.priceRange[0]}
                disabled={!isHydrated}
                onChange={(e) => {
                  const min = Number(e.target.value);
                  const max = Math.max(min + 5, filters.priceRange[1]);
                  update({ priceRange: [min, max] });
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
              />
            </div>

            {/* Max slider */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Max: ${filters.priceRange[1]}{filters.priceRange[1] >= 200 ? '+' : ''}</label>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={filters.priceRange[1]}
                disabled={!isHydrated}
                onChange={(e) => {
                  const max = Number(e.target.value);
                  const min = Math.min(filters.priceRange[0], max - 5);
                  update({ priceRange: [min, max] });
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* ── Availability ───────────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">Availability</h3>
          <div className="space-y-2">
            {availabilityOptions.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.availability.includes(opt.id)}
                  onChange={() => toggle('availability', opt.id)}
                  disabled={!isHydrated}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <span className="text-sm text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Minimum Rating ─────────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">Minimum Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <button
                key={rating}
                onClick={() => update({ rating: filters.rating === rating ? 0 : rating })}
                disabled={!isHydrated}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors disabled:opacity-50 ${filters.rating === rating
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
                  }`}
              >
                <div className="flex items-center gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Icon key={i} name="StarIcon" size={16} variant="solid" />
                  ))}
                </div>
                <span className="text-sm font-medium">& up</span>
                {filters.rating === rating && (
                  <Icon name="XMarkIcon" size={14} className="ml-auto opacity-70" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Verified Only ──────────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-border">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={() => update({ verified: !filters.verified })}
              disabled={!isHydrated}
              className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <div className="flex items-center gap-2">
              <Icon name="CheckBadgeIcon" size={18} className="text-success" variant="solid" />
              <span className="text-sm font-medium text-foreground">Verified Only</span>
            </div>
          </label>
        </div>

        {/* ── Clear All ──────────────────────────────────────────────────────── */}
        <button
          onClick={handleClearAll}
          disabled={!isHydrated || activeCount === 0}
          className="w-full px-4 py-2.5 bg-muted text-foreground rounded-lg font-display font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Icon name="XMarkIcon" size={18} />
          Clear All Filters
          {activeCount > 0 && (
            <span className="text-xs">({activeCount})</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;