'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SearchResultCard from './SearchResultCard';
import ProjectDetailsPanel from './ProjectDetailsPanel';
import SavedSearches from './SavedSearches';
import SortOptions from './SortOptions';
import SavedJobsPanel from './SavedJobsPanel';
import Icon from '@/components/ui/AppIcon';
import SubmitProposalModal, { type JobForProposal } from '@/app/freelancer-dashboard/components/SubmitProposalModal';

interface FilterCategory {
  id: string;
  title: string;
  options: Array<{ id: string; label: string; count?: number; }>;
  type: 'checkbox' | 'radio' | 'range';
}

interface SearchResult {
  id: string;
  type: 'freelancer' | 'project';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  price?: string;
  location?: string;
  availability?: string;
  featured?: boolean;
  bids?: number;
  averageBid?: string;
  budget?: string;
  isNew?: boolean;
  postedAt?: string;
  clientName?: string;
  clientInitials?: string;
  clientRating?: number;
}

interface SavedJobItem {
  id: string;
  title: string;
  budget: string;
  category: string;
  postedAt: string;
  clientName: string;
  clientInitials: string;
  bids: number;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, string[]>;
  resultCount: number;
  createdAt: string;
  alertEnabled: boolean;
}

interface SortOption {
  id: string;
  label: string;
  icon: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

function formatBudget(budget: number): string {
  if (!budget) return 'Not specified';
  return `£${budget.toLocaleString()}`;
}

function getClientInfo(apiJob: any): { fullName: string; initials: string } {
  const firstName: string = apiJob.clientInfo?.firstName || '';
  const lastName: string = apiJob.clientInfo?.lastName || '';
  const fullName: string = (firstName || lastName)
    ? `${firstName} ${lastName}`.trim()
    : (apiJob.clientInfo?.name || 'Anonymous');
  const initials: string = [firstName, lastName]
    .filter(Boolean)
    .map((n: string) => n[0].toUpperCase())
    .join('') || fullName.slice(0, 2).toUpperCase();
  return { fullName, initials };
}

/** Map API job → SearchResult card format */
function mapJobToSearchResult(apiJob: any): SearchResult {
  const { fullName, initials } = getClientInfo(apiJob);
  return {
    id: apiJob._id,
    type: 'project',
    title: apiJob.title,
    subtitle: fullName,
    description: apiJob.description || 'No description provided',
    image: "",
    alt: apiJob.title,
    rating: apiJob.clientInfo?.rating ?? 0,
    reviewCount: 0,
    tags: [apiJob.category, apiJob.subCategory].filter(Boolean),
    price: formatBudget(apiJob.budget),
    location: 'Remote',
    availability: apiJob.jobVisibility === 'private' ? 'Invited only' : 'Open',
    featured: false,
    bids: apiJob.proposalCount ?? 0,
    averageBid: undefined,
    budget: formatBudget(apiJob.budget),
    isNew: isJobNew(apiJob.createdAt),
    postedAt: timeAgo(apiJob.createdAt),
    clientName: fullName,
    clientInitials: initials,
    clientRating: apiJob.clientInfo?.rating ?? 0,
  };
}

/** Map API job → SavedJobItem for the sidebar panel */
function mapJobToSavedItem(apiJob: any): SavedJobItem {
  const { fullName, initials } = getClientInfo(apiJob);
  return {
    id: apiJob._id,
    title: apiJob.title,
    budget: formatBudget(apiJob.budget),
    category: apiJob.category || '',
    postedAt: apiJob.createdAt ? timeAgo(apiJob.createdAt) : '',
    clientName: fullName,
    clientInitials: initials,
    bids: apiJob.proposalCount ?? 0,
  };
}

function isJobNew(createdAt: string): boolean {
  const hoursSincePosted = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return hoursSincePosted < 24;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SearchInteractive = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const isFreelancer = session?.user?.role === 'freelancer';
  if (session?.user?.role === 'client') {
    router.push('/client-dashboard');
  }
  const searchParams = useSearchParams();
  const jobIdFromQuery = searchParams.get('jobId');
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeSort, setActiveSort] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [proposalJob, setProposalJob] = useState<JobForProposal | null>(null);

  // ── Saved jobs state ──────────────────────────────────────
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savedJobsList, setSavedJobsList] = useState<SavedJobItem[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null); // debounce

  // ── Browse jobs state ─────────────────────────────────────
  const [jobs, setJobs] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setIsHydrated(true); }, []);

  // ── Load saved jobs from API on mount (only for freelancers) ─
  const fetchSavedJobs = useCallback(async () => {
    if (!isFreelancer) return;
    setSavedLoading(true);
    try {
      const res = await fetch('/api/freelancer/saved-jobs');
      if (!res.ok) return;
      const data = await res.json();
      setSavedIds(new Set(data.savedJobIds || []));
      setSavedJobsList((data.jobs || []).map(mapJobToSavedItem));
    } catch { /* silent fail */ }
    finally { setSavedLoading(false); }
  }, [isFreelancer]);

  useEffect(() => { fetchSavedJobs(); }, [fetchSavedJobs]);

  // ── FETCH JOBS FROM API (all backend-supported filters) ──────
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');

        const sortMap: Record<string, string> = {
          newest: 'recent',
          relevance: 'recent',
          'price-low': 'budget_asc',
          'price-high': 'budget_desc',
        };
        const apiSort = sortMap[activeSort] || 'recent';

        const buildParams = (category?: string) => {
          const params = new URLSearchParams();
          if (category) params.set('category', category);
          if (activeFilters.experience?.length) params.set('subCategory', activeFilters.experience[0]);
          if (activeFilters.availability?.length) params.set('projectDuration', activeFilters.availability[0]);
          if (searchQuery?.trim()) params.set('search', searchQuery.trim());
          params.set('sortBy', apiSort);
          params.set('limit', '20');
          params.set('page', '1');
          return params;
        };

        const categories = activeFilters.category?.length ? activeFilters.category : [undefined];
        const allJobsMap = new Map<string, ReturnType<typeof mapJobToSearchResult>>();

        for (const category of categories) {
          const params = buildParams(category);
          const url = `/api/jobs/browse?${params.toString()}`;
          const res = await fetch(url);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to load jobs');
          const list = (data.jobs || []) as any[];
          list.forEach((job) => {
            const mapped = mapJobToSearchResult(job);
            allJobsMap.set(mapped.id, mapped);
          });
        }

        const mappedJobs = Array.from(allJobsMap.values());
        setJobs(mappedJobs);
      } catch (err: any) {
        console.error('Failed to fetch jobs:', err);
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [activeFilters, searchQuery, activeSort]);

  // ── Handle deep-linking via jobId parameter ───────────────
  useEffect(() => {
    if (!isHydrated || !jobIdFromQuery) return;

    const handleDeepLink = async () => {
      // 1. Check if already in the list
      let targetJob = jobs.find((j) => j.id === jobIdFromQuery);

      // 2. Fetch from API if not in list
      if (!targetJob) {
        try {
          const res = await fetch(`/api/jobs/${jobIdFromQuery}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.job) {
            targetJob = mapJobToSearchResult(data.job);
            // Add to the job list so it renders in the background
            setJobs(prev => [targetJob!, ...prev]);
          }
        } catch (err) {
          console.error("Failed to fetch deep-linked job:", err);
        }
      }

      if (targetJob) {
        setSelectedResult(targetJob);
        // 3. Scroll to the card (with slight delay for render)
        setTimeout(() => {
          const element = document.getElementById(`job-${jobIdFromQuery}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    };

    handleDeepLink();
  }, [isHydrated, jobIdFromQuery, jobs]);

  const filterCategories: FilterCategory[] = [
    {
      id: 'category',
      title: 'Category',
      type: 'checkbox',
      options: [
        { id: 'Development & IT', label: 'Development & IT' },
        { id: 'Design & Creative', label: 'Design & Creative' },
        { id: 'Sales & Marketing', label: 'Sales & Marketing' },
        { id: 'Writing & Translation', label: 'Writing & Translation' },
        { id: 'Finance & Accounting', label: 'Finance & Accounting' },
        { id: 'Business & Consulting', label: 'Business & Consulting' },
        { id: 'Engineering & Architecture', label: 'Engineering & Architecture' },
        { id: 'Education & Training', label: 'Education & Training' },
        { id: 'Legal', label: 'Legal' },
        { id: 'Data & Analytics', label: 'Data & Analytics' },
        { id: 'Music & Audio', label: 'Music & Audio' },
        { id: 'Video & Animation', label: 'Video & Animation' },
        { id: 'Customer Service', label: 'Customer Service' },
        { id: 'Health & Wellness', label: 'Health & Wellness' },
        { id: 'Gaming', label: 'Gaming' },
        { id: 'Blockchain & Crypto', label: 'Blockchain & Crypto' },
        { id: 'Other', label: 'Other' },
      ],
    },
    {
      id: 'experience',
      title: 'Experience Level',
      type: 'checkbox',
      options: [
        { id: 'entry', label: 'Entry Level' },
        { id: 'intermediate', label: 'Intermediate' },
        { id: 'expert', label: 'Expert' },
      ],
    },
    {
      id: 'rate',
      title: 'Rate',
      type: 'checkbox',
      options: [
        { id: 'hourly', label: 'Hourly Rate' },
        { id: 'fixed', label: 'Fixed Rate' },
      ],
    },
    {
      id: 'availability',
      title: 'Availability',
      type: 'checkbox',
      options: [
        { id: 'full-time', label: 'Full-time' },
        { id: 'part-time', label: 'Part-time' },
        { id: 'contract', label: 'Contract' },
      ],
    },
  ];

  const savedSearches: SavedSearch[] = []; // Placeholder — implement saved searches later

  const sortOptions: SortOption[] = [
    { id: 'newest', label: 'Newest First', icon: 'ClockIcon' },
    { id: 'relevance', label: 'Most Relevant', icon: 'SparklesIcon' },
    { id: 'price-low', label: 'Price: Low to High', icon: 'ArrowUpIcon' },
    { id: 'price-high', label: 'Price: High to Low', icon: 'ArrowDownIcon' },
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Search & Discovery
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Find the perfect talent or project for your needs
            </p>
          </div>

          <div className="mb-8">
            <SearchBar onSearch={() => { }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterPanel
                categories={filterCategories}
                onFilterChange={() => { }}
                activeFilters={{}}
              />
            </div>
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search by title/description
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
  };

  // ── Toggle save via API ───────────────────────────────────
  const handleSaveItem = async (id: string) => {
    if (!isFreelancer || savingId) return;
    // Optimistic UI update
    setSavingId(id);
    const alreadySaved = savedIds.has(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      alreadySaved ? next.delete(id) : next.add(id);
      return next;
    });
    if (alreadySaved) {
      setSavedJobsList((prev) => prev.filter((j) => j.id !== id));
    } else {
      // find the job in the current list to add to saved panel
      const job = jobs.find((j) => j.id === id);
      if (job) {
        setSavedJobsList((prev) => [
          {
            id: job.id,
            title: job.title,
            budget: job.budget || job.price || 'Not specified',
            category: job.tags[0] || '',
            postedAt: job.postedAt || '',
            clientName: job.clientName || job.subtitle || 'Anonymous',
            clientInitials: job.clientInitials || job.subtitle?.slice(0, 2).toUpperCase() || '??',
            bids: job.bids ?? 0,
          },
          ...prev,
        ]);
      }
    }

    try {
      await fetch('/api/freelancer/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: id }),
      });
    } catch {
      // Revert on error
      setSavedIds((prev) => {
        const next = new Set(prev);
        alreadySaved ? next.add(id) : next.delete(id);
        return next;
      });
      await fetchSavedJobs();
    } finally {
      setSavingId(null);
    }
  };

  // Clicking a saved job in sidebar → open its detail panel
  const handleSavedJobClick = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedResult(job);
    }
  };

  const handleLoadSearch = (search: SavedSearch) => {
    setSearchQuery(search.query);
    setActiveFilters(search.filters);
  };

  const handleDeleteSearch = (id: string) => {
    console.log('Delete search:', id);
  };

  const handleToggleAlert = (id: string) => {
    console.log('Toggle alert:', id);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
  };

  // ── LOADING STATE ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Search & Discovery
            </h1>
          </div>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Loading jobs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR STATE ───────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Search & Discovery
            </h1>
          </div>
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-foreground font-medium mb-2">Failed to load jobs</p>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN RENDER ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Search & Discovery
          </h1>
          <p className="text-lg font-body text-muted-foreground">
            Find the perfect talent or project for your needs
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="lg:hidden">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-body font-semibold"
                >
                  <Icon name="AdjustmentsHorizontalIcon" size={20} />
                  <span>Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}</span>
                </button>
              </div>

              <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                <FilterPanel
                  categories={filterCategories}
                  onFilterChange={handleFilterChange}
                  activeFilters={activeFilters}
                />
              </div>

              {savedSearches.length > 0 && (
                <div className="hidden lg:block">
                  <SavedSearches
                    searches={savedSearches}
                    onLoadSearch={handleLoadSearch}
                    onDeleteSearch={handleDeleteSearch}
                    onToggleAlert={handleToggleAlert}
                  />
                </div>
              )}

              {/* Saved Jobs panel — visible only for freelancers */}
              {isFreelancer && (
                <div className="hidden lg:block">
                  <SavedJobsPanel
                    jobs={savedJobsList}
                    loading={savedLoading}
                    onJobClick={handleSavedJobClick}
                    onUnsave={handleSaveItem}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-body text-muted-foreground">
                  <span className="font-semibold text-foreground">{jobs.length}</span> results found
                </p>
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={() => setActiveFilters({})}
                    className="text-sm font-body text-accent hover:text-opacity-80 transition-colors duration-200"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <SortOptions
                  options={sortOptions}
                  activeSort={activeSort}
                  onSortChange={setActiveSort}
                />

                <div className="hidden sm:flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors duration-200 ${viewMode === 'list' ? 'bg-card text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    aria-label="List view"
                  >
                    <Icon name="ListBulletIcon" size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors duration-200 ${viewMode === 'grid' ? 'bg-card text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    aria-label="Grid view"
                  >
                    <Icon name="Squares2X2Icon" size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* EMPTY STATE */}
            {jobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={() => setActiveFilters({})}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                  {jobs.map((result) => (
                    <SearchResultCard
                      key={result.id}
                      result={result}
                      onSave={handleSaveItem}
                      isSaved={savedIds.has(result.id)}
                      onClick={(res) => setSelectedResult(res)}
                    />
                  ))}
                </div>

                <ProjectDetailsPanel
                  result={selectedResult}
                  onClose={() => setSelectedResult(null)}
                  onApply={(job) => setProposalJob(job)}
                />

                {proposalJob && (
                  <SubmitProposalModal
                    job={proposalJob}
                    onClose={() => setProposalJob(null)}
                  />
                )}

                {/* PAGINATION — TODO: Implement server-side pagination */}
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 border border-border rounded-lg font-body font-medium text-foreground hover:bg-muted transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled
                    >
                      <Icon name="ChevronLeftIcon" size={20} />
                    </button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body font-medium">
                      1
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg font-body font-medium text-foreground hover:bg-muted transition-colors duration-200">
                      <Icon name="ChevronRightIcon" size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInteractive;