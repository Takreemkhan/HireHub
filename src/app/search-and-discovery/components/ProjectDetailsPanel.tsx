// 'use client';

// import React, { useEffect, useState } from 'react';
// import Icon from '@/components/ui/AppIcon';
// import { useRouter } from 'next/navigation';
// import { useSession } from "next-auth/react";

// interface SearchResult {
//     id: string;
//     type: 'freelancer' | 'project';
//     title: string;
//     subtitle: string;
//     description: string;
//     image: string;
//     alt: string;
//     rating: number;
//     reviewCount: number;
//     tags: string[];
//     price?: string;
//     location?: string;
//     availability?: string;
//     featured?: boolean;
//     bids?: number;
//     averageBid?: string;
//     budget?: string;
//     isNew?: boolean;
//     postedAt?: string;
//     clientName?: string;
//     clientInitials?: string;
//     clientRating?: number;
// }

// interface ProjectDetailsPanelProps {
//     result: SearchResult | null;
//     onClose: () => void;
//     onApply?: (job: { id: string; title: string; budget: string; level: string }) => void;
// }

// const ProjectDetailsPanel = ({ result, onClose, onApply }: ProjectDetailsPanelProps) => {
//     const { data: session } = useSession();
//     const [isVisible, setIsVisible] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         if (result) {
//             setIsVisible(true);
//         } else {
//             setIsVisible(false);
//         }
//     }, [result]);

//     if (!result) return null;

//     const handleApplyClick = () => {
//         if (result.type === 'project') {
//             if (!session) {
//                 sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
//                 router.push('/sign-in-page');
//                 onClose();
//                 return;
//             }
//             if (onApply) {
//                 onApply({
//                     id: result.id,
//                     title: result.title,
//                     budget: result.budget || result.price || 'Not specified',
//                     level: result.tags[0] || 'Intermediate',
//                 });
//                 onClose();
//             }
//         }
//     };

//     // Client display info
//     const clientInitials = result.clientInitials || result.subtitle?.slice(0, 2).toUpperCase() || '??';
//     const clientName = result.clientName || result.subtitle || 'Anonymous';
//     const clientRating = result.clientRating ?? result.rating ?? 0;

//     // Consistent avatar colour based on initials
//     const avatarColors = [
//         'bg-[#1B365D]', 'bg-[#FF6B35]', 'bg-purple-600',
//         'bg-green-600', 'bg-indigo-600', 'bg-rose-600',
//     ];
//     const colorIndex = (clientInitials.charCodeAt(0) + (clientInitials.charCodeAt(1) || 0)) % avatarColors.length;
//     const avatarBg = avatarColors[colorIndex];

//     return (
//         <>
//             {/* Backdrop */}
//             {isVisible && (
//                 <div
//                     className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
//                     onClick={onClose}
//                 />
//             )}

//             {/* Sliding Panel */}
//             <div
//                 className={`fixed top-0 right-0 h-full w-full md:w-[450px] lg:w-[50%] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
//             >
//                 <div className="h-full flex flex-col overflow-hidden">
//                     {/* Header */}
//                     <div className="p-6 border-b border-border flex items-start justify-between bg-card">
//                         <div>
//                             <div className="flex items-center gap-3 mb-2">
//                                 <h2 className="text-2xl font-display font-bold text-foreground">{result.title}</h2>
//                                 {result.featured && (
//                                     <Icon name="StarIcon" size={20} variant="solid" className="text-yellow-500 flex-shrink-0" />
//                                 )}
//                             </div>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                                 {result.postedAt && <span>Posted {result.postedAt}</span>}
//                                 {result.location && (
//                                     <div className="flex items-center gap-1">
//                                         <Icon name="MapPinIcon" size={14} />
//                                         <span>{result.location}</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
//                             <Icon name="XMarkIcon" size={24} className="text-muted-foreground" />
//                         </button>
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 overflow-y-auto p-6 space-y-8">

//                         {/* Stats Row */}
//                         <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
//                             <div>
//                                 <p className="text-sm text-muted-foreground mb-1">Budget</p>
//                                 <p className="font-semibold text-foreground">{result.budget || result.price || '—'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-muted-foreground mb-1">Bids</p>
//                                 <p className="font-semibold text-foreground">{result.bids !== undefined ? result.bids : '—'}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-muted-foreground mb-1">Avg Bid</p>
//                                 <p className="font-semibold text-foreground">{result.averageBid || '—'}</p>
//                             </div>
//                         </div>

//                         {/* Description */}
//                         <section>
//                             <h3 className="text-lg font-semibold mb-3">Project Details</h3>
//                             <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
//                                 {result.description}
//                             </p>
//                         </section>

//                         {/* Skills */}
//                         <section>
//                             <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {result.tags.map((tag, i) => (
//                                     <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
//                                         {tag}
//                                     </span>
//                                 ))}
//                             </div>
//                         </section>

//                         {/* About Client */}
//                         <section className="border-t border-border pt-6">
//                             <h3 className="text-lg font-semibold mb-4">
//                                 About the {result.type === 'project' ? 'Client' : 'Freelancer'}
//                             </h3>
//                             <div className="flex items-center gap-4">
//                                 {/* Initials avatar */}
//                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${avatarBg}`}>
//                                     {clientInitials}
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-foreground">{clientName}</p>
//                                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
//                                         <Icon name="StarIcon" size={14} className="text-warning" variant="solid" />
//                                         <span>
//                                             {clientRating > 0
//                                                 ? `${clientRating.toFixed(1)} (${result.reviewCount} reviews)`
//                                                 : 'New client'}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>
//                     </div>

//                     {/* Footer */}
//                     <div className="p-6 border-t border-border bg-card">
//                         <button
//                             onClick={handleApplyClick}
//                             className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
//                             {result.type === 'project' ? 'Apply Now' : 'Contact Freelancer'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ProjectDetailsPanel;








// app/search-and-discovery/components/projectDetailspanel.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

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

interface JobForProposal {
    id: string;
    title: string;
    budget: string;
    level: string;
    description: string;

    clientName?: string;
    clientInitials?: string;
    bids?: number;
    rating?: number;
    averageBid?: string;
}

interface ProjectDetailsPanelProps {
    result: SearchResult | null;
    onClose: () => void;
    onApply?: (job: JobForProposal) => void;
}

const ProjectDetailsPanel = ({ result, onClose, onApply }: ProjectDetailsPanelProps) => {
    const { data: session } = useSession();
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (result) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [result]);

    if (!result) return null;
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .filter(Boolean)
            .map(word => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }

    const clientInitials = getInitials(result.subtitle || "");
    const handleApplyClick = () => {
        if (result.type === 'project') {
            if (!session) {
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                router.push('/sign-in-page');
                onClose();
                return;
            }
            if (onApply) {
                onApply({
                    id: result.id,
                    title: result.title,
                    budget: result.budget || result.price || 'Not specified',
                    level: result.tags[1] || 'Intermediate',
                    description: result.description,
                    clientName: result.clientName,

                    clientInitials: clientInitials,
                    bids: result.bids,
                    rating: result.rating,
                    averageBid: result.averageBid














                });
                onClose();
            }
        }
    };

    // Client display info
    // const clientInitials = result.clientInitials || result.subtitle?.slice(0, 2).toUpperCase() || '??';



    const clientName = result.clientName || result.subtitle || 'Anonymous';
    const clientRating = result.clientRating ?? result.rating ?? 0;

    // Consistent avatar colour based on initials
    const avatarColors = [
        'bg-[#1B365D]', 'bg-[#FF6B35]', 'bg-purple-600',
        'bg-green-600', 'bg-indigo-600', 'bg-rose-600',
    ];
    const colorIndex = (clientInitials.charCodeAt(0) + (clientInitials.charCodeAt(1) || 0)) % avatarColors.length;
    const avatarBg = avatarColors[colorIndex];

    return (
        <>
            {/* Backdrop */}
            {isVisible && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sliding Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[450px] lg:w-[50%] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-border flex items-start justify-between bg-card">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-display font-bold text-foreground">{result.title}</h2>
                                {result.featured && (
                                    <Icon name="StarIcon" size={20} variant="solid" className="text-yellow-500 flex-shrink-0" />
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {result.postedAt && <span>Posted {result.postedAt}</span>}
                                {result.location && (
                                    <div className="flex items-center gap-1">
                                        <Icon name="MapPinIcon" size={14} />
                                        <span>{result.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <Icon name="XMarkIcon" size={24} className="text-muted-foreground" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                                <p className="font-semibold text-foreground">{result.budget || result.price || '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Bids</p>
                                <p className="font-semibold text-foreground">{result.bids !== undefined ? result.bids : '—'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Avg Bid</p>
                                <p className="font-semibold text-foreground">{result.averageBid || '—'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <section>
                            <h3 className="text-lg font-semibold mb-3">Project Details</h3>
                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                {result.description}
                            </p>
                        </section>

                        {/* Skills */}
                        <section>
                            <h3 className="text-lg font-semibold mb-3">Requirement </h3>
                            <div className="flex flex-wrap gap-2">

                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    {result.tags[1]}
                                </span>

                            </div>
                        </section>

                        {/* About Client */}
                        <section className="border-t border-border pt-6">
                            <h3 className="text-lg font-semibold mb-4">
                                About the {result.type === 'project' ? 'Client' : 'Freelancer'}
                            </h3>
                            <div className="flex items-center gap-4">
                                {/* Initials avatar */}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${avatarBg}`}>
                                    {clientInitials}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{clientName}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <Icon name="StarIcon" size={14} className="text-warning" variant="solid" />
                                        <span>
                                            {clientRating > 0
                                                ? `${clientRating.toFixed(1)} (${result.reviewCount} reviews)`
                                                : 'New client'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-card">
                        <button
                            onClick={handleApplyClick}
                            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                            {result.type === 'project' ? 'Apply Now' : 'Contact Freelancer'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetailsPanel;

