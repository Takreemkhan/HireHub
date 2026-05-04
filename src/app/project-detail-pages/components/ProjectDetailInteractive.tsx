// 'use client';

// import React, { useState, useEffect } from 'react';
// import ProjectHeader from './ProjectHeader';
// import ProjectDescription from './ProjectDescription';
// import ClientInfo from './ClientInfo';
// // import MarketRateComparison from './MarketRateComparison';
// import ApplicationForm from './ApplicationForm';
// import RelatedProjects from './RelatedProjects';
// import Icon from '@/components/ui/AppIcon';

// interface ProjectData {
//   id: number;
//   title: string;
//   category: string;
//   postedDate: string;
//   budget: string;
//   budgetAmount: number;
//   budgetType: string;
//   experienceLevel: string;
//   projectLength: string;
//   timeCommitment: string;
//   description: string;
//   skills: string[];
//   deliverables: string[];
//   client: {
//     name: string;
//     avatar: string;
//     avatarAlt: string;
//     location: string;
//     memberSince: string;
//     totalSpent: string;
//     projectsPosted: number;
//     hireRate: number;
//     rating: number;
//     reviews: number;
//     verificationBadges: string[];
//   };
//   marketRates: {
//     low: number;
//     average: number;
//     high: number;
//   };
// }

// interface RelatedProject {
//   id: number;
//   title: string;
//   category: string;
//   budget: string;
//   budgetType: string;
//   postedDate: string;
//   proposalCount: number;
//   skills: string[];
// }

// const ProjectDetailInteractive = () => {
//   const [isHydrated, setIsHydrated] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [showApplicationForm, setShowApplicationForm] = useState(false);

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const projectData: ProjectData = {
//     id: 1,
//     title: 'E-Commerce Platform Development with React & Node.js',
//     category: 'Web Development',
//     postedDate: '2 hours ago',
//     budget: '$5,000 - $8,000',
//     budgetAmount: 6500,
//     budgetType: 'Fixed Price',
//     experienceLevel: 'Expert',
//     projectLength: '3-6 months',
//     timeCommitment: 'More than 30 hrs/week',
//     description: `We are seeking an experienced full-stack developer to build a modern e-commerce platform from scratch. The project involves creating a responsive web application with advanced features including real-time inventory management, secure payment processing, and an intuitive admin dashboard.\n\nThe ideal candidate should have extensive experience with React.js for frontend development and Node.js with Express for backend services. You'll be working with our design team to implement a pixel-perfect UI and integrate with third-party APIs for payment processing, shipping, and analytics.\n\nThis is a high-priority project with clear milestones and deliverables. We value clean code, comprehensive documentation, and regular communication throughout the development process.`,
//     skills: [
//     'React.js',
//     'Node.js',
//     'Express.js',
//     'MongoDB',
//     'REST API',
//     'Payment Integration',
//     'AWS',
//     'TypeScript'],

//     deliverables: [
//     'Fully functional e-commerce website with responsive design',
//     'Admin dashboard for inventory and order management',
//     'Secure payment gateway integration (Stripe/PayPal)',
//     'User authentication and authorization system',
//     'Product search and filtering functionality',
//     'Shopping cart and checkout process',
//     'Order tracking and email notifications',
//     'Comprehensive technical documentation',
//     'Deployment on AWS with CI/CD pipeline'],

//     client: {
//       name: 'TechVentures Inc.',
//       avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_138e07571-1763295086046.png",
//       avatarAlt: 'Professional businessman in navy suit with confident smile in modern office',
//       location: 'San Francisco, CA',
//       memberSince: 'January 2023',
//       totalSpent: '$125,000+',
//       projectsPosted: 24,
//       hireRate: 92,
//       rating: 4.8,
//       reviews: 18,
//       verificationBadges: ['Payment Verified', 'Email Verified', 'Phone Verified']
//     },
//     marketRates: {
//       low: 4000,
//       average: 6000,
//       high: 10000
//     }
//   };

//   const relatedProjects: RelatedProject[] = [
//   {
//     id: 2,
//     title: 'Mobile App Development for Food Delivery Service',
//     category: 'Mobile Development',
//     budget: '$8,000 - $12,000',
//     budgetType: 'Fixed Price',
//     postedDate: '5 hours ago',
//     proposalCount: 12,
//     skills: ['React Native', 'Firebase', 'Google Maps API', 'Payment Integration']
//   },
//   {
//     id: 3,
//     title: 'SaaS Dashboard with Real-time Analytics',
//     category: 'Web Development',
//     budget: '$6,000 - $9,000',
//     budgetType: 'Fixed Price',
//     postedDate: '1 day ago',
//     proposalCount: 8,
//     skills: ['React.js', 'D3.js', 'Node.js', 'PostgreSQL', 'WebSocket']
//   },
//   {
//     id: 4,
//     title: 'Custom CRM System Development',
//     category: 'Web Development',
//     budget: '$10,000 - $15,000',
//     budgetType: 'Fixed Price',
//     postedDate: '2 days ago',
//     proposalCount: 15,
//     skills: ['Vue.js', 'Laravel', 'MySQL', 'REST API', 'Docker']
//   }];


//   const handleSaveProject = () => {
//     if (!isHydrated) return;
//     setIsSaved(!isSaved);
//   };

//   const handleApplyClick = () => {
//     if (!isHydrated) return;
//     setShowApplicationForm(true);
//     setTimeout(() => {
//       document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   const handleApplicationSubmit = () => {
//     setShowApplicationForm(false);
//   };

//   if (!isHydrated) {
//     return (
//       <div className="min-h-screen bg-background pt-20 pb-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-6">
//             <div className="h-64 bg-muted rounded-lg" />
//             <div className="h-96 bg-muted rounded-lg" />
//           </div>
//         </div>
//       </div>);

//   }

//   return (
//     <div className="min-h-screen bg-background pt-20 pb-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <ProjectHeader
//               title={projectData.title}
//               category={projectData.category}
//               postedDate={projectData.postedDate}
//               budget={projectData.budget}
//               budgetType={projectData.budgetType}
//               experienceLevel={projectData.experienceLevel}
//               projectLength={projectData.projectLength}
//               timeCommitment={projectData.timeCommitment} />


//             <ProjectDescription
//               description={projectData.description}
//               skills={projectData.skills}
//               deliverables={projectData.deliverables} />


//             {/* <MarketRateComparison
//               projectBudget={projectData.budgetAmount}
//               marketAverage={projectData.marketRates.average}
//               marketLow={projectData.marketRates.low}
//               marketHigh={projectData.marketRates.high} /> */}


//             {showApplicationForm &&
//             <div id="application-form">
//                 <ApplicationForm
//                 projectTitle={projectData.title}
//                 onSubmit={handleApplicationSubmit} />

//               </div>
//             }
//           </div>

//           <div className="space-y-6">
//             <div className="bg-card rounded-lg shadow-brand p-6">
//               <div className="space-y-4">
//                 <button
//                   onClick={handleApplyClick}
//                   disabled={showApplicationForm}
//                   className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-display font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
//                   showApplicationForm ?
//                   'bg-muted text-muted-foreground cursor-not-allowed' :
//                   'bg-brand-cta text-white hover:bg-opacity-90'}`
//                   }>

//                   <Icon name="PaperAirplaneIcon" size={20} />
//                   <span>{showApplicationForm ? 'Application Form Below' : 'Apply Now'}</span>
//                 </button>

//                 <button
//                   onClick={handleSaveProject}
//                   className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
//                   isSaved ?
//                   'bg-accent/10 text-accent border-2 border-accent' : 'bg-white text-foreground border-2 border-border hover:border-primary'}`
//                   }>

//                   <Icon
//                     name="BookmarkIcon"
//                     size={20}
//                     variant={isSaved ? 'solid' : 'outline'} />

//                   <span>{isSaved ? 'Saved' : 'Save Project'}</span>
//                 </button>

//                 <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-border rounded-lg font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-300">
//                   <Icon name="ShareIcon" size={20} />
//                   <span>Share Project</span>
//                 </button>
//               </div>

//               <div className="mt-6 pt-6 border-t border-border">
//                 <div className="flex items-center justify-between text-sm mb-3">
//                   <span className="text-muted-foreground">Proposals</span>
//                   <span className="font-semibold text-foreground">5-10</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm mb-3">
//                   <span className="text-muted-foreground">Interviewing</span>
//                   <span className="font-semibold text-foreground">2</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Invites Sent</span>
//                   <span className="font-semibold text-foreground">3</span>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-primary/5 rounded-lg">
//                 <div className="flex items-start space-x-3">
//                   <Icon name="LightBulbIcon" size={20} className="text-primary mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
//                     <p className="text-xs text-muted-foreground">
//                       Clients are 3x more likely to hire freelancers who submit proposals within
//                       24 hours of posting.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <ClientInfo
//               name={projectData.client.name}
//               avatar={projectData.client.avatar}
//               avatarAlt={projectData.client.avatarAlt}
//               location={projectData.client.location}
//               memberSince={projectData.client.memberSince}
//               totalSpent={projectData.client.totalSpent}
//               projectsPosted={projectData.client.projectsPosted}
//               hireRate={projectData.client.hireRate}
//               rating={projectData.client.rating}
//               reviews={projectData.client.reviews}
//               verificationBadges={projectData.client.verificationBadges} />


//             <RelatedProjects projects={relatedProjects} />
//           </div>
//         </div>
//       </div>
//     </div>);

// };

// export default ProjectDetailInteractive;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import ProjectHeader from './ProjectHeader';
// import ProjectDescription from './ProjectDescription';
// import ClientInfo from './ClientInfo';
// import ApplicationForm from './ApplicationForm';
// import RelatedProjects from './RelatedProjects';
// import Icon from '@/components/ui/AppIcon';

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function timeAgo(dateString: string): string {
//   const diffMs = Date.now() - new Date(dateString).getTime();
//   const mins  = Math.floor(diffMs / 60000);
//   const hours = Math.floor(mins / 60);
//   const days  = Math.floor(hours / 24);
//   if (mins  < 60) return `${mins} minutes ago`;
//   if (hours < 24) return `${hours} hours ago`;
//   if (days  === 1) return '1 day ago';
//   if (days  <  7) return `${days} days ago`;
//   return `${Math.floor(days / 7)} weeks ago`;
// }

// function formatBudget(budget: number): string {
//   if (!budget) return 'Not specified';
//   return `£${budget.toLocaleString()}`;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// const ProjectDetailInteractive = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const jobId = searchParams.get('jobId');

//   const [isHydrated, setIsHydrated] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [showApplicationForm, setShowApplicationForm] = useState(false);

//   // ── API STATE ─────────────────────────────────────────────
//   const [job, setJob] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   // ── FETCH JOB FROM API ────────────────────────────────────
//   useEffect(() => {
//     if (!jobId) {
//       setError('No job ID provided');
//       setLoading(false);
//       return;
//     }

//     const fetchJob = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         const res = await fetch(`/api/jobs/${jobId}`);
//         const data = await res.json();

//         if (!res.ok) throw new Error(data.message || 'Failed to load job');

//         setJob(data.job);

//       } catch (err: any) {
//         console.error('Failed to fetch job:', err);
//         setError(err.message || 'Failed to load job details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJob();
//   }, [jobId]);

//   const handleSaveProject = () => {
//     if (!isHydrated) return;
//     setIsSaved(!isSaved);
//   };

//   const handleApplyClick = () => {
//     if (!isHydrated) return;
//     setShowApplicationForm(true);
//     setTimeout(() => {
//       document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   const handleApplicationSubmit = () => {
//     setShowApplicationForm(false);
//     // TODO: Submit proposal to API
//   };

//   // ── LOADING STATE ─────────────────────────────────────────
//   if (!isHydrated || loading) {
//     return (
//       <div className="min-h-screen bg-background pt-20 pb-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse space-y-6">
//             <div className="h-64 bg-muted rounded-lg" />
//             <div className="h-96 bg-muted rounded-lg" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── ERROR STATE ───────────────────────────────────────────
//   if (error || !job) {
//     return (
//       <div className="min-h-screen bg-background pt-20 pb-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center py-16">
//             <div className="text-4xl mb-4">⚠️</div>
//             <h2 className="text-xl font-semibold text-foreground mb-2">
//               {error || 'Job not found'}
//             </h2>
//             <p className="text-muted-foreground mb-6">
//               This job may have been removed or you may not have access.
//             </p>
//             <button
//               onClick={() => router.push('/search-and-discovery')}
//               className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
//             >
//               Back to Job Search
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── MAP API DATA TO UI FORMAT ─────────────────────────────
//   const projectData = {
//     id: job._id,
//     title: job.title,
//     category: job.category || 'General',
//     postedDate: timeAgo(job.createdAt),
//     budget: formatBudget(job.budget),
//     budgetAmount: job.budget,
//     budgetType: 'Fixed Price', // Currently all jobs are fixed price
//     experienceLevel: 'Intermediate', // Placeholder — add to schema later
//     projectLength: job.projectDuration || 'Not specified',
//     timeCommitment: job.freelancerSource === 'invited' ? 'Private Project' : 'Open to All',
//     description: job.description || 'No description provided',
//     skills: job.subCategory ? [job.category, job.subCategory] : [job.category],
//     deliverables: [], // Placeholder — add to schema later
//   };

//   // Placeholder client data — TODO: Join with users collection
//   const clientData = {
//     name: 'Client', // Placeholder
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
//     avatarAlt: 'Client avatar',
//     location: 'Remote',
//     memberSince: 'Member',
//     totalSpent: 'N/A',
//     projectsPosted: 0,
//     hireRate: 0,
//     rating: 0,
//     reviews: 0,
//     verificationBadges: [],
//   };

//   // Placeholder related projects — TODO: Fetch similar jobs
//   const relatedProjects: any[] = [];


//   // ── MAIN RENDER ───────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-background pt-20 pb-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <ProjectHeader
//               title={projectData.title}
//               category={projectData.category}
//               postedDate={projectData.postedDate}
//               budget={projectData.budget}
//               budgetType={projectData.budgetType}
//               experienceLevel={projectData.experienceLevel}
//               projectLength={projectData.projectLength}
//               timeCommitment={projectData.timeCommitment}
//             />

//             <ProjectDescription
//               description={projectData.description}
//               skills={projectData.skills}
//               deliverables={projectData.deliverables}
//             />

//             {showApplicationForm && (
//               <div id="application-form">
//                 <ApplicationForm
//                   projectTitle={projectData.title}
//                   onSubmit={handleApplicationSubmit}
//                 />
//               </div>
//             )}
//           </div>

//           <div className="space-y-6">
//             <div className="bg-card rounded-lg shadow-brand p-6">
//               <div className="space-y-4">
//                 <button
//                   onClick={handleApplyClick}
//                   disabled={showApplicationForm}
//                   className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-display font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
//                     showApplicationForm
//                       ? 'bg-muted text-muted-foreground cursor-not-allowed'
//                       : 'bg-brand-cta text-white hover:bg-opacity-90'
//                   }`}
//                 >
//                   <Icon name="PaperAirplaneIcon" size={20} />
//                   <span>{showApplicationForm ? 'Application Form Below' : 'Apply Now'}</span>
//                 </button>

//                 <button
//                   onClick={handleSaveProject}
//                   className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
//                     isSaved
//                       ? 'bg-accent/10 text-accent border-2 border-accent'
//                       : 'bg-white text-foreground border-2 border-border hover:border-primary'
//                   }`}
//                 >
//                   <Icon
//                     name="BookmarkIcon"
//                     size={20}
//                     variant={isSaved ? 'solid' : 'outline'}
//                   />
//                   <span>{isSaved ? 'Saved' : 'Save Project'}</span>
//                 </button>

//                 <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-border rounded-lg font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-300">
//                   <Icon name="ShareIcon" size={20} />
//                   <span>Share Project</span>
//                 </button>
//               </div>

//               <div className="mt-6 pt-6 border-t border-border">
//                 <div className="flex items-center justify-between text-sm mb-3">
//                   <span className="text-muted-foreground">Proposals</span>
//                   <span className="font-semibold text-foreground">0</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm mb-3">
//                   <span className="text-muted-foreground">Status</span>
//                   <span className={`font-semibold ${
//                     job.status === 'open' ? 'text-green-600' : 'text-gray-600'
//                   }`}>
//                     {job.status === 'open' ? 'Accepting Proposals' : job.status}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Visibility</span>
//                   <span className="font-semibold text-foreground capitalize">
//                     {job.jobVisibility}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-primary/5 rounded-lg">
//                 <div className="flex items-start space-x-3">
//                   <Icon name="LightBulbIcon" size={20} className="text-primary mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
//                     <p className="text-xs text-muted-foreground">
//                       Clients are 3x more likely to hire freelancers who submit proposals within
//                       24 hours of posting.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <ClientInfo
//               name={clientData.name}
//               avatar={clientData.avatar}
//               avatarAlt={clientData.avatarAlt}
//               location={clientData.location}
//               memberSince={clientData.memberSince}
//               totalSpent={clientData.totalSpent}
//               projectsPosted={clientData.projectsPosted}
//               hireRate={clientData.hireRate}
//               rating={clientData.rating}
//               reviews={clientData.reviews}
//               verificationBadges={clientData.verificationBadges}
//             />

//             {relatedProjects.length > 0 && <RelatedProjects projects={relatedProjects} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetailInteractive;

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProjectHeader from './ProjectHeader';
import ProjectDescription from './ProjectDescription';
import ClientInfo from './ClientInfo';
import ApplicationForm from './ApplicationForm';
import RelatedProjects from './RelatedProjects';
import Icon from '@/components/ui/AppIcon';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (mins  < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days  === 1) return '1 day ago';
  if (days  <  7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

function formatBudget(budget: number): string {
  if (!budget) return 'Not specified';
  return `£${budget.toLocaleString()}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ProjectDetailInteractive = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');

  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // ── API STATE ─────────────────────────────────────────────
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ── FETCH JOB FROM API ────────────────────────────────────
  useEffect(() => {
    if (!jobId) {
      setError('No job ID provided');
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to load job');

        setJob(data.job);

      } catch (err: any) {
        console.error('Failed to fetch job:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSaveProject = () => {
    if (!isHydrated) return;
    setIsSaved(!isSaved);
  };

  const handleApplyClick = () => {
    if (!isHydrated) return;
    setShowApplicationForm(true);
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleApplicationSubmit = () => {
    setShowApplicationForm(false);
    // TODO: Submit proposal to API
  };

  // ── LOADING STATE ─────────────────────────────────────────
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR STATE ───────────────────────────────────────────
  if (error || !job) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {error || 'Job not found'}
            </h2>
            <p className="text-muted-foreground mb-6">
              This job may have been removed or you may not have access.
            </p>
            <button
              onClick={() => router.push('/search-and-discovery')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
            >
              Back to Job Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAP API DATA TO UI FORMAT ─────────────────────────────
  const projectData = {
    id: job._id,
    title: job.title,
    category: job.category || 'General',
    postedDate: timeAgo(job.createdAt),
    budget: formatBudget(job.budget),
    budgetAmount: job.budget,
    budgetType: 'Fixed Price', // Currently all jobs are fixed price
    experienceLevel: 'Intermediate', // Placeholder — add to schema later
    projectLength: job.projectDuration || 'Not specified',
    timeCommitment: job.freelancerSource === 'invited' ? 'Private Project' : 'Open to All',
    description: job.description || 'No description provided',
    skills: job.subCategory ? [job.category, job.subCategory] : [job.category],
    deliverables: [], // Placeholder — add to schema later
  };

  // Placeholder client data — TODO: Join with users collection
  const clientData = {
    name: 'Client', // Placeholder
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    avatarAlt: 'Client avatar',
    location: 'Remote',
    memberSince: 'Member',
    totalSpent: 'N/A',
    projectsPosted: 0,
    hireRate: 0,
    rating: 0,
    reviews: 0,
    verificationBadges: [],
  };

  // Placeholder related projects — TODO: Fetch similar jobs
  const relatedProjects: any[] = [];


  // ── MAIN RENDER ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjectHeader
              title={projectData.title}
              category={projectData.category}
              postedDate={projectData.postedDate}
              budget={projectData.budget}
              budgetType={projectData.budgetType}
              experienceLevel={projectData.experienceLevel}
              projectLength={projectData.projectLength}
              timeCommitment={projectData.timeCommitment}
            />

            <ProjectDescription
              description={projectData.description}
              skills={projectData.skills}
              deliverables={projectData.deliverables}
            />

            {showApplicationForm && (
              <div id="application-form">
                <ApplicationForm
                  projectTitle={projectData.title}
                  jobId={job._id}
                  onSubmit={handleApplicationSubmit}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-brand p-6">
              <div className="space-y-4">
                <button
                  onClick={handleApplyClick}
                  disabled={showApplicationForm}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-display font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                    showApplicationForm
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-brand-cta text-white hover:bg-opacity-90'
                  }`}
                >
                  <Icon name="PaperAirplaneIcon" size={20} />
                  <span>{showApplicationForm ? 'Application Form Below' : 'Apply Now'}</span>
                </button>

                <button
                  onClick={handleSaveProject}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isSaved
                      ? 'bg-accent/10 text-accent border-2 border-accent'
                      : 'bg-white text-foreground border-2 border-border hover:border-primary'
                  }`}
                >
                  <Icon
                    name="BookmarkIcon"
                    size={20}
                    variant={isSaved ? 'solid' : 'outline'}
                  />
                  <span>{isSaved ? 'Saved' : 'Save Project'}</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 border-2 border-border rounded-lg font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all duration-300">
                  <Icon name="ShareIcon" size={20} />
                  <span>Share Project</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Proposals</span>
                  <span className="font-semibold text-foreground">0</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-semibold ${
                    job.status === 'open' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {job.status === 'open' ? 'Accepting Proposals' : job.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="font-semibold text-foreground capitalize">
                    {job.jobVisibility}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="LightBulbIcon" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
                    <p className="text-xs text-muted-foreground">
                      Clients are 3x more likely to hire freelancers who submit proposals within
                      24 hours of posting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ClientInfo
              name={clientData.name}
              avatar={clientData.avatar}
              avatarAlt={clientData.avatarAlt}
              location={clientData.location}
              memberSince={clientData.memberSince}
              totalSpent={clientData.totalSpent}
              projectsPosted={clientData.projectsPosted}
              hireRate={clientData.hireRate}
              rating={clientData.rating}
              reviews={clientData.reviews}
              verificationBadges={clientData.verificationBadges}
            />

            {relatedProjects.length > 0 && <RelatedProjects projects={relatedProjects} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailInteractive;