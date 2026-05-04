// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import AppImage from '@/components/ui/AppImage';
// import Icon from '@/components/ui/AppIcon';

// interface Skill {
//   name: string;
//   level: 'Expert' | 'Advanced' | 'Intermediate';
// }

// interface FreelancerCardProps {
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

// const FreelancerCard = ({
//   id,
//   name,
//   title,
//   image,
//   alt,
//   hourlyRate,
//   rating,
//   reviewCount,
//   completedProjects,
//   skills,
//   availability,
//   verified,
//   location,
//   responseTime,
// }: FreelancerCardProps) => {
//   const [isHydrated, setIsHydrated] = React.useState(false);

//   React.useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const handleViewProfile = () => {
//     if (!isHydrated) return;
//     console.log(`Viewing profile: ${name}`);
//   };

//   const handleContact = () => {
//     if (!isHydrated) return;
//     console.log(`Contacting: ${name}`);
//   };

//   return (
//     <div className="bg-card rounded-xl border border-border hover:shadow-brand-lg transition-all duration-300 overflow-hidden group">
//       <div className="p-6">
//         <div className="flex items-start gap-4 mb-4">
//           <div className="relative flex-shrink-0">
//             <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary transition-all duration-300">
//               <AppImage
//                 src={image}
//                 alt={alt}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             {verified && (
//               <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full flex items-center justify-center ring-2 ring-card">
//                 <Icon name="CheckBadgeIcon" size={18} className="text-white" variant="solid" />
//               </div>
//             )}
//           </div>

//           <div className="flex-1 min-w-0">
//             <h3 className="text-lg font-display font-bold text-foreground mb-1 truncate">
//               {name}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
//               {title}
//             </p>
//             <div className="flex items-center gap-3 text-xs text-muted-foreground">
//               <div className="flex items-center gap-1">
//                 <Icon name="MapPinIcon" size={14} />
//                 <span>{location}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Icon name="ClockIcon" size={14} />
//                 <span>{responseTime}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1">
//               <Icon name="StarIcon" size={16} className="text-warning" variant="solid" />
//               <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
//             </div>
//             <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-display font-bold text-primary">
//               ${hourlyRate}
//               <span className="text-sm font-body font-normal text-muted-foreground">/hr</span>
//             </div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
//             <span className="flex items-center gap-1">
//               <Icon name="BriefcaseIcon" size={14} />
//               {completedProjects} projects completed
//             </span>
//             <span className={`px-2 py-1 rounded-full font-medium ${
//               availability === 'Available Now' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
//             }`}>
//               {availability}
//             </span>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="flex flex-wrap gap-2">
//             {skills.slice(0, 3).map((skill, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-full"
//               >
//                 {skill.name}
//               </span>
//             ))}
//             {skills.length > 3 && (
//               <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
//                 +{skills.length - 3} more
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <Link href={`/user-profile/${id}`}>
//           <button
//             type="button"
//             onClick={handleViewProfile}
//             disabled={!isHydrated}
//             className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
//           >
//             <span>View Profile</span>
//             <Icon name="ArrowRightIcon" size={16} />
//           </button>
//           </Link>

//           <button
//             type="button"
//             onClick={handleContact}
//             disabled={!isHydrated}
//             className="px-4 py-2.5 bg-muted text-foreground rounded-lg font-display font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center disabled:opacity-50"
//           >
//             <Icon name="ChatBubbleLeftRightIcon" size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FreelancerCard;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import AppImage from '@/components/ui/AppImage';
// import Icon from '@/components/ui/AppIcon';

// interface Skill {
//   name: string;
//   level: 'Expert' | 'Advanced' | 'Intermediate';
// }

// interface FreelancerCardProps {
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

// const FreelancerCard = ({
//   id,
//   name,
//   title,
//   image,
//   alt,
//   hourlyRate,
//   rating,
//   reviewCount,
//   completedProjects,
//   skills,
//   availability,
//   verified,
//   location,
//   responseTime,
// }: FreelancerCardProps) => {
//   const [isHydrated, setIsHydrated] = React.useState(false);
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [isHireClicked, setIsHireClicked] = useState(false);


//   React.useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const handleViewProfile = (e: React.MouseEvent) => {
//     e.preventDefault();

//     if (!isHydrated) return;

//     setIsHireClicked(true);

//     // Check if user is authenticated
//     if (status === 'unauthenticated' || !session) {
//       // Store the intended destination in sessionStorage
//       sessionStorage.setItem('redirectAfterLogin', `/user-profile/${id}`);

//       // Redirect to sign-in page
//       router.push('/sign-in-page');
//       return;
//     }

//     // If authenticated, navigate to profile
//     router.push(`/user-profile/${id}`);
//   };

//   const handleContact = () => {
//     if (!isHydrated) return;

//     // Check if user is authenticated
//     if (status === 'unauthenticated' || !session) {
//       // Store the intended destination
//       sessionStorage.setItem('redirectAfterLogin', '/client/messages');
//       router.push('/sign-in-page');
//       return;
//     }

//     // console.log(`Contacting: ${name}`);
//     // If authenticated, redirect to messages page
//     router.push('/client/messages');
//   };

//   return (
//     <div className="bg-card rounded-xl border border-border hover:shadow-brand-lg transition-all duration-300 overflow-hidden group">
//       <div className="p-6">
//         <div className="flex items-start gap-4 mb-4">
//           <div className="relative flex-shrink-0">
//             <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary transition-all duration-300">
//               <AppImage
//                 src={image}
//                 alt={alt}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             {verified && (
//               <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full flex items-center justify-center ring-2 ring-card">
//                 <Icon name="CheckBadgeIcon" size={18} className="text-white" variant="solid" />
//               </div>
//             )}
//           </div>

//           <div className="flex-1 min-w-0">
//             <h3 className="text-lg font-display font-bold text-foreground mb-1 truncate">
//               {name}
//             </h3>
//             <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
//               {title}
//             </p>
//             <div className="flex items-center gap-3 text-xs text-muted-foreground">
//               <div className="flex items-center gap-1">
//                 <Icon name="MapPinIcon" size={14} />
//                 <span>{location}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Icon name="ClockIcon" size={14} />
//                 <span>{responseTime}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1">
//               <Icon name="StarIcon" size={16} className="text-warning" variant="solid" />
//               <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
//             </div>
//             <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-display font-bold text-primary">
//               ${hourlyRate}
//               <span className="text-sm font-body font-normal text-muted-foreground">/hr</span>
//             </div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
//             <span className="flex items-center gap-1">
//               <Icon name="BriefcaseIcon" size={14} />
//               {completedProjects} projects completed
//             </span>
//             <span className={`px-2 py-1 rounded-full font-medium ${
//               availability === 'Available Now' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
//             }`}>
//               {availability}
//             </span>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="flex flex-wrap gap-2">
//             {skills.slice(0, 3).map((skill, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-full"
//               >
//                 {skill.name}
//               </span>
//             ))}
//             {skills.length > 3 && (
//               <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
//                 +{skills.length - 3} more
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-2">
//           {/* View Profile Button - Now with authentication check */}
//           <button
//             type="button"
//             onClick={handleViewProfile}
//             disabled={!isHydrated}
//           //   className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 "
//             className={`flex-1 px-4 py-2.5 rounded-lg font-display font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50
//             ${
//               isHireClicked
//               ? 'bg-[#FF6B35] text-white'
//               : 'bg-[#1B365D] text-white'
//             }
//             `}
//           >
//             <span>Hire</span>
//             {/* <Icon name="ArrowRightIcon" size={16} /> */}
//           </button>

//           {/* Contact Button - Also requires authentication */}
//           <button
//             type="button"
//             onClick={handleContact}
//             disabled={!isHydrated}
//             className="px-4 py-2.5 bg-muted text-foreground rounded-lg font-display font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center disabled:opacity-50"
//           >
//             <Icon name="ChatBubbleLeftRightIcon" size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FreelancerCard;

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
}

interface FreelancerCardProps {
  id: string | number;
  name: string;
  email?: string;
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

const FreelancerCard = ({
  id,
  name,
  email,
  title,
  image,
  alt,
  hourlyRate,
  rating,
  reviewCount,
  completedProjects,
  skills,
  availability,
  verified,
  location,
  responseTime,
}: FreelancerCardProps) => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isHireClicked, setIsHireClicked] = useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isHydrated) return;

    setIsHireClicked(true);

    if (status === 'unauthenticated' || !session) {
      sessionStorage.setItem('redirectAfterLogin', `/user-profile/${id}`);
      router.push('/sign-in-page');
      return;
    }

    router.push(`/user-profile/${id}`);
  };

  // const handleContact = () => {
  //   if (!isHydrated) return;

  //   if (status === 'unauthenticated' || !session) {
  //     sessionStorage.setItem('redirectAfterLogin', '/client/messages');
  //     router.push('/sign-in-page');
  //     return;
  //   }

  //   router.push('/client/messages');
  // };
  // Update handleContact

  const handleContact = () => {
    if (!isHydrated) return;

    if (status === 'unauthenticated' || !session) {
      sessionStorage.setItem('redirectAfterLogin', '/client/messages');
      router.push('/sign-in-page');
      return;
    }

    // Navigate with freelancer context in URL
    const params = new URLSearchParams();
    // if (id) params.set('freelancerID', id.toString());
    params.set('otherUserId', id.toString());
    router.push(`/client/messages?${params.toString()}`);
  };
  return (
    <div className="bg-card rounded-xl border border-border hover:shadow-brand-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary transition-all duration-300">
              <AppImage
                src={image}
                alt={alt}
                className="w-full h-full object-cover"
              />
            </div>
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full flex items-center justify-center ring-2 ring-card">
                <Icon name="CheckBadgeIcon" size={18} className="text-white" variant="solid" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-display font-bold text-foreground mb-1 truncate">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {title}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="MapPinIcon" size={14} />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="ClockIcon" size={14} />
                <span>{responseTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Icon name="StarIcon" size={16} className="text-warning" variant="solid" />
              <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-primary">
              ${hourlyRate}
              <span className="text-sm font-body font-normal text-muted-foreground">/hr</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Icon name="BriefcaseIcon" size={14} />
              {completedProjects} projects completed
            </span>
            <span className={`px-2 py-1 rounded-full font-medium ${availability === 'Available Now'
              ? 'bg-success/10 text-success'
              : 'bg-warning/10 text-warning'
              }`}>
              {availability}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-full"
              >
                {skill.name}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleViewProfile}
            disabled={!isHydrated}
            className={`flex-1 px-4 py-2.5 rounded-lg font-display font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50
              ${isHireClicked ? 'bg-[#FF6B35] text-white' : 'bg-[#1B365D] text-white'}
            `}
          >
            <span>Hire  </span>
          </button>

          {/* <button
            type="button"
            onClick={handleContact}
            disabled={!isHydrated}
            className="px-4 py-2.5 bg-muted text-foreground rounded-lg font-display font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center disabled:opacity-50"
          >
            <Icon name="ChatBubbleLeftRightIcon" size={20} />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;