// 'use client';

// import React, { useState, useEffect } from 'react';
// import FreelancerCard from './FreelancerCard';
// import FilterSidebar from './FilterSidebar';
// import SearchBar from './SearchBar';
// import SortDropdown from './SortDropdown';
// import ViewToggle from './ViewToggle';
// import Icon from '@/components/ui/AppIcon';

// interface Skill {
//   name: string;
//   level: 'Expert' | 'Advanced' | 'Intermediate';
// }

// interface Freelancer {
//   id: number;
//   name: string;
//   title: string;
//   image: string;
//   alt: string;
//   hourlyRate: number;
//   rating: number;
//   reviewCount: number;
//   completedProjects: number;
//   skills: Skill[];
//   availability: string;
//   verified: boolean;
//   location: string;
//   responseTime: string;
// }

// interface FilterState {
//   categories: string[];
//   skills: string[];
//   priceRange: [number, number];
//   availability: string[];
//   rating: number;
//   verified: boolean;
// }

// const FreelancerProfilesInteractive = () => {
//   const [isHydrated, setIsHydrated] = React.useState(false);
//   const [view, setView] = React.useState<'grid' | 'list'>('grid');
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const [searchQuery, setSearchQuery] = React.useState('');
//   const [sortBy, setSortBy] = React.useState('recommended');
//   const [filters, setFilters] = React.useState<FilterState>({
//     categories: [],
//     skills: [],
//     priceRange: [0, 200],
//     availability: [],
//     rating: 0,
//     verified: false
//   });

//   React.useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const mockFreelancers: Freelancer[] = [
//   {
//     id: 1,
//     name: "Sarah Chen",
//     title: "Full-Stack Developer & UI/UX Specialist",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_10d60e496-1763295319842.png",
//     alt: "Professional Asian woman with long black hair in white blazer smiling at camera in modern office",
//     hourlyRate: 85,
//     rating: 4.9,
//     reviewCount: 127,
//     completedProjects: 89,
//     skills: [
//     { name: "React", level: "Expert" },
//     { name: "Node.js", level: "Expert" },
//     { name: "TypeScript", level: "Advanced" },
//     { name: "Figma", level: "Advanced" }],

//     availability: "Available Now",
//     verified: true,
//     location: "San Francisco, CA",
//     responseTime: "1 hour"
//   },
//   {
//     id: 2,
//     name: "Marcus Johnson",
//     title: "Mobile App Developer (iOS & Android)",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_18d854688-1763295573707.png",
//     alt: "Professional African American man with short hair in navy suit smiling confidently",
//     hourlyRate: 95,
//     rating: 5.0,
//     reviewCount: 203,
//     completedProjects: 156,
//     skills: [
//     { name: "Swift", level: "Expert" },
//     { name: "Kotlin", level: "Expert" },
//     { name: "React Native", level: "Advanced" },
//     { name: "Firebase", level: "Advanced" }],

//     availability: "Available Now",
//     verified: true,
//     location: "Austin, TX",
//     responseTime: "30 mins"
//   },
//   {
//     id: 3,
//     name: "Elena Rodriguez",
//     title: "Brand Designer & Creative Director",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_11fcd97b8-1763294574247.png",
//     alt: "Hispanic woman with wavy brown hair in burgundy blazer with warm smile in creative studio",
//     hourlyRate: 75,
//     rating: 4.8,
//     reviewCount: 94,
//     completedProjects: 67,
//     skills: [
//     { name: "Adobe Creative Suite", level: "Expert" },
//     { name: "Brand Strategy", level: "Expert" },
//     { name: "Illustration", level: "Advanced" },
//     { name: "Motion Graphics", level: "Intermediate" }],

//     availability: "Within a Week",
//     verified: true,
//     location: "Miami, FL",
//     responseTime: "2 hours"
//   },
//   {
//     id: 4,
//     name: "David Kim",
//     title: "Data Scientist & ML Engineer",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_11d2f9611-1763296666779.png",
//     alt: "Asian man with glasses in gray sweater working on laptop in modern workspace",
//     hourlyRate: 110,
//     rating: 4.9,
//     reviewCount: 156,
//     completedProjects: 112,
//     skills: [
//     { name: "Python", level: "Expert" },
//     { name: "TensorFlow", level: "Expert" },
//     { name: "SQL", level: "Advanced" },
//     { name: "AWS", level: "Advanced" }],

//     availability: "Available Now",
//     verified: true,
//     location: "Seattle, WA",
//     responseTime: "1 hour"
//   },
//   {
//     id: 5,
//     name: "Olivia Martinez",
//     title: "Content Strategist & SEO Specialist",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c3f1aeb1-1763298919911.png",
//     alt: "Young woman with blonde hair in casual blue shirt smiling warmly in bright office space",
//     hourlyRate: 65,
//     rating: 4.7,
//     reviewCount: 78,
//     completedProjects: 54,
//     skills: [
//     { name: "SEO", level: "Expert" },
//     { name: "Content Writing", level: "Expert" },
//     { name: "Google Analytics", level: "Advanced" },
//     { name: "WordPress", level: "Advanced" }],

//     availability: "Available Now",
//     verified: false,
//     location: "Denver, CO",
//     responseTime: "3 hours"
//   },
//   {
//     id: 6,
//     name: "James Wilson",
//     title: "DevOps Engineer & Cloud Architect",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b290162b-1763294963048.png",
//     alt: "Caucasian man with beard in black shirt with confident expression in tech office",
//     hourlyRate: 120,
//     rating: 5.0,
//     reviewCount: 189,
//     completedProjects: 143,
//     skills: [
//     { name: "AWS", level: "Expert" },
//     { name: "Docker", level: "Expert" },
//     { name: "Kubernetes", level: "Expert" },
//     { name: "Terraform", level: "Advanced" }],

//     availability: "Within a Week",
//     verified: true,
//     location: "Boston, MA",
//     responseTime: "2 hours"
//   },
//   {
//     id: 7,
//     name: "Priya Patel",
//     title: "Product Designer & UX Researcher",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_1297ac811-1763295122319.png",
//     alt: "Indian woman with long dark hair in professional attire smiling in modern design studio",
//     hourlyRate: 80,
//     rating: 4.9,
//     reviewCount: 112,
//     completedProjects: 78,
//     skills: [
//     { name: "Figma", level: "Expert" },
//     { name: "User Research", level: "Expert" },
//     { name: "Prototyping", level: "Advanced" },
//     { name: "Design Systems", level: "Advanced" }],

//     availability: "Available Now",
//     verified: true,
//     location: "New York, NY",
//     responseTime: "1 hour"
//   },
//   {
//     id: 8,
//     name: "Alex Thompson",
//     title: "Blockchain Developer & Smart Contract Expert",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_1af00294e-1763294385253.png",
//     alt: "Young man with short brown hair in casual gray shirt with friendly smile in tech workspace",
//     hourlyRate: 130,
//     rating: 4.8,
//     reviewCount: 67,
//     completedProjects: 45,
//     skills: [
//     { name: "Solidity", level: "Expert" },
//     { name: "Web3.js", level: "Expert" },
//     { name: "Ethereum", level: "Advanced" },
//     { name: "Smart Contracts", level: "Expert" }],

//     availability: "Within a Month",
//     verified: true,
//     location: "Portland, OR",
//     responseTime: "4 hours"
//   },
//   {
//     id: 9,
//     name: "Sophie Anderson",
//     title: "Digital Marketing Manager & Growth Hacker",
//     image: "https://img.rocket.new/generatedImages/rocket_gen_img_18fda4c3f-1763294988844.png",
//     alt: "Blonde woman in white blouse with professional demeanor in bright marketing office",
//     hourlyRate: 70,
//     rating: 4.7,
//     reviewCount: 91,
//     completedProjects: 63,
//     skills: [
//     { name: "Facebook Ads", level: "Expert" },
//     { name: "Google Ads", level: "Advanced" },
//     { name: "Email Marketing", level: "Advanced" },
//     { name: "Analytics", level: "Advanced" }],

//     availability: "Available Now",
//     verified: false,
//     location: "Chicago, IL",
//     responseTime: "2 hours"
//   }];


//   const itemsPerPage = 9;
//   const totalPages = Math.ceil(mockFreelancers.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentFreelancers = mockFreelancers.slice(startIndex, endIndex);

//   const handleSearch = (query: string) => {
//     if (!isHydrated) return;
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (sort: string) => {
//     if (!isHydrated) return;
//     setSortBy(sort);
//   };

//   const handleFilterChange = (newFilters: FilterState) => {
//     if (!isHydrated) return;
//     setFilters(newFilters);
//     setCurrentPage(1);
//   };

//   const handleViewChange = (newView: 'grid' | 'list') => {
//     if (!isHydrated) return;
//     setView(newView);
//   };

//   const handlePageChange = (page: number) => {
//     if (!isHydrated) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="min-h-screen bg-background pt-20 pb-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-display font-bold text-foreground mb-3">
//             Discover Top Talent
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Connect with verified professionals ready to bring your projects to life
//           </p>
//         </div>

//         <div className="mb-8">
//           <SearchBar onSearch={handleSearch} />
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-80 flex-shrink-0">
//             <FilterSidebar onFilterChange={handleFilterChange} />
//           </div>

//           <div className="flex-1">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//               <div className="text-sm text-muted-foreground">
//                 Showing <span className="font-semibold text-foreground">{startIndex + 1}-{Math.min(endIndex, mockFreelancers.length)}</span> of{' '}
//                 <span className="font-semibold text-foreground">{mockFreelancers.length}</span> freelancers
//               </div>
//               <div className="flex items-center gap-3">
//                 <SortDropdown onSortChange={handleSortChange} />
//                 <ViewToggle view={view} onViewChange={handleViewChange} />
//               </div>
//             </div>

//             <div className={`grid gap-6 mb-8 ${
//             view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`
//             }>
//               {currentFreelancers.map((freelancer) =>
//               <FreelancerCard key={freelancer.id} {...freelancer} />
//               )}
//             </div>

//             {totalPages > 1 &&
//             <div className="flex items-center justify-center gap-2">
//                 <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={!isHydrated || currentPage === 1}
//                 className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Previous page">

//                   <Icon name="ChevronLeftIcon" size={20} />
//                 </button>

//                 {[...Array(totalPages)].map((_, index) => {
//                 const page = index + 1;
//                 return (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     disabled={!isHydrated}
//                     className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 ${
//                     currentPage === page ?
//                     'bg-primary text-primary-foreground' :
//                     'border border-border hover:bg-muted text-foreground'}`
//                     }>

//                       {page}
//                     </button>);

//               })}

//                 <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={!isHydrated || currentPage === totalPages}
//                 className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Next page">

//                   <Icon name="ChevronRightIcon" size={20} />
//                 </button>
//               </div>
//             }
//           </div>
//         </div>
//       </div>
//     </div>);

// };

// export default FreelancerProfilesInteractive;

'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import FreelancerCard from './FreelancerCard';
import FilterSidebar from './FilterSidebar';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import ViewToggle from './ViewToggle';
import Icon from '@/components/ui/AppIcon';

interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
}

interface Freelancer {
  id: string;
  name: string;
  title: string;
  image: string;
  alt: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  skills: Skill[];
  availability: string;
  verified: boolean;
  location: string;
  responseTime: string;
}

interface FilterState {
  categories: string[];
  skills: string[];
  priceRange: [number, number];
  availability: string[];
  rating: number;
  verified: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// FilterSidebar skill IDs → canonical skill name
const SKILL_ID_TO_NAME: Record<string, string> = {
  'react':  'React',
  'nodejs': 'Node.js',
  'python': 'Python',
  'figma':  'Figma',
  'seo':    'SEO',
};

// Availability IDs → display labels
const AVAIL_ID_TO_LABEL: Record<string, string> = {
  'now':   'Available Now',
  'week':  'Within a Week',
  'month': 'Within a Month',
};

function mapProfile(profile: any): Freelancer {
  const skills: Skill[] = Array.isArray(profile.skills)
    ? profile.skills.map((s: any) =>
        typeof s === 'string'
          ? { name: s, level: 'Expert' as const }
          : { name: s.name || String(s), level: (s.level as any) || 'Expert' }
      )
    : [];

  return {
    id: profile.userId || profile._id || '',
    name:              profile.name || 'Unknown',
    title:             profile.title || 'Freelancer',
    image:             profile.image || profile.profileImage || '/default-avatar.png',
    alt:               `${profile.name || 'Freelancer'} profile photo`,
    hourlyRate:        Number(profile.hourlyRate) || 0,
    rating:            Number(profile.rating) || 0,
    reviewCount:       Array.isArray(profile.reviews) ? profile.reviews.length : 0,
    completedProjects: profile.completedJobs || 0,
    skills,
    availability:      profile.availability || 'Available Now',
    verified:          profile.verified || false,
    location:          profile.location || profile.contactInfo?.location || 'Remote',
    responseTime:      profile.responseTime || '1 hour',
  };
}

const LIMIT = 9;

const FreelancerProfilesInteractive = () => {
  const [isHydrated, setIsHydrated]   = React.useState(false);
  const [view, setView]               = React.useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy]           = React.useState('recommended');
  const [filters, setFilters]         = React.useState<FilterState>({
    categories:   [],
    skills:       [],
    priceRange:   [0, 200],
    availability: [],
    rating:       0,
    verified:     false,
  });

  // Master list — ALL profiles from API, never filtered at fetch time
  const [allProfiles, setAllProfiles] = React.useState<Freelancer[]>([]);
  const [loading, setLoading]         = React.useState(false);
  const [error, setError]             = React.useState<string | null>(null);
  const hasFetched                    = useRef(false);

  useEffect(() => { setIsHydrated(true); }, []);

  // ─── Fetch ALL profiles once on mount (no search/filter params) ──────────────
  // Reason: the backend does NOT search the `name` field, so passing a search
  // param causes it to return wrong results (e.g. matches "about" text instead
  // of the person's actual name). We fetch everything and filter 100% client-side.
  const fetchAllProfiles = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);
    setError(null);

    try {
      const res  = await fetch('/api/freelancer/profile?limit=500');
      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Failed to fetch profiles');

      setAllProfiles((data.profiles || []).map(mapProfile));
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setAllProfiles([]);
      hasFetched.current = false; // allow retry
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) fetchAllProfiles();
  }, [isHydrated, fetchAllProfiles]);

  // ─── Client-side: search + filter + sort + paginate ──────────────────────────
  const { pageItems, pagination } = React.useMemo(() => {
    let list = [...allProfiles];

    // ── 1. Search (name, title, skills) ────────────────────────────────────────
    // The backend doesn't search `name` — we handle ALL searching here instead.
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q)  ||
        f.title.toLowerCase().includes(q) ||
        f.skills.some(s => s.name.toLowerCase().includes(q))
      );
    }

        if (filters.categories.length > 0) {
      const selectedCats = filters.categories.map((c: string) => c.toLowerCase());
      list = list.filter(f =>
        selectedCats.some(cat => f.title.toLowerCase().includes(cat))
      );
    }

    // ── 2. Skills filter (case-insensitive) ────────────────────────────────────
    // Backend $in is case-sensitive, so we do this client-side too.
    if (filters.skills.length > 0) {
      const selectedSkillNames = filters.skills.map(id =>
        (SKILL_ID_TO_NAME[id] || id).toLowerCase()
      );
      list = list.filter(f =>
        selectedSkillNames.every(selected =>
          f.skills.some(s => s.name.toLowerCase() === selected)
        )
      );
    }

    // ── 3. Price range ──────────────────────────────────────────────────────────
    if (filters.priceRange[0] > 0) {
      list = list.filter(f => f.hourlyRate >= filters.priceRange[0]);
    }
    if (filters.priceRange[1] < 200) {
      list = list.filter(f => f.hourlyRate <= filters.priceRange[1]);
    }

    // ── 4. Availability ─────────────────────────────────────────────────────────
    if (filters.availability.length > 0) {
      const labels = filters.availability
        .map(id => AVAIL_ID_TO_LABEL[id])
        .filter(Boolean);
      list = list.filter(f => labels.includes(f.availability));
    }

    // ── 5. Rating floor ─────────────────────────────────────────────────────────
    if (filters.rating > 0) {
      list = list.filter(f => f.rating >= filters.rating);
    }

    // ── 6. Verified only ────────────────────────────────────────────────────────
    if (filters.verified) {
      list = list.filter(f => f.verified);
    }

    // ── 7. Sort ─────────────────────────────────────────────────────────────────
    switch (sortBy) {
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        list.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        list.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'experience':
        list.sort((a, b) => b.completedProjects - a.completedProjects);
        break;
      // 'recommended' / 'recent' → keep API order (rating desc by default)
    }

    // ── 8. Paginate ─────────────────────────────────────────────────────────────
    const total      = list.length;
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const safePage   = Math.min(currentPage, totalPages);
    const start      = (safePage - 1) * LIMIT;

    return {
      pageItems: list.slice(start, start + LIMIT),
      pagination: {
        total,
        page:       safePage,
        limit:      LIMIT,
        totalPages,
        hasNext:    safePage < totalPages,
        hasPrev:    safePage > 1,
      } as PaginationInfo,
    };
  }, [allProfiles, searchQuery, filters, sortBy, currentPage]);

  // Reset to page 1 whenever search/filter/sort changes (not page itself)
  const prevKeyRef = useRef('');
  useEffect(() => {
    const key = `${searchQuery}|${JSON.stringify(filters)}|${sortBy}`;
    if (prevKeyRef.current && prevKeyRef.current !== key) setCurrentPage(1);
    prevKeyRef.current = key;
  }, [searchQuery, filters, sortBy]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSearch       = (query: string) => setSearchQuery(query);
  const handleSortChange   = (sort: string)  => setSortBy(sort);
  const handleViewChange   = (v: 'grid' | 'list') => setView(v);
  const handleFilterChange = (newFilters: FilterState) => setFilters(newFilters);
  const handlePageChange   = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIdx = pagination.total === 0 ? 0 : (pagination.page - 1) * LIMIT + 1;
  const endIdx   = Math.min(pagination.page * LIMIT, pagination.total);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-3">
            Discover Top Talent
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with verified professionals ready to bring your projects to life
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Main */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <span>Loading freelancers…</span>
                ) : error ? (
                  <span className="text-destructive">{error}</span>
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-semibold text-foreground">{startIdx}–{endIdx}</span>
                    {' '}of{' '}
                    <span className="font-semibold text-foreground">{pagination.total}</span> freelancers
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <SortDropdown onSortChange={handleSortChange} />
                <ViewToggle view={view} onViewChange={handleViewChange} />
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className={`grid gap-6 mb-8 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
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
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Icon name="ExclamationCircleIcon" size={48} className="text-destructive mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load freelancers</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={() => { hasFetched.current = false; fetchAllProfiles(); }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && pageItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Icon name="UserGroupIcon" size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No freelancers found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Cards */}
            {!loading && !error && pageItems.length > 0 && (
              <div className={`grid gap-6 mb-8 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {pageItems.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} {...freelancer} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <Icon name="ChevronLeftIcon" size={20} />
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border hover:bg-muted text-foreground'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-1 text-muted-foreground">…</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <Icon name="ChevronRightIcon" size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilesInteractive;