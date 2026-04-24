// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useState, useEffect, useCallback } from "react";
// import {
//   Share2, FileText, Edit, X, UserPlus,
//   CheckCircle, ChevronDown, ChevronUp,
//   Save, Loader2, Trash2, AlertTriangle,
//   Copy, Send, Check
// } from "lucide-react";
// import Header from "@/components/common/Header";
// import FooterSection from "@/app/homepage/components/FooterSection";

// // ─── Types ──────────────────────────────────────────────────────────────────

// interface JobData {
//   id: string;
//   title: string;
//   postedTime: string;
//   jobId: string;
//   budget: string;
//   projectType: string;
//   category: string;
//   status: string;
//   proposalCount: number;
//   description: string;
//   hiringTimeline: string;
//   jobVisibility: string;
//   projectDuration: string;
//   freelancerSource: string;
// }

// interface Proposal {
//   _id: string;
//   freelancerId: string;          // must be returned by your API
//   proposalText: string;
//   bidAmount: number;
//   status: string;
//   createdAt: string;
//   freelancerProfile: {
//     name: string;
//     email: string;
//     hourlyRate?: number;
//     skills?: string[];
//     rating?: number;
//     completedJobs?: number;
//   };
// }

// interface EditForm {
//   title: string;
//   description: string;
//   budget: string;
//   category: string;
//   subCategory: string;
//   projectDuration: string;
//   jobVisibility: string;
// }

// // ─── Helpers ────────────────────────────────────────────────────────────────

// function timeAgo(dateString: string): string {
//   const diffMs = Date.now() - new Date(dateString).getTime();
//   const mins = Math.floor(diffMs / 60000);
//   const hours = Math.floor(mins / 60);
//   const days = Math.floor(hours / 24);
//   if (mins < 60) return `${mins} minutes ago`;
//   if (hours < 24) return `${hours} hours ago`;
//   if (days === 1) return "1 day ago";
//   if (days < 7) return `${days} days ago`;
//   return `${Math.floor(days / 7)} weeks ago`;
// }

// function formatBudget(budget: number): string {
//   if (!budget) return "Not specified";
//   return `£${budget.toLocaleString()}`;
// }

// function mapApiToJob(apiJob: any): JobData {
//   return {
//     id: apiJob._id,
//     title: apiJob.title,
//     postedTime: apiJob.createdAt ? timeAgo(apiJob.createdAt) : "Recently",
//     jobId: `#${apiJob._id.slice(-7).toUpperCase()}`,
//     budget: formatBudget(apiJob.budget),
//     projectType: apiJob.freelancerSource === "invited" ? "Private Project" : "Fixed Price Project",
//     category: [apiJob.category, apiJob.subCategory].filter(Boolean).join(" >> "),
//     status: apiJob.status === "open" ? "Active" : apiJob.status,
//     proposalCount: apiJob.proposalCount || 0,
//     description: apiJob.description,
//     hiringTimeline: apiJob.projectDuration ? `Expected duration: ${apiJob.projectDuration}` : "Timeline not specified",
//     jobVisibility: apiJob.jobVisibility || "public",
//     projectDuration: apiJob.projectDuration || "",
//     freelancerSource: apiJob.freelancerSource || "any",
//   };
// }

// async function getErrorMessage(res: Response): Promise<string> {
//   try {
//     const data = await res.json();
//     return data.message || data.error || `HTTP error ${res.status}`;
//   } catch {
//     return `HTTP error ${res.status}`;
//   }
// }

// const HIRE_MSG = "Hi! I've decided to move forward with your proposal. Let's discuss the next steps.";
// const DURATION_OPTIONS = ["Less than 1 month", "1-3 months", "3-6 months", "More than 6 months"];

// // ─── Component ──────────────────────────────────────────────────────────────

// export default function CurrentJobDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const jobId = Array.isArray(id) ? id[0] : id;

//   // Core state
//   const [job, setJob] = useState<JobData | null>(null);
//   const [proposals, setProposals] = useState<Proposal[]>([]);
//   const [jobLoading, setJobLoading] = useState(true);
//   const [proposalsLoading, setProposalsLoading] = useState(true);
//   const [jobError, setJobError] = useState("");

//   // Edit state
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editForm, setEditForm] = useState<EditForm>({
//     title: "", description: "", budget: "",
//     category: "", subCategory: "", projectDuration: "", jobVisibility: "public",
//   });
//   const [editSaving, setEditSaving] = useState(false);
//   const [editError, setEditError] = useState("");
//   const [editSuccess, setEditSuccess] = useState(false);

//   // Delete state
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteError, setDeleteError] = useState("");

//   // Public share state
//   const [showPublicShareModal, setShowPublicShareModal] = useState(false);
//   const [publicLink, setPublicLink] = useState("");
//   const [shareLoading, setShareLoading] = useState(false);
//   const [shareError, setShareError] = useState("");
//   const [copied, setCopied] = useState(false);

//   // Direct share state
//   const [showDirectShareModal, setShowDirectShareModal] = useState(false);
//   const [selectedFreelancer, setSelectedFreelancer] = useState<{ id: string; name: string; email?: string } | null>(null);
//   const [directMessage, setDirectMessage] = useState("");
//   const [directShareLoading, setDirectShareLoading] = useState(false);
//   const [directShareError, setDirectShareError] = useState("");
//   const [directShareSuccess, setDirectShareSuccess] = useState(false);

//   // Proposal UI state
//   const [showProjectDetails, setShowProjectDetails] = useState(true);
//   const [sortBy, setSortBy] = useState("Latest");
//   const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
//   const [modalTab, setModalTab] = useState("Workstream");
//   const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
//   const [rejectedIds, setRejectedIds] = useState<string[]>([]);
//   const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "messaged">("all");

//   // ── Fetch job ──────────────────────────────────────────────
//   useEffect(() => {
//     if (!jobId) return;
//     const fetchJob = async () => {
//       try {
//         setJobLoading(true);
//         const res = await fetch(`/api/jobs/${jobId}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || `HTTP error ${res.status}`);

//         const jobData = data.job || data;
//         setJob(mapApiToJob(jobData));

//         setEditForm({
//           title: jobData.title || "",
//           description: jobData.description || "",
//           budget: String(jobData.budget || ""),
//           category: jobData.category || "",
//           subCategory: jobData.subCategory || "",
//           projectDuration: jobData.projectDuration || "",
//           jobVisibility: jobData.jobVisibility || "public",
//         });
//       } catch (err: any) {
//         setJobError(err.message || "Failed to load job");
//       } finally {
//         setJobLoading(false);
//       }
//     };
//     fetchJob();
//   }, [jobId]);

//   // ── Fetch proposals ────────────────────────────────────────
//   const fetchProposals = useCallback(async () => {
//     if (!jobId) return;
//     try {
//       setProposalsLoading(true);
//       const res = await fetch(`/api/proposals?jobId=${jobId}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || `HTTP error ${res.status}`);

//       let proposalsArray: Proposal[] = [];
//       if (Array.isArray(data)) proposalsArray = data;
//       else if (data.proposals && Array.isArray(data.proposals)) proposalsArray = data.proposals;
//       else if (data.data && Array.isArray(data.data)) proposalsArray = data.data;
//       else proposalsArray = [];

//       // Ensure each proposal has a freelancerId (adjust mapping if needed)
//       proposalsArray = proposalsArray.map((p: any) => ({
//         ...p,
//         freelancerId: p.freelancerId || p.freelancer?._id,
//       }));

//       setProposals(proposalsArray);
//       setShortlistedIds(proposalsArray.filter(p => p.status === 'shortlisted').map(p => p._id));
//       setRejectedIds(proposalsArray.filter(p => p.status === 'rejected').map(p => p._id));
//       setJob((prev) => prev ? { ...prev, proposalCount: proposalsArray.length } : prev);
//     } catch (err: any) {
//       console.error('Proposals fetch error:', err);
//       setProposals([]);
//     } finally {
//       setProposalsLoading(false);
//     }
//   }, [jobId]);

//   useEffect(() => { fetchProposals(); }, [fetchProposals]);

//   // ── Scroll lock ────────────────────────────────────────────
//   useEffect(() => {
//     document.body.style.overflow = (selectedProposal || showDeleteModal || showPublicShareModal || showDirectShareModal) ? "hidden" : "unset";
//     return () => { document.body.style.overflow = "unset"; };
//   }, [selectedProposal, showDeleteModal, showPublicShareModal, showDirectShareModal]);

//   // ── Public share: generate link (updated API) ─────────────
//   const generatePublicLink = async () => {
//     try {
//       setShareLoading(true);
//       setShareError("");
//       const res = await fetch(`/api/jobs/share`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           jobId: jobId,
//           shareType: "public_link" 
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to generate link");

//       setPublicLink(data.publicUrl);
//       setShowPublicShareModal(true);
//     } catch (err: any) {
//       setShareError(err.message);
//     } finally {
//       setShareLoading(false);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(publicLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // ── Direct share (updated API) ────────────────────────────
//   const openDirectShareModal = (freelancerId: string, freelancerName: string, freelancerEmail?: string) => {
//     setSelectedFreelancer({ id: freelancerId, name: freelancerName, email: freelancerEmail });
//     setDirectMessage(`Check out this job opportunity: ${job?.title}`);
//     setDirectShareError("");
//     setDirectShareSuccess(false);
//     setShowDirectShareModal(true);
//   };

//   const sendDirectShare = async () => {
//     if (!selectedFreelancer) return;
//     try {
//       setDirectShareLoading(true);
//       setDirectShareError("");
//       const res = await fetch(`/api/jobs/share`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           jobId: jobId,
//           shareType: "direct_message",
//           freelancerId: selectedFreelancer.id,
//           message: directMessage,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to share job");

//       setDirectShareSuccess(true);
//       setTimeout(() => {
//         setShowDirectShareModal(false);
//         setDirectShareSuccess(false);
//       }, 1500);
//     } catch (err: any) {
//       setDirectShareError(err.message);
//     } finally {
//       setDirectShareLoading(false);
//     }
//   };

//   // ── EDIT — PATCH /api/jobs/[id] ───────────────────────────
//   const handleSaveEdit = async () => {
//     if (!editForm.title.trim() || !editForm.description.trim() || !editForm.budget) {
//       setEditError("Title, description and budget are required.");
//       return;
//     }
//     try {
//       setEditSaving(true);
//       setEditError("");
//       const res = await fetch(`/api/jobs/${jobId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: editForm.title,
//           description: editForm.description,
//           budget: Number(editForm.budget),
//           category: editForm.category,
//           subCategory: editForm.subCategory,
//           projectDuration: editForm.projectDuration,
//           jobVisibility: editForm.jobVisibility,
//           freelancerSource: editForm.jobVisibility === "private" ? "invited" : "any",
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to update job");

//       setJob((prev) => prev ? {
//         ...prev,
//         title: editForm.title,
//         description: editForm.description,
//         budget: formatBudget(Number(editForm.budget)),
//         category: [editForm.category, editForm.subCategory].filter(Boolean).join(" >> "),
//         projectDuration: editForm.projectDuration,
//         jobVisibility: editForm.jobVisibility,
//         hiringTimeline: editForm.projectDuration ? `Expected duration: ${editForm.projectDuration}` : "Timeline not specified",
//         projectType: editForm.jobVisibility === "private" ? "Private Project" : "Fixed Price Project",
//         freelancerSource: editForm.jobVisibility === "private" ? "invited" : "any",
//       } : prev);

//       setEditSuccess(true);
//       setTimeout(() => { setEditSuccess(false); setShowEditForm(false); }, 1500);
//     } catch (err: any) {
//       setEditError(err.message || "Failed to save changes");
//     } finally {
//       setEditSaving(false);
//     }
//   };

//   // ── DELETE — DELETE /api/jobs/[id] ────────────────────────
//   const handleDeleteJob = async () => {
//     try {
//       setDeleteLoading(true);
//       setDeleteError("");
//       const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to delete job");
//       router.push("/client-dashboard");
//     } catch (err: any) {
//       setDeleteError(err.message || "Failed to delete job");
//       setDeleteLoading(false);
//     }
//   };

//   // ── Proposal actions ───────────────────────────────────────
//   const handleShortlist = async (proposalId: string) => {
//     if (shortlistedIds.includes(proposalId)) return;
//     setShortlistedIds((prev) => [...prev, proposalId]);
//     try {
//       const res = await fetch(`/api/proposals/${proposalId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "shortlist" }),
//       });
//       if (!res.ok) throw new Error(await getErrorMessage(res));
//       await fetchProposals();
//     } catch (err: any) {
//       setShortlistedIds((prev) => prev.filter((i) => i !== proposalId));
//       alert(err.message);
//     }
//   };

//   const handleReject = async (proposalId: string) => {
//     setRejectedIds((prev) => [...prev, proposalId]);
//     setShortlistedIds((prev) => prev.filter((i) => i !== proposalId));
//     try {
//       const res = await fetch(`/api/proposals/${proposalId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "reject" }),
//       });
//       if (!res.ok) throw new Error(await getErrorMessage(res));
//       await fetchProposals();
//     } catch (err: any) {
//       setRejectedIds((prev) => prev.filter((i) => i !== proposalId));
//       alert(err.message);
//     }
//   };

//   // ── Sorting and filtering ──────────────────────────────────
//   const sortedProposals = [...proposals].sort((a, b) => {
//     if (sortBy === "Latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     if (sortBy === "Low To High") return (a.bidAmount ?? 0) - (b.bidAmount ?? 0);
//     if (sortBy === "High To Low") return (b.bidAmount ?? 0) - (a.bidAmount ?? 0);
//     return 0;
//   });

//   const shortlistedCount = proposals.filter(p => p.status === 'shortlisted').length;
//   const allCount = proposals.filter(p => p.status !== 'rejected').length;

//   const filteredProposals = sortedProposals.filter((p) => {
//     if (p.status === 'rejected') return false;
//     if (activeTab === "shortlisted") return p.status === 'shortlisted';
//     return true; // "all"
//   });

//   const tabs = [
//     { key: "all", label: `All (${allCount})` },
//     { key: "shortlisted", label: `Shortlisted (${shortlistedCount})` },
//     { key: "messaged", label: "Messaged (0)" },
//   ];

//   const handleInviteFreelancers = () => {
//     const params = new URLSearchParams({
//       jobId: jobId || "",
//       jobTitle: encodeURIComponent(job?.title || ""),
//     });
//     router.push(`/client-dashboard/invite-freelancers?${params.toString()}`);
//   };

//   // ── Loading / error ────────────────────────────────────────
//   if (jobLoading) return (
//     <div className="flex flex-col min-h-screen"><Header />
//       <main className="flex-grow flex items-center justify-center bg-white pt-24">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600 font-medium">Loading job details...</p>
//         </div>
//       </main><FooterSection />
//     </div>
//   );

//   if (jobError || !job) return (
//     <div className="flex flex-col min-h-screen"><Header />
//       <main className="flex-grow flex items-center justify-center bg-white pt-24">
//         <div className="text-center max-w-md">
//           <div className="text-5xl mb-4">⚠️</div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">{jobError || "Job not found"}</h2>
//           <button onClick={() => router.push("/client-dashboard")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Back to Dashboard</button>
//         </div>
//       </main><FooterSection />
//     </div>
//   );

//   // ── Main render ────────────────────────────────────────────
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-grow bg-white pt-24">
//         <div className="w-full">

//           {/* SPAM BANNER */}
//           <div className="bg-yellow-100 border-b border-yellow-300 px-6 py-3 flex items-center gap-3 text-sm">
//             <span className="text-yellow-800 font-semibold">⚠️ SPAM ALERT!</span>
//             <span className="text-yellow-700">Never pay a security deposit. Keep all transactions within HireHub.</span>
//           </div>

//           <div className="w-full px-6 py-6">

//             {/* JOB HEADER */}
//             <div className="p-6 mb-4 border-b border-gray-200">
//               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
//                 <div className="flex-1">
//                   <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h1>
//                   <p className="text-sm text-gray-600">{job.projectType} | Posted {job.postedTime}</p>
//                 </div>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   {/* Public Share Button */}
//                   <button
//                     onClick={generatePublicLink}
//                     disabled={shareLoading}
//                     className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
//                   >
//                     {shareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
//                     Share
//                   </button>

//                   <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
//                     <FileText className="w-4 h-4" /> Post Similar
//                   </button>

//                   <button
//                     onClick={() => { setShowEditForm(!showEditForm); setEditError(""); setEditSuccess(false); }}
//                     className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition ${showEditForm ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"}`}
//                   >
//                     <Edit className="w-4 h-4" />
//                     {showEditForm ? "Cancel Edit" : "Edit"}
//                   </button>

//                   <button
//                     onClick={() => setShowDeleteModal(true)}
//                     className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
//                   >
//                     <Trash2 className="w-4 h-4" /> Delete
//                   </button>

//                   <button onClick={handleInviteFreelancers} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
//                     <UserPlus className="w-4 h-4" /> Invite Freelancers
//                   </button>
//                 </div>
//               </div>

//               <p className="text-sm text-gray-600 mb-4">Posted In {job.category}</p>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-b border-gray-200">
//                 <div><p className="text-sm text-gray-600 mb-1">Budget</p><p className="text-lg font-semibold text-gray-900">{job.budget}</p></div>
//                 <div><p className="text-sm text-gray-600 mb-1">Proposals</p><p className="text-lg font-semibold text-gray-900">{proposalsLoading ? "..." : job.proposalCount}</p></div>
//                 <div><p className="text-sm text-gray-600 mb-1">Job ID</p><p className="text-lg font-semibold text-gray-900">{job.jobId}</p></div>
//                 <div><p className="text-sm text-gray-600 mb-1">Status</p><p className="text-lg font-semibold text-green-600">{job.status}</p></div>
//               </div>

//               <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
//                 <CheckCircle className="w-5 h-5 text-blue-600" />
//                 <span className="text-sm text-blue-800 font-medium">{job.hiringTimeline}</span>
//               </div>
//             </div>

//             {/* EDIT FORM */}
//             {showEditForm && (
//               <div className="mx-0 mb-6 border border-blue-200 rounded-xl bg-blue-50/40 p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
//                   <Edit className="w-5 h-5 text-blue-600" /> Edit Job Details
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
//                     <input type="text" value={editForm.title}
//                       onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                       placeholder="Job title" />
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
//                     <textarea rows={6} value={editForm.description}
//                       onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
//                       placeholder="Describe the job" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Budget (£) *</label>
//                     <input type="number" min="1" value={editForm.budget}
//                       onChange={(e) => setEditForm((f) => ({ ...f, budget: e.target.value }))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                       placeholder="e.g. 500" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Project Duration</label>
//                     <select value={editForm.projectDuration}
//                       onChange={(e) => setEditForm((f) => ({ ...f, projectDuration: e.target.value }))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
//                       <option value="">Select duration</option>
//                       {DURATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                     <input type="text" value={editForm.category}
//                       onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                       placeholder="e.g. Web Development" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
//                     <input type="text" value={editForm.subCategory}
//                       onChange={(e) => setEditForm((f) => ({ ...f, subCategory: e.target.value }))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                       placeholder="e.g. Website Design" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
//                     <select value={editForm.jobVisibility}
//                       onChange={(e) => setEditForm((f) => ({ ...f, jobVisibility: e.target.value }))}
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
//                       <option value="public">Public — Open to all freelancers</option>
//                       <option value="private">Private — Invited freelancers only</option>
//                     </select>
//                   </div>
//                 </div>

//                 {editError && <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{editError}</div>}
//                 {editSuccess && (
//                   <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
//                     <CheckCircle className="w-4 h-4" /> Job updated successfully!
//                   </div>
//                 )}

//                 <div className="mt-5 flex gap-3">
//                   <button onClick={handleSaveEdit} disabled={editSaving}
//                     className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-60">
//                     {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                     {editSaving ? "Saving..." : "Save Changes"}
//                   </button>
//                   <button onClick={() => { setShowEditForm(false); setEditError(""); }}
//                     className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* MAIN GRID */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 space-y-4">

//                 {/* Project Details */}
//                 <div className="p-6 border-b border-gray-200">
//                   <button onClick={() => setShowProjectDetails(!showProjectDetails)}
//                     className="w-full flex items-center justify-between text-lg font-semibold text-gray-900 mb-4">
//                     <span>Project Details</span>
//                     {showProjectDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                   </button>
//                   {showProjectDetails && (
//                     <div className="space-y-4 text-gray-700">
//                       <p className="whitespace-pre-wrap">{job.description}</p>
//                       <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
//                         <div><span className="text-gray-500">Duration: </span><span className="font-medium">{job.projectDuration || "Not specified"}</span></div>
//                         <div><span className="text-gray-500">Open to: </span><span className="font-medium">{job.freelancerSource === "invited" ? "Invited only" : "All freelancers"}</span></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Proposals */}
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       {proposalsLoading ? "Loading..." : `${proposals.length} Proposal${proposals.length !== 1 ? "s" : ""}`}
//                     </h2>
//                     <div className="flex items-center gap-2">
//                       {["Latest", "Low To High", "High To Low"].map((opt) => (
//                         <button key={opt} onClick={() => setSortBy(opt)}
//                           className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${sortBy === opt ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
//                           {opt}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
//                     {tabs.map(({ key, label }) => (
//                       <button key={key} onClick={() => setActiveTab(key as any)}
//                         className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${activeTab === key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
//                         {label}
//                       </button>
//                     ))}
//                   </div>

//                   {proposalsLoading && (
//                     <div className="space-y-4">
//                       {[1, 2].map((i) => (
//                         <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
//                           <div className="flex gap-4">
//                             <div className="w-16 h-16 rounded-full bg-gray-200" />
//                             <div className="flex-1 space-y-3">
//                               <div className="h-4 bg-gray-200 rounded w-1/3" />
//                               <div className="h-3 bg-gray-200 rounded w-full" />
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {!proposalsLoading && proposals.length === 0 && (
//                     <div className="text-center py-16 text-gray-500">
//                       <div className="text-5xl mb-4">📭</div>
//                       <p className="font-medium text-gray-700">No proposals yet</p>
//                       <p className="text-sm mt-1">Freelancers haven't applied yet.</p>
//                     </div>
//                   )}

//                   {!proposalsLoading && (
//                     <div className="space-y-6">
//                       {filteredProposals.map((proposal) => {
//                         const name = proposal.freelancerProfile?.name || "Freelancer";
//                         const email = proposal.freelancerProfile?.email || "";
//                         const isShortlisted = proposal.status === 'shortlisted' || shortlistedIds.includes(proposal._id);

//                         return (
//                           <div key={proposal._id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
//                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                               <div className="lg:col-span-2">
//                                 <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Proposal Details</p>
//                                 <div className="flex gap-4">
//                                   <div className="flex-shrink-0">
//                                     <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
//                                       <span className="text-xl font-semibold text-blue-600">{name.charAt(0).toUpperCase()}</span>
//                                     </div>
//                                   </div>
//                                   <div className="flex-1 min-w-0">
//                                     <div className="flex items-center gap-2 mb-1 flex-wrap">
//                                       <h3 className="text-lg font-semibold text-blue-600 truncate max-w-[200px]">{name}</h3>
//                                       {isShortlisted && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Shortlisted</span>}
//                                       {proposal.freelancerProfile?.rating && (
//                                         <span className="text-sm text-gray-500">⭐ {proposal.freelancerProfile.rating.toFixed(1)}</span>
//                                       )}
//                                     </div>
//                                     <p className="text-sm text-gray-500 mb-1 break-words">{email}</p>
//                                     <p className="text-xs text-gray-400 mb-3 break-words">
//                                       {proposal.freelancerProfile?.completedJobs || 0} jobs completed • Submitted {timeAgo(proposal.createdAt)}
//                                     </p>
//                                     <p className="text-sm text-gray-700 mb-4 line-clamp-3 whitespace-pre-wrap break-words">
//                                       {proposal.proposalText}
//                                     </p>
//                                     <div className="flex items-center gap-3 flex-wrap">
//                                       <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
//                                         Workstream
//                                       </button>

//                                       <button
//                                         onClick={() => handleReject(proposal._id)}
//                                         className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm"
//                                       >
//                                         Reject
//                                       </button>

//                                       {isShortlisted ? (
//                                         <>
//                                           <button
//                                             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
//                                           >
//                                             Accept & Hire
//                                           </button>
//                                           <button
//                                             onClick={() => {
//                                               const p = new URLSearchParams({
//                                                 hireFreelancer: email,
//                                                 initialMessage: HIRE_MSG,
//                                                 offerBudget: job.budget,
//                                                 offerJobTitle: job.title,
//                                                 offerJobId: jobId || "",
//                                               });
//                                               router.push(`/client/messages?${p.toString()}`);
//                                             }}
//                                             className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm"
//                                           >
//                                             Message
//                                           </button>
//                                         </>
//                                       ) : (
//                                         <button
//                                           onClick={() => handleShortlist(proposal._id)}
//                                           className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
//                                         >
//                                           Shortlist
//                                         </button>
//                                       )}

//                                       <button
//                                         onClick={() => setSelectedProposal(proposal)}
//                                         className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm"
//                                       >
//                                         View Proposal
//                                       </button>

//                                       {/* Direct share button */}
//                                       <button
//                                         onClick={() => openDirectShareModal(proposal.freelancerId, name, email)}
//                                         className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium text-sm"
//                                       >
//                                         <Share2 className="w-4 h-4 inline mr-1" /> Share
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="lg:col-span-1 border-l border-gray-200 pl-6">
//                                 <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Proposed Amount</p>
//                                 <p className="text-2xl font-bold text-gray-900 mb-2 break-words">£{proposal.bidAmount?.toLocaleString()}</p>
//                                 <p className="text-xs text-gray-500">Submitted {timeAgo(proposal.createdAt)}</p>
//                                 <div className="mt-4 pt-4 border-t border-gray-100">
//                                   <p className="text-xs text-gray-500">Status</p>
//                                   <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded capitalize ${
//                                     proposal.status === "shortlisted" ? "bg-green-100 text-green-700" :
//                                     proposal.status === "rejected" ? "bg-red-100 text-red-700" :
//                                     "bg-gray-100 text-gray-600"
//                                   }`}>
//                                     {proposal.status}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT SIDEBAR */}
//               <div className="space-y-4">
//                 <div className="p-6 border border-gray-200 rounded-lg space-y-3 text-sm">
//                   <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
//                   <div><span className="text-gray-500">Status: </span><span className="font-medium text-green-600">{job.status}</span></div>
//                   <div><span className="text-gray-500">Job ID: </span><span className="font-medium text-gray-900">{job.jobId}</span></div>
//                   <div><span className="text-gray-500">Visibility: </span><span className="font-medium text-gray-900 capitalize">{job.jobVisibility}</span></div>
//                   <div><span className="text-gray-500">Duration: </span><span className="font-medium text-gray-900">{job.projectDuration || "Not specified"}</span></div>
//                   <div><span className="text-gray-500">Budget: </span><span className="font-medium text-gray-900">{job.budget}</span></div>
//                   <div className="pt-3 border-t border-gray-100">
//                     <button onClick={() => setShowDeleteModal(true)}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium">
//                       <Trash2 className="w-4 h-4" /> Delete This Job
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* DELETE MODAL */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
//           onClick={() => !deleteLoading && setShowDeleteModal(false)}>
//           <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
//                 <AlertTriangle className="w-6 h-6 text-red-600" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Delete this job?</h2>
//                 <p className="text-sm text-gray-500">This action cannot be undone.</p>
//               </div>
//             </div>
//             <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm text-gray-700">
//               <span className="font-medium">"{job.title}"</span>
//               <p className="text-gray-500 mt-1">All proposals for this job will also be removed.</p>
//             </div>
//             {deleteError && (
//               <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{deleteError}</div>
//             )}
//             <div className="flex gap-3">
//               <button onClick={() => { setShowDeleteModal(false); setDeleteError(""); }} disabled={deleteLoading}
//                 className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50">
//                 Cancel
//               </button>
//               <button onClick={handleDeleteJob} disabled={deleteLoading}
//                 className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
//                 {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
//                 {deleteLoading ? "Deleting..." : "Yes, Delete Job"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PUBLIC SHARE MODAL */}
//       {showPublicShareModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => !shareLoading && setShowPublicShareModal(false)}>
//           <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-900">Public Share Link</h2>
//               <button onClick={() => setShowPublicShareModal(false)} className="text-gray-500 hover:text-gray-900">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             {shareError && (
//               <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{shareError}</div>
//             )}
//             {publicLink && (
//               <div className="flex items-center gap-2 mb-4">
//                 <input
//                   type="text"
//                   readOnly
//                   value={publicLink}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
//                 />
//                 <button
//                   onClick={copyToClipboard}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
//                 >
//                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                   {copied ? "Copied!" : "Copy"}
//                 </button>
//               </div>
//             )}
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowPublicShareModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DIRECT SHARE MODAL */}
//       {showDirectShareModal && selectedFreelancer && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => !directShareLoading && setShowDirectShareModal(false)}>
//           <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-900">Share Job with {selectedFreelancer.name}</h2>
//               <button onClick={() => setShowDirectShareModal(false)} className="text-gray-500 hover:text-gray-900">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             {directShareError && (
//               <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{directShareError}</div>
//             )}
//             {directShareSuccess && (
//               <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4" /> Job shared successfully!
//               </div>
//             )}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
//               <textarea
//                 rows={4}
//                 value={directMessage}
//                 onChange={(e) => setDirectMessage(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Add a personal message..."
//               />
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDirectShareModal(false)}
//                 disabled={directShareLoading}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={sendDirectShare}
//                 disabled={directShareLoading || directShareSuccess}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
//               >
//                 {directShareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
//                 {directShareLoading ? "Sending..." : "Send"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PROPOSAL DETAIL MODAL */}
//       {selectedProposal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//           onClick={() => setSelectedProposal(null)}>
//           <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//               <div className="flex items-center gap-2">
//                 {["Workstream", "Shortlist"].map((tab) => (
//                   <button key={tab} onClick={() => setModalTab(tab)}
//                     className={`px-4 py-2 text-sm font-medium border-b-2 transition ${modalTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"}`}>
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//               <button onClick={() => setSelectedProposal(null)} className="text-gray-500 hover:text-gray-900">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//               <p className="text-sm text-gray-700"><span className="font-semibold">Proposed Amount:</span> £{selectedProposal.bidAmount?.toLocaleString()}</p>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-3">Cover Letter</h3>
//                   <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{selectedProposal.proposalText}</p>
//                   <p className="text-xs text-gray-400 mt-4">Submitted {timeAgo(selectedProposal.createdAt)}</p>
//                 </div>
//                 <div className="border-l border-gray-200 pl-6">
//                   <h3 className="font-semibold text-gray-900 mb-4">Freelancer</h3>
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                       <span className="text-lg font-semibold text-blue-600">{(selectedProposal.freelancerProfile?.name || "F").charAt(0)}</span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">{selectedProposal.freelancerProfile?.name || "Freelancer"}</p>
//                       <p className="text-sm text-gray-500 break-words">{selectedProposal.freelancerProfile?.email}</p>
//                     </div>
//                   </div>
//                   {selectedProposal.freelancerProfile?.skills && selectedProposal.freelancerProfile.skills.length > 0 && (
//                     <div className="mb-4">
//                       <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedProposal.freelancerProfile.skills.map((skill, i) => (
//                           <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">{skill}</span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex gap-3 mt-6">
//                     {!shortlistedIds.includes(selectedProposal._id) && selectedProposal.status !== 'shortlisted' ? (
//                       <button onClick={() => { handleShortlist(selectedProposal._id); setSelectedProposal(null); }}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Shortlist</button>
//                     ) : (
//                       <>
//                         <button
//                           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
//                         >
//                           Accept & Hire
//                         </button>
//                         <button onClick={() => {
//                           const p = new URLSearchParams({
//                             hireFreelancer: selectedProposal.freelancerProfile?.email || "",
//                             initialMessage: HIRE_MSG,
//                             offerBudget: job.budget,
//                             offerJobTitle: job.title,
//                             offerJobId: jobId || "",
//                           });
//                           router.push(`/client/messages?${p.toString()}`);
//                           setSelectedProposal(null);
//                         }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
//                           Message
//                         </button>
//                       </>
//                     )}
//                     <button onClick={() => { handleReject(selectedProposal._id); setSelectedProposal(null); }}
//                       className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">Reject</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <FooterSection />
//     </div>
//   );
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Share2, FileText, Edit, X, UserPlus,
  CheckCircle, ChevronDown, ChevronUp,
  Save, Loader2, Trash2, AlertTriangle,
  Copy, Send, Check
} from "lucide-react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import { useclientSendMessage } from "@/app/hook/useProfile";
import { useProposalChat } from "@/app/hook/useProposalChat";

// ─── Types ──────────────────────────────────────────────────────────────────

interface JobData {
  id: string;
  title: string;
  postedTime: string;
  jobId: string;
  budget: string;
  projectType: string;
  category: string;
  status: string;
  proposalCount: number;
  description: string;
  hiringTimeline: string;
  jobVisibility: string;
  projectDuration: string;
  freelancerSource: string;
}

interface Proposal {
  _id: string;
  freelancerId: string;
  proposalText: string;
  bidAmount: number;
  status: string;
  createdAt: string;
  resumeVideos?: ResumeVideoItem[];
  resumeUrl: string;
  freelancerProfile: {
    name: string;
    email: string;
    hourlyRate?: number;
    skills?: string[];
    rating?: number;
    completedJobs?: number;
  };
}
interface ResumeVideoItem {
  url: string;
  title?: string;
  uploadedAt?: string;
}

interface EditForm {
  title: string;
  description: string;
  budget: string;
  category: string;
  subCategory: string;
  projectDuration: string;
  jobVisibility: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

function formatBudget(budget: number): string {
  if (!budget) return "Not specified";
  return `£${budget.toLocaleString()}`;
}

function mapApiToJob(apiJob: any): JobData {
  return {
    id: apiJob._id,
    title: apiJob.title,
    postedTime: apiJob.createdAt ? timeAgo(apiJob.createdAt) : "Recently",
    jobId: `#${apiJob._id.slice(-7).toUpperCase()}`,
    budget: formatBudget(apiJob.budget),
    projectType: apiJob.freelancerSource === "invited" ? "Private Project" : "Fixed Price Project",
    category: [apiJob.category, apiJob.subCategory].filter(Boolean).join(" >> "),
    status: apiJob.status === "open" ? "Active" : apiJob.status,
    proposalCount: apiJob.proposalCount || 0,
    description: apiJob.description,
    hiringTimeline: apiJob.projectDuration ? `Expected duration: ${apiJob.projectDuration}` : "Timeline not specified",
    jobVisibility: apiJob.jobVisibility || "public",
    projectDuration: apiJob.projectDuration || "",
    freelancerSource: apiJob.freelancerSource || "any",
  };
}

async function getErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.message || data.error || `HTTP error ${res.status}`;
  } catch {
    return `HTTP error ${res.status}`;
  }
}

const HIRE_MSG = "Hi! I've decided to move forward with your proposal. Let's discuss the next steps.";
const DURATION_OPTIONS = ["Less than 1 month", "1-3 months", "3-6 months", "More than 6 months"];

// ─── Component ──────────────────────────────────────────────────────────────

export default function CurrentJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const jobId = Array.isArray(id) ? id[0] : id;
  const currentUserId = session?.user?.id || "";

  // Mini chat panel state
  const [miniChat, setMiniChat] = useState<{ chatId: string; peerName: string; peerId: string } | null>(null);
  const [miniChatMessages, setMiniChatMessages] = useState<any[]>([]);
  const [miniChatInput, setMiniChatInput] = useState("");
  const [miniChatLoading, setMiniChatLoading] = useState(false);
  const [miniChatSending, setMiniChatSending] = useState(false);
  const [miniChatMinimised, setMiniChatMinimised] = useState(false);
  const miniChatEndRef = useRef<HTMLDivElement>(null);

  // Core state
  const [job, setJob] = useState<JobData | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [jobLoading, setJobLoading] = useState(true);
  const [proposalsLoading, setProposalsLoading] = useState(true);
  const [jobError, setJobError] = useState("");

  // Edit state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "", description: "", budget: "",
    category: "", subCategory: "", projectDuration: "", jobVisibility: "public",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Public share state
  const [showPublicShareModal, setShowPublicShareModal] = useState(false);
  const [publicLink, setPublicLink] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [copied, setCopied] = useState(false);

  // Direct share state
  const [showDirectShareModal, setShowDirectShareModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<{ id: string; name: string; email?: string } | null>(null);
  const [directMessage, setDirectMessage] = useState("");
  const [directShareLoading, setDirectShareLoading] = useState(false);
  const [directShareError, setDirectShareError] = useState("");
  const [directShareSuccess, setDirectShareSuccess] = useState(false);

  // Proposal UI state
  const [showProjectDetails, setShowProjectDetails] = useState(true);
  const [sortBy, setSortBy] = useState("Latest");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [modalTab, setModalTab] = useState("Workstream");
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "messaged">("all");
  // Message button loading state — tracks which proposal is being opened
  const [messagingProposalId, setMessagingProposalId] = useState<string | null>(null);
  const {
    mutateAsync: clientSendMessage,
    isPending: clientSendMessageLoading
  } = useclientSendMessage();
  // ── Fetch job ──────────────────────────────────────────────
  useEffect(() => {
    if (!jobId) return;
    const fetchJob = async () => {
      try {
        setJobLoading(true);
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP error ${res.status}`);

        const jobData = data.job || data;
        setJob(mapApiToJob(jobData));

        setEditForm({
          title: jobData.title || "",
          description: jobData.description || "",
          budget: String(jobData.budget || ""),
          category: jobData.category || "",
          subCategory: jobData.subCategory || "",
          projectDuration: jobData.projectDuration || "",
          jobVisibility: jobData.jobVisibility || "public",
        });
      } catch (err: any) {
        setJobError(err.message || "Failed to load job");
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  // ── Fetch proposals ────────────────────────────────────────
  const fetchProposals = useCallback(async () => {
    if (!jobId) return;
    try {
      setProposalsLoading(true);
      console.log('📥 Fetching proposals for job:', jobId);

      const res = await fetch(`/api/proposals?jobId=${jobId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP error ${res.status}`);

      let proposalsArray: Proposal[] = [];
      if (Array.isArray(data)) proposalsArray = data;
      else if (data.proposals && Array.isArray(data.proposals)) proposalsArray = data.proposals;
      else if (data.data && Array.isArray(data.data)) proposalsArray = data.data;
      else proposalsArray = [];

      // ✅ FIX: Ensure each proposal has freelancerId (ObjectId)
      proposalsArray = proposalsArray.map((p: any) => {
        console.log('🔍 Proposal data:', {
          proposalId: p._id,
          freelancerId: p.freelancerId,
          freelancer_id: p.freelancer?._id,
          freelancerProfile_id: p.freelancerProfile?._id,
          name: p.freelancerProfile?.name
        });

        return {
          ...p,
          // Try multiple possible sources for freelancerId
          freelancerId: p.freelancerId || p.freelancer?._id || p.freelancerProfile?._id || p._id
        };
      });

      console.log('✅ Mapped proposals with freelancerIds:', proposalsArray.map(p => ({
        proposalId: p._id,
        freelancerId: p.freelancerId,
        hasFreelancerId: !!p.freelancerId,
        name: p.freelancerProfile?.name
      })));

      setProposals(proposalsArray);
      setShortlistedIds(proposalsArray.filter(p => p.status === 'shortlisted').map(p => p._id));
      setRejectedIds(proposalsArray.filter(p => p.status === 'rejected').map(p => p._id));
      setJob((prev) => prev ? { ...prev, proposalCount: proposalsArray.length } : prev);
    } catch (err: any) {
      console.error('❌ Proposals fetch error:', err);
      setProposals([]);
    } finally {
      setProposalsLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  // ── Scroll lock ────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = (selectedProposal || showDeleteModal || showPublicShareModal || showDirectShareModal) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProposal, showDeleteModal, showPublicShareModal, showDirectShareModal]);

  // ── Public share: generate link ───────────────────────────
  const generatePublicLink = async () => {
    try {
      setShareLoading(true);
      setShareError("");
      const res = await fetch(`/api/jobs/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId,
          shareType: "public_link"
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate link");

      setPublicLink(data.publicUrl);
      setShowPublicShareModal(true);
    } catch (err: any) {
      setShareError(err.message);
    } finally {
      setShareLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Direct share (FIXED) ───────────────────────────────────
  const openDirectShareModal = (freelancerId: string, freelancerName: string, freelancerEmail?: string) => {
    console.log('📤 Opening share modal for:', {
      freelancerId,
      freelancerName,
      freelancerEmail,
      hasFreelancerId: !!freelancerId
    });

    if (!freelancerId) {
      setDirectShareError("Unable to share - freelancer ID not found");
      console.error('❌ No freelancerId provided');
      return;
    }

    setSelectedFreelancer({ id: freelancerId, name: freelancerName, email: freelancerEmail });
    setDirectMessage(`Check out this job opportunity: ${job?.title}`);
    setDirectShareError("");
    setDirectShareSuccess(false);
    setShowDirectShareModal(true);
  };

  // const sendDirectShare = async () => {
  //   if (!selectedFreelancer) return;

  //   try {
  //     setDirectShareLoading(true);
  //     setDirectShareError("");

  //     console.log('📤 Sending share request:', {
  //       jobId: jobId,
  //       shareType: "direct_message",
  //       freelancerId: selectedFreelancer.id,
  //       message: directMessage
  //     });

  //     const res = await fetch(`/api/jobs/share`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         jobId: jobId,
  //         shareType: "direct_message",
  //         freelancerId: selectedFreelancer.id,
  //         message: directMessage,
  //       }),
  //     });

  //     const data = await res.json();

  //     console.log('📥 Share response:', data);

  //     if (!res.ok) throw new Error(data.message || "Failed to share job");

  //     setDirectShareSuccess(true);
  //     setTimeout(() => {
  //       setShowDirectShareModal(false);
  //       setDirectShareSuccess(false);
  //     }, 1500);
  //   } catch (err: any) {
  //     console.error('❌ Share error:', err);
  //     setDirectShareError(err.message);
  //   } finally {
  //     setDirectShareLoading(false);
  //   }
  // };

  // ── Replace the sendDirectShare function in current-jobs/[id]/page.tsx ──────

  const sendDirectShare = async () => {
    if (!selectedFreelancer) return;

    try {
      setDirectShareLoading(true);
      setDirectShareError("");

      const res = await fetch(`/api/jobs/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId,
          shareType: "direct_message",
          freelancerId: selectedFreelancer.id,
          message: directMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to share job");

      setDirectShareSuccess(true);

      // ✅ KEY FIX: The share response returns chatId from the backend.
      // Redirect to /client/messages?chatId=XXX so ChatPage opens
      // that specific chat directly — bypassing the broken list route.
      setTimeout(() => {
        setShowDirectShareModal(false);
        setDirectShareSuccess(false);

        if (data.chatId) {
          // Navigate to messages and open the chat that was just created/updated
          const name = encodeURIComponent(selectedFreelancer.name || selectedFreelancer.email || "");
          router.push(`/client/messages?chatId=${data.chatId.toString()}&peerName=${name}`);
        }
      }, 1000);

    } catch (err: any) {
      console.error("❌ Share error:", err);
      setDirectShareError(err.message);
    } finally {
      setDirectShareLoading(false);
    }
  };

  // ── Mini-chat helpers ─────────────────────────────────────
  const fetchMiniChatMessages = useCallback(async (chatId: string) => {
    setMiniChatLoading(true);
    try {
      const res = await fetch(`/api/chat/messages?chatId=${chatId}`);
      const data = await res.json();
      setMiniChatMessages(data.messages || []);
      setTimeout(() => miniChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      console.error("❌ fetchMiniChatMessages:", err);
    } finally {
      setMiniChatLoading(false);
    }
  }, []);

  const sendMiniChatMessage = async () => {
    if (!miniChatInput.trim() || !miniChat || miniChatSending) return;
    const text = miniChatInput.trim();
    setMiniChatInput("");
    setMiniChatSending(true);

    // Optimistic update
    const optimistic = { _id: Date.now().toString(), senderId: currentUserId, content: text, timestamp: new Date() };
    setMiniChatMessages(prev => [...prev, optimistic]);
    setTimeout(() => miniChatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: miniChat.chatId,
          message: {
            senderId: currentUserId,
            receiverId: miniChat.peerId,
            content: text,
            messageType: "text",
            timestamp: new Date(),
          },
        }),
      });
    } catch (err) {
      console.error("❌ sendMiniChatMessage:", err);
    } finally {
      setMiniChatSending(false);
    }
  };

  // ── Open chat from Message button on proposal card ────────
  // Calls /api/jobs/share to create/find the chat, then navigates to
  // /client/messages?chatId=XXX&peerName=NAME so ChatPage auto-opens
  // the specific conversation — no need to search for the freelancer.
  // const handleOpenChat = async (proposal: Proposal) => {
  //   const freelancerId = proposal.freelancerId;
  //   const name = proposal.freelancerProfile?.name || "Freelancer";

  //   if (!freelancerId) {
  //     router.push("/client/messages");
  //     return;
  //   }

  //   try {
  //     setMessagingProposalId(proposal._id);

  //     const res = await fetch(`/api/jobs/share`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         jobId: jobId,
  //         shareType: "direct_message",
  //         freelancerId: freelancerId,
  //         message: `Hi ${name}! I reviewed your proposal for "${job?.title}". Let's discuss further.`,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (data.chatId) {
  //       // ✅ Navigate to /client/messages with chatId in URL so ChatPage
  //       // auto-selects and opens this freelancer's conversation directly.
  //       const encodedName = encodeURIComponent(name);
  //       router.push(`/client/messages?chatId=${data.chatId}&peerName=${encodedName}`);
  //     } else {
  //       router.push("/client/messages");
  //     }
  //   } catch (err) {
  //     console.error("❌ Failed to open chat:", err);
  //     router.push("/client/messages");
  //   } finally {
  //     setMessagingProposalId(null);
  //     setSelectedProposal(null);
  //   }
  // };
  const handleOpenChat = async (proposal: Proposal) => {
    const freelancerId = proposal.freelancerId;
    const name = proposal.freelancerProfile?.name || "Freelancer";

    if (!freelancerId) {
      router.push("/client/messages");
      return;
    }

    setMessagingProposalId(proposal._id);

    try {
      // POST to find-or-create a chat (creates a new chat doc in MongoDB if needed)
      const res = await fetch(`/api/chat/with-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: freelancerId, jobId: jobId }),
      });
      const data = res.ok ? await res.json() : {};

      // chatId returned directly from POST response
      const chatId: string | null = data?.chatId ?? null;

      // 2. Build URL params — always include otherUserId + jobId + peerName
      const params = new URLSearchParams();
      params.set("otherUserId", freelancerId);
      if (jobId) params.set("jobId", jobId);
      if (proposal._id) params.set("proposalId", String(proposal._id));
      params.set("peerName", encodeURIComponent(name));
      if (chatId) params.set("chatId", chatId);

      // 3. Navigate
      router.push(`/client/messages?${params.toString()}`);
    } catch (err) {
      console.error("❌ Failed to open chat:", err);
      // Still navigate but keep the params so ChatPage can auto-create or find the chat
      const params = new URLSearchParams();
      params.set("otherUserId", freelancerId);
      if (jobId) params.set("jobId", jobId);
      if (proposal._id) params.set("proposalId", String(proposal._id));
      params.set("peerName", encodeURIComponent(name));
      router.push(`/client/messages?${params.toString()}`);
    } finally {
      setMessagingProposalId(null);
      setSelectedProposal(null);
    }
  };


  // ── EDIT — PATCH /api/jobs/[id] ───────────────────────────
  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.budget) {
      setEditError("Title, description and budget are required.");
      return;
    }
    try {
      setEditSaving(true);
      setEditError("");
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          budget: Number(editForm.budget),
          category: editForm.category,
          subCategory: editForm.subCategory,
          projectDuration: editForm.projectDuration,
          jobVisibility: editForm.jobVisibility,
          freelancerSource: editForm.jobVisibility === "private" ? "invited" : "any",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update job");

      setJob((prev) => prev ? {
        ...prev,
        title: editForm.title,
        description: editForm.description,
        budget: formatBudget(Number(editForm.budget)),
        category: [editForm.category, editForm.subCategory].filter(Boolean).join(" >> "),
        projectDuration: editForm.projectDuration,
        jobVisibility: editForm.jobVisibility,
        hiringTimeline: editForm.projectDuration ? `Expected duration: ${editForm.projectDuration}` : "Timeline not specified",
        projectType: editForm.jobVisibility === "private" ? "Private Project" : "Fixed Price Project",
        freelancerSource: editForm.jobVisibility === "private" ? "invited" : "any",
      } : prev);

      setEditSuccess(true);
      setTimeout(() => { setEditSuccess(false); setShowEditForm(false); }, 1500);
    } catch (err: any) {
      setEditError(err.message || "Failed to save changes");
    } finally {
      setEditSaving(false);
    }
  };

  // ── DELETE — DELETE /api/jobs/[id] ────────────────────────
  const handleDeleteJob = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete job");
      router.push("/client-dashboard");
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete job");
      setDeleteLoading(false);
    }
  };

  // ── Proposal actions ───────────────────────────────────────
  const handleShortlist = async (proposalId: string) => {
    if (shortlistedIds.includes(proposalId)) return;
    setShortlistedIds((prev) => [...prev, proposalId]);
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "shortlist" }),
      });
      if (!res.ok) throw new Error(await getErrorMessage(res));
      await fetchProposals();
    } catch (err: any) {
      setShortlistedIds((prev) => prev.filter((i) => i !== proposalId));
      alert(err.message);
    }
  };

  const handleReject = async (proposalId: string) => {
    setRejectedIds((prev) => [...prev, proposalId]);
    setShortlistedIds((prev) => prev.filter((i) => i !== proposalId));
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });
      if (!res.ok) throw new Error(await getErrorMessage(res));
      await fetchProposals();
    } catch (err: any) {
      setRejectedIds((prev) => prev.filter((i) => i !== proposalId));
      alert(err.message);
    }
  };

  // ── Sorting and filtering ──────────────────────────────────
  const sortedProposals = [...proposals].sort((a, b) => {
    if (sortBy === "Latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "Low To High") return (a.bidAmount ?? 0) - (b.bidAmount ?? 0);
    if (sortBy === "High To Low") return (b.bidAmount ?? 0) - (a.bidAmount ?? 0);
    return 0;
  });

  const shortlistedCount = proposals.filter(p => p.status === 'shortlisted').length;
  const allCount = proposals.filter(p => p.status !== 'rejected').length;

  const filteredProposals = sortedProposals.filter((p) => {
    if (p.status === 'rejected') return false;
    if (activeTab === "shortlisted") return p.status === 'shortlisted';
    return true;
  });
  console.log("proposal resume video", proposals)
  const tabs = [
    { key: "all", label: `All (${allCount})` },
    { key: "shortlisted", label: `Shortlisted (${shortlistedCount})` },
    { key: "messaged", label: "Messaged (0)" },
  ];

  const handleInviteFreelancers = () => {
    const params = new URLSearchParams({
      jobId: jobId || "",
      jobTitle: encodeURIComponent(job?.title || ""),
    });
    // router.push(`/client-dashboard/invite-freelancers?${params.toString()}`);
    router.push(`/post-page/private-freelancer/${jobId}`)
  };

  // ── Loading / error ────────────────────────────────────────
  if (jobLoading) return (
    <div className="flex flex-col min-h-screen"><Header />
      <main className="flex-grow flex items-center justify-center bg-white pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </main><FooterSection />
    </div>
  );

  if (jobError || !job) return (
    <div className="flex flex-col min-h-screen"><Header />
      <main className="flex-grow flex items-center justify-center bg-white pt-24">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{jobError || "Job not found"}</h2>
          <button onClick={() => router.push("/client-dashboard")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Back to Dashboard</button>
        </div>
      </main><FooterSection />
    </div>
  );

  // ── Main render ────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white pt-24">
        <div className="w-full">

          {/* SPAM BANNER */}
          <div className="bg-yellow-100 border-b border-yellow-300 px-6 py-3 flex items-center gap-3 text-sm">
            <span className="text-yellow-800 font-semibold">⚠️ SPAM ALERT!</span>
            <span className="text-yellow-700">Never pay a security deposit. Keep all transactions within HireHub.</span>
          </div>

          <div className="w-full px-6 py-6">

            {/* JOB HEADER */}
            <div className="p-6 mb-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-sm text-gray-600">{job.projectType} | Posted {job.postedTime}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Public Share Button */}
                  <button
                    onClick={generatePublicLink}
                    disabled={shareLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
                  >
                    {shareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                    Share
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <FileText className="w-4 h-4" /> Post Similar
                  </button>

                  <button
                    onClick={() => { setShowEditForm(!showEditForm); setEditError(""); setEditSuccess(false); }}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition ${showEditForm ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"}`}
                  >
                    <Edit className="w-4 h-4" />
                    {showEditForm ? "Cancel Edit" : "Edit"}
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>

                  <button onClick={handleInviteFreelancers} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    <UserPlus className="w-4 h-4" /> Invite Freelancers
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">Posted In {job.category}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-b border-gray-200">
                <div><p className="text-sm text-gray-600 mb-1">Budget</p><p className="text-lg font-semibold text-gray-900">{job.budget}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Proposals</p><p className="text-lg font-semibold text-gray-900">{proposalsLoading ? "..." : job.proposalCount}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Job ID</p><p className="text-lg font-semibold text-gray-900">{job.jobId}</p></div>
                <div><p className="text-sm text-gray-600 mb-1">Status</p><p className="text-lg font-semibold text-green-600">{job.status}</p></div>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">{job.hiringTimeline}</span>
              </div>
            </div>

            {/* EDIT FORM */}
            {showEditForm && (
              <div className="mx-0 mb-6 border border-blue-200 rounded-xl bg-blue-50/40 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" /> Edit Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input type="text" value={editForm.title}
                      onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Job title" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea rows={6} value={editForm.description}
                      onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                      placeholder="Describe the job" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget (£) *</label>
                    <input type="number" min="1" value={editForm.budget}
                      onChange={(e) => setEditForm((f) => ({ ...f, budget: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g. 500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Duration</label>
                    <select value={editForm.projectDuration}
                      onChange={(e) => setEditForm((f) => ({ ...f, projectDuration: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Select duration</option>
                      {DURATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input type="text" value={editForm.category}
                      onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g. Web Development" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <input type="text" value={editForm.subCategory}
                      onChange={(e) => setEditForm((f) => ({ ...f, subCategory: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g. Website Design" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                    <select value={editForm.jobVisibility}
                      onChange={(e) => setEditForm((f) => ({ ...f, jobVisibility: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="public">Public — Open to all freelancers</option>
                      <option value="private">Private — Invited freelancers only</option>
                    </select>
                  </div>
                </div>

                {editError && <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{editError}</div>}
                {editSuccess && (
                  <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Job updated successfully!
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button onClick={handleSaveEdit} disabled={editSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-60">
                    {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => { setShowEditForm(false); setEditError(""); }}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">

                {/* Project Details */}
                <div className="p-6 border-b border-gray-200">
                  <button onClick={() => setShowProjectDetails(!showProjectDetails)}
                    className="w-full flex items-center justify-between text-lg font-semibold text-gray-900 mb-4">
                    <span>Project Details</span>
                    {showProjectDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {showProjectDetails && (
                    <div className="space-y-4 text-gray-700">
                      <p className="whitespace-pre-wrap">{job.description}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Duration: </span><span className="font-medium">{job.projectDuration || "Not specified"}</span></div>
                        <div><span className="text-gray-500">Open to: </span><span className="font-medium">{job.freelancerSource === "invited" ? "Invited only" : "All freelancers"}</span></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Proposals */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {proposalsLoading ? "Loading..." : `${proposals.length} Proposal${proposals.length !== 1 ? "s" : ""}`}
                    </h2>
                    <div className="flex items-center gap-2">
                      {["Latest", "Low To High", "High To Low"].map((opt) => (
                        <button key={opt} onClick={() => setSortBy(opt)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${sortBy === opt ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                    {tabs.map(({ key, label }) => (
                      <button key={key} onClick={() => setActiveTab(key as any)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${activeTab === key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {proposalsLoading && (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-gray-200 rounded w-1/3" />
                              <div className="h-3 bg-gray-200 rounded w-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!proposalsLoading && proposals.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                      <div className="text-5xl mb-4">📭</div>
                      <p className="font-medium text-gray-700">No proposals yet</p>
                      <p className="text-sm mt-1">Freelancers haven't applied yet.</p>
                    </div>
                  )}

                  {!proposalsLoading && (
                    <div className="space-y-6">
                      {filteredProposals.map((proposal) => {
                        const name = proposal.freelancerProfile?.name || "Freelancer";
                        const email = proposal.freelancerProfile?.email || "";
                        const isShortlisted = proposal.status === 'shortlisted' || shortlistedIds.includes(proposal._id);

                        return (
                          <div key={proposal._id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Proposal Details</p>
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-xl font-semibold text-blue-600">{name.charAt(0).toUpperCase()}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <h3 className="text-lg font-semibold text-blue-600 truncate max-w-[200px]">{name}</h3>
                                      {isShortlisted && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Shortlisted</span>}
                                      {proposal.freelancerProfile?.rating && (
                                        <span className="text-sm text-gray-500">⭐ {proposal.freelancerProfile.rating.toFixed(1)}</span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1 break-words">{email}</p>
                                    <p className="text-xs text-gray-400 mb-3 break-words">
                                      {proposal.freelancerProfile?.completedJobs || 0} jobs completed • Submitted {timeAgo(proposal.createdAt)}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-4 line-clamp-3 whitespace-pre-wrap break-words">
                                      {proposal.proposalText}
                                    </p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                      {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                                        Workstream
                                      </button> */}

                                      <button
                                        onClick={() => handleReject(proposal._id)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm"
                                      >
                                        Reject
                                      </button>

                                      {isShortlisted ? (
                                        <>
                                          <button
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                                          >
                                            unshortlisted
                                          </button>
                                          <button
                                            onClick={() => handleOpenChat(proposal)}
                                            disabled={messagingProposalId === proposal._id}
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                                          >
                                            {messagingProposalId === proposal._id ? (
                                              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Opening...</>
                                            ) : (
                                              "Message"
                                            )}
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          onClick={() => handleShortlist(proposal._id)}
                                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                                        >
                                          Shortlist
                                        </button>
                                      )}

                                      <button
                                        onClick={() => setSelectedProposal(proposal)}
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm"
                                      >
                                        View Proposal
                                      </button>

                                      {/* ✅ FIXED: Share button with freelancerId validation */}
                                      {/* <button
                                        onClick={() => openDirectShareModal(proposal.freelancerId, name, email)}
                                        disabled={!proposal.freelancerId}
                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={!proposal.freelancerId ? "Freelancer ID not available" : "Share this job"}
                                      >
                                        <Share2 className="w-4 h-4 inline mr-1" /> Share
                                      </button> */}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="lg:col-span-1 border-l border-gray-200 pl-6">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Proposed Amount</p>
                                <p className="text-2xl font-bold text-gray-900 mb-2 break-words">£{proposal.bidAmount?.toLocaleString()}</p>
                                {/* <p className="text-xs text-gray-500">Submitted {timeAgo(proposal.createdAt)}</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-xs text-gray-500">Status</p>
                                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded capitalize ${proposal.status === "shortlisted" ? "bg-green-100 text-green-700" :
                                    proposal.status === "rejected" ? "bg-red-100 text-red-700" :
                                      "bg-gray-100 text-gray-600"
                                    }`}>
                                    {proposal.status}
                                  </span>
                                </div> */}



                                {/* ── Resume Videos ── */}
                                {/* {proposal.resumeVideos && proposal.resumeVideos.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                      Resume Video{proposal.resumeVideos.length > 1 ? "s" : ""}
                                    </p>
                                    <div className="space-y-2">
                                      {proposal.resumeVideos.map((videoUrl, vIdx) => (
                                        <div key={vIdx} className="rounded-lg overflow-hidden border border-gray-200 bg-black">
                                          <video
                                            src={videoUrl}
                                            controls
                                            preload="metadata"
                                            className="w-full max-h-36 object-contain"
                                            style={{ display: "block" }}
                                          />
                                          <div className="px-2 py-1.5 bg-gray-50 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M8 5v14l11-7z" />
                                            </svg>
                                            <span className="text-xs text-gray-600 truncate">Video {vIdx + 1}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )} */}


                                {proposal.resumeUrl && (
                                  <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                      Resume Video
                                    </p>
                                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
                                      <video
                                        src={proposal.resumeUrl}
                                        controls
                                        preload="metadata"
                                        className="w-full max-h-36 object-contain"
                                        style={{ display: "block" }}
                                        onError={(e) => console.error(`Video failed to load: ${proposal.resumeUrl}`, e)}
                                      />
                                      <div className="px-2 py-1.5 bg-gray-50 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                        <span className="text-xs text-gray-600 truncate">Resume Video</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="space-y-4">
                <div className="p-6 border border-gray-200 rounded-lg space-y-3 text-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                  <div><span className="text-gray-500">Status: </span><span className="font-medium text-green-600">{job.status}</span></div>
                  <div><span className="text-gray-500">Job ID: </span><span className="font-medium text-gray-900">{job.jobId}</span></div>
                  <div><span className="text-gray-500">Visibility: </span><span className="font-medium text-gray-900 capitalize">{job.jobVisibility}</span></div>
                  <div><span className="text-gray-500">Duration: </span><span className="font-medium text-gray-900">{job.projectDuration || "Not specified"}</span></div>
                  <div><span className="text-gray-500">Budget: </span><span className="font-medium text-gray-900">{job.budget}</span></div>
                  <div className="pt-3 border-t border-gray-100">
                    <button onClick={() => setShowDeleteModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium">
                      <Trash2 className="w-4 h-4" /> Delete This Job
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => !deleteLoading && setShowDeleteModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Delete this job?</h2>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm text-gray-700">
              <span className="font-medium">"{job.title}"</span>
              <p className="text-gray-500 mt-1">All proposals for this job will also be removed.</p>
            </div>
            {deleteError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{deleteError}</div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setDeleteError(""); }} disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleDeleteJob} disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleteLoading ? "Deleting..." : "Yes, Delete Job"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLIC SHARE MODAL */}
      {showPublicShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => !shareLoading && setShowPublicShareModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Public Share Link</h2>
              <button onClick={() => setShowPublicShareModal(false)} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            {shareError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{shareError}</div>
            )}
            {publicLink && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value={publicLink}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setShowPublicShareModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT SHARE MODAL */}
      {showDirectShareModal && selectedFreelancer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => !directShareLoading && setShowDirectShareModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Share Job with {selectedFreelancer.name}</h2>
              <button onClick={() => setShowDirectShareModal(false)} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            {directShareError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{directShareError}</div>
            )}
            {directShareSuccess && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Job shared successfully!
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
              <textarea
                rows={4}
                value={directMessage}
                onChange={(e) => setDirectMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a personal message..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDirectShareModal(false)}
                disabled={directShareLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={sendDirectShare}
                disabled={directShareLoading || directShareSuccess}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {directShareLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {directShareLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROPOSAL DETAIL DRAWER */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${selectedProposal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSelectedProposal(null)}
      />
      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${selectedProposal ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedProposal && (
          <>
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-semibold text-gray-900">Proposal Details</h2>
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${selectedProposal.status === "shortlisted" ? "bg-green-100 text-green-700" :
                    selectedProposal.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                    {selectedProposal.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{selectedProposal.freelancerProfile?.name || "Freelancer"}</p>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bid Amount Banner */}
            <div className="px-6 py-3 bg-orange-50 border-b border-orange-100 flex-shrink-0">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-orange-600">Proposed Amount:</span>{" "}
                <span className="text-xl font-bold text-gray-900">£{selectedProposal.bidAmount?.toLocaleString()}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Submitted {timeAgo(selectedProposal.createdAt)}</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

              {/* Freelancer Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-blue-600">
                    {(selectedProposal.freelancerProfile?.name || "F").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-base">{selectedProposal.freelancerProfile?.name || "Freelancer"}</p>
                  <p className="text-sm text-gray-500 truncate">{selectedProposal.freelancerProfile?.email}</p>
                  {selectedProposal.freelancerProfile?.rating && (
                    <p className="text-sm text-amber-500 mt-0.5">⭐ {selectedProposal.freelancerProfile.rating.toFixed(1)}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedProposal.freelancerProfile?.completedJobs || 0} jobs completed
                  </p>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cover Letter</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {selectedProposal.proposalText}
                </p>
              </div>

              {/* Skills */}
              {selectedProposal.freelancerProfile?.skills && selectedProposal.freelancerProfile.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProposal.freelancerProfile.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}


            </div>

            {/* Drawer Footer — Actions */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-white flex items-center gap-3">
              {!shortlistedIds.includes(selectedProposal._id) && selectedProposal.status !== "shortlisted" ? (
                <button
                  onClick={() => { handleShortlist(selectedProposal._id); setSelectedProposal(null); }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  Shortlist
                </button>
              ) : (
                <>
                  <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                    Accept & Hire
                  </button>
                  <button
                    onClick={() => handleOpenChat(selectedProposal)}
                    disabled={messagingProposalId === selectedProposal._id}
                    className="flex-1 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {messagingProposalId === selectedProposal._id ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Opening...</>
                    ) : (
                      "Message"
                    )}
                  </button>
                </>
              )}
              <button
                onClick={() => { handleReject(selectedProposal._id); setSelectedProposal(null); }}
                className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── FLOATING MINI-CHAT PANEL ───────────────────────── */}
      {miniChat && (
        <div className="fixed bottom-0 right-6 z-50 w-80 flex flex-col shadow-2xl rounded-t-xl overflow-hidden border border-gray-200" style={{ maxHeight: miniChatMinimised ? "48px" : "460px", transition: "max-height 0.3s ease" }}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white cursor-pointer select-none flex-shrink-0"
            onClick={() => setMiniChatMinimised(v => !v)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                {miniChat.peerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">{miniChat.peerName}</p>
                <p className="text-[10px] text-blue-200 mt-0.5">Direct Message</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={e => { e.stopPropagation(); router.push(`/client/messages?chatId=${miniChat.chatId}&peerName=${encodeURIComponent(miniChat.peerName)}`); }}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Open full view"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); setMiniChat(null); setMiniChatMessages([]); }}
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          {!miniChatMinimised && (
            <>
              <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-3 space-y-2" style={{ minHeight: 0, height: "340px" }}>
                {miniChatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  </div>
                ) : miniChatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-gray-400 text-center">No messages yet.<br />Start the conversation below.</p>
                  </div>
                ) : (
                  miniChatMessages.map((msg: any, idx: number) => {
                    const isOwn = msg.senderId?.toString() === currentUserId?.toString();
                    const text = msg.content || msg.text || "";
                    return (
                      <div key={msg._id || idx} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${isOwn ? "bg-blue-600 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                          }`}>
                          {msg.messageType === "job_share" ? (
                            <span className="italic text-opacity-80">📎 {text || "Shared a job"}</span>
                          ) : text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={miniChatEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-gray-200 flex-shrink-0">
                <input
                  type="text"
                  value={miniChatInput}
                  onChange={e => setMiniChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMiniChatMessage(); } }}
                  placeholder="Type a message..."
                  className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  disabled={miniChatSending}
                />
                <button
                  onClick={sendMiniChatMessage}
                  disabled={!miniChatInput.trim() || miniChatSending}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  {miniChatSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <FooterSection />
    </div>
  );
}