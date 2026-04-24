// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Plus, MoreVertical, Trash2, Edit, Send, Clock, FileText } from 'lucide-react';

// export default function DraftSection() {
//   const router = useRouter();
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);
//   const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

//   // API state
//   const [drafts, setDrafts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch drafts from API
//   useEffect(() => {
//     fetchDrafts();
//   }, []);

//   const fetchDrafts = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       const res = await fetch('/api/jobs/drafts');
//       const data = await res.json();

//       if (!res.ok) {
//         if (res.status === 401) {
//           router.push('/sign-in-page');
//           return;
//         }
//         throw new Error(data.message || 'Failed to load drafts');
//       }

//       setDrafts(data.drafts || []);
//     } catch (err: any) {
//       console.error('Failed to fetch drafts:', err);
//       setError(err.message || 'Failed to load drafts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (openMenuId) {
//         const menuRef = menuRefs.current[openMenuId];
//         if (menuRef && !menuRef.contains(e.target as Node)) {
//           setOpenMenuId(null);
//         }
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [openMenuId]);

//   const handleDelete = async (draftId: string) => {
//     try {
//       const res = await fetch(`/api/jobs/drafts/${draftId}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || 'Failed to delete draft');
//       }

//       // Refresh drafts list
//       fetchDrafts();
//       setOpenMenuId(null);
//     } catch (err: any) {
//       alert(err.message || 'Failed to delete draft');
//     }
//   };

//   const handlePublishDraft = async (draftId: string) => {
//     try {
//       const res = await fetch(`/api/jobs/drafts/${draftId}`, {
//         method: 'PATCH',
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Failed to publish draft');
//       }

//       // Draft published successfully! Redirect to dashboard
//       router.push('/client-dashboard');
//     } catch (err: any) {
//       alert(err.message || 'Failed to publish draft');
//     }
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'Recently';
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return '1 day ago';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     return `${Math.floor(diffDays / 30)} months ago`;
//   };

//   function DraftCard({ draft, onClick, onDelete, onPublish }: { 
//     draft: any; 
//     onClick: () => void; 
//     onDelete: () => void;
//     onPublish: () => void;
//   }) {
//     return (
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={onClick}
//         onKeyDown={(e) => e.key === 'Enter' && onClick()}
//         className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow relative"
//       >
//         <div className="absolute top-4 right-4" ref={(el) => { menuRefs.current[draft._id] = el; }}>
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenMenuId(openMenuId === draft._id ? null : draft._id);
//             }}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             aria-label="Open menu"
//             title="Open menu"
//           >
//             <MoreVertical className="w-5 h-5 text-gray-600" />
//           </button>
//           {openMenuId === draft._id && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDelete();
//                 }}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               >
//                 <Trash2 className="w-4 h-4" />
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>

//         <div>
//           <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 lg:text-xl">
//             {draft.title || "Untitled job"}
//           </h2>
//           <div className="space-y-2 text-sm text-gray-600 lg:text-lg md:text-md xl:text-xl">
//             <div className="flex items-center gap-2">
//               <Clock className="w-4 h-4" />
//               Last edited {formatDate(draft.updatedAt || draft.createdAt)}
//             </div>
//             <div className="flex items-center gap-2">
//               <FileText className="w-4 h-4" />
//               {draft.description ? "Draft ready" : "Incomplete draft"}
//             </div>
//           </div>
//         </div>
//         <div className="pt-3 border-t">
//           <span className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium mb-2">
//             Draft
//           </span>
//           <div className="flex gap-3 mt-3">
//             <button 
//               type="button" 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 router.push(`/post-page?draftId=${draft._id}`);
//               }}
//               className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
//             >
//               <Edit className="w-4 h-4" />
//               Edit
//             </button>
//             <button 
//               type="button" 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onPublish();
//               }}
//               className="flex-1 bg-[#FF6B35] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#E5602F] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
//             >
//               <Send className="w-4 h-4" />
//               Post
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
//                 <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
//                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
//                 <div className="h-4 bg-gray-200 rounded w-full" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="text-center py-16">
//             <p className="text-red-600 mb-4">{error}</p>
//             <button
//               onClick={fetchDrafts}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {drafts.map((draft) => (
//             <DraftCard 
//               key={draft._id} 
//               draft={draft} 
//               onClick={() => router.push(`/post-page?draftId=${draft._id}`)}
//               onDelete={() => handleDelete(draft._id)}
//               onPublish={() => handlePublishDraft(draft._id)}
//             />
//           ))}

//           {/* Create New Card */}
//           <div
//             onClick={() => router.push("/post-page")}
//             className="border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-[#FF6B35] transition cursor-pointer flex items-center justify-center min-h-[280px]"
//           >
//             <div className="text-center p-6">
//               <div className="w-16 h-16 rounded-full bg-orange-50 mx-auto mb-4 flex items-center justify-center">
//                 <Plus className="w-8 h-8 text-[#FF6B35]" />
//               </div>
//               <p className="text-lg font-semibold text-[#FF6B35] mb-2">Post a job</p>
//               <p className="text-sm text-gray-600">Create a new job posting</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Trash2, Edit, Send, Clock, FileText } from 'lucide-react';

export default function DraftSection() {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // API state
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch drafts from API
  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📥 Fetching drafts from GET /api/jobs/drafts...');

      const res = await fetch('/api/jobs/drafts');
      const data = await res.json();

      console.log('📦 Drafts response:', data);

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          router.push('/sign-in-page');
          return;
        }
        throw new Error(data.message || 'Failed to load drafts');
      }

      setDrafts(data.drafts || []);
      console.log(`✅ Loaded ${data.drafts?.length || 0} drafts`);

    } catch (err: any) {
      console.error('❌ Failed to fetch drafts:', err);
      setError(err.message || 'Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId) {
        const menuRef = menuRefs.current[openMenuId];
        if (menuRef && !menuRef.contains(e.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleDelete = async (draftId: string) => {
    try {
      console.log('🗑️ Deleting draft:', draftId);

      const res = await fetch(`/api/jobs/drafts/${draftId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete draft');
      }

      console.log('✅ Draft deleted');

      // Refresh drafts list
      fetchDrafts();
      setOpenMenuId(null);
    } catch (err: any) {
      console.error('❌ Delete error:', err);
      alert(err.message || 'Failed to delete draft');
    }
  };

  const handlePublishDraft = async (draftId: string) => {
    try {
      console.log('📤 Publishing draft:', draftId);

      // ✅ NEW BACKEND: Must send { action: "publish" }
      const res = await fetch(`/api/jobs/drafts/${draftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }), // ← Required!
      });

      const data = await res.json();

      console.log('📥 Publish response:', data);

      // ✅ Check success field
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to publish draft');
      }

      console.log('✅ Draft published successfully!');

      // Draft published successfully! Redirect to dashboard
      router.push('/client-dashboard');
    } catch (err: any) {
      console.error('❌ Publish error:', err);
      alert(err.message || 'Failed to publish draft');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  function DraftCard({ draft, onClick, onDelete, onPublish }: {
    draft: any;
    onClick: () => void;
    onDelete: () => void;
    onPublish: () => void;
  }) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow relative"
      >
        <div className="absolute top-4 right-4" ref={(el) => { menuRefs.current[draft._id] = el; }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === draft._id ? null : draft._id);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
            title="Open menu"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          {openMenuId === draft._id && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 lg:text-xl">
            {draft.title || "Untitled job"}
          </h2>
          <div className="space-y-2 text-sm text-gray-600 lg:text-lg md:text-md xl:text-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last edited {formatDate(draft.updatedAt || draft.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {draft.description ? "Draft ready" : "Incomplete draft"}
            </div>
          </div>
        </div>
        <div className="pt-3 border-t">
          <span className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium mb-2">
            Draft
          </span>
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/post-page?draftId=${draft._id}`);
              }}
              className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPublish();
              }}
              className="flex-1 bg-[#FF6B35] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#E5602F] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDrafts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <DraftCard
              key={draft._id}
              draft={draft}
              onClick={() => router.push(`/post-page?draftId=${draft._id}`)}
              onDelete={() => handleDelete(draft._id)}
              onPublish={() => handlePublishDraft(draft._id)}
            />
          ))}

          {/* Create New Card */}
          <div
            onClick={() => router.push("/post-page")}
            className="border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-[#FF6B35] transition cursor-pointer flex items-center justify-center min-h-[280px]"
          >
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-orange-50 mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <p className="text-lg font-semibold text-[#FF6B35] mb-2">Post a job</p>
              <p className="text-sm text-gray-600">Create a new job posting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}