// 'use client';

// import React, { useState, useEffect } from 'react';
// import Icon from '@/components/ui/AppIcon';
// import AppImage from '@/components/ui/AppImage';


// interface HeroSectionProps {
//   onUserTypeSelect: (type: 'freelancer' | 'client') => void;
// }

// const HeroSection = ({ onUserTypeSelect }: HeroSectionProps) => {
//   const [isHydrated, setIsHydrated] = useState(false);
//   const [selectedType, setSelectedType] = useState<'freelancer' | 'client' | null>(null);

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const handleTypeSelect = (type: 'freelancer' | 'client') => {
//     if (!isHydrated) return;
//     setSelectedType(type);
//     onUserTypeSelect(type);
//   };

//   return (
//     <section className="relative bg-gradient-to-br from-primary via-secondary to-primary min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-blue rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div className="text-center lg:text-left space-y-8">
//             <div className="space-y-4">
//               <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
//                 Where Talent Meets <span className="text-accent">Opportunity</span>
//               </h1>
//               <p className="text-lg sm:text-xl text-white/90 font-body max-w-2xl mx-auto lg:mx-0">
//                 Professional freelancing, simplified. Build your business, not just your portfolio. Join the premium destination for serious freelancers and businesses who value quality over quantity.
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//               <button
//                 onClick={() => handleTypeSelect('freelancer')}
//                 disabled={!isHydrated}
//                 className={`group relative px-8 py-4 rounded-lg font-display font-semibold text-lg transition-all duration-300 ${
//                 selectedType === 'freelancer' ? 'bg-accent text-white shadow-brand-lg scale-105' : 'bg-white text-primary hover:bg-accent hover:text-white shadow-brand hover:shadow-brand-lg hover:scale-105'}`
//                 }>

//                 <span className="flex items-center justify-center space-x-2">
//                   <Icon name="UserIcon" size={24} />
//                   <span>I'm a Freelancer</span>
//                 </span>
//               </button>

//               <button
//                 onClick={() => handleTypeSelect('client')}
//                 disabled={!isHydrated}
//                 className={`group relative px-8 py-4 rounded-lg font-display font-semibold text-lg transition-all duration-300 ${
//                 selectedType === 'client' ? 'bg-brand-blue text-white shadow-brand-lg scale-105' : 'bg-white text-primary hover:bg-brand-blue hover:text-white shadow-brand hover:shadow-brand-lg hover:scale-105'}`
//                 }>

//                 <span className="flex items-center justify-center space-x-2">
//                   <Icon name="BriefcaseIcon" size={24} />
//                   <span>I'm Hiring</span>
//                 </span>
//               </button>
//             </div>

//             <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
//               <div className="flex items-center space-x-2 text-white/90">
//                 <Icon name="CheckCircleIcon" size={20} variant="solid" />
//                 <span className="font-body text-sm">Verified Professionals</span>
//               </div>
//               <div className="flex items-center space-x-2 text-white/90">
//                 <Icon name="ShieldCheckIcon" size={20} variant="solid" />
//                 <span className="font-body text-sm">Secure Payments</span>
//               </div>
//               <div className="flex items-center space-x-2 text-white/90">
//                 <Icon name="StarIcon" size={20} variant="solid" />
//                 <span className="font-body text-sm">5-Star Support</span>
//               </div>
//             </div>
//           </div>

//           <div className="hidden lg:block relative">
//             <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-brand-lg">
//               <AppImage
//                 src="/pexels-pavel-danilyuk-8112178.jpg"
//                 alt="Diverse team of professionals collaborating in modern office with laptops and documents on table"
//                 fill
//                 className="w-full h-full" />

//               <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
//             </div>

//             <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-brand-lg p-6 max-w-xs">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-success/10 p-3 rounded-lg">
//                   <Icon name="CheckBadgeIcon" size={32} className="text-success" variant="solid" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-display font-bold text-primary">50K+</p>
//                   <p className="text-sm font-body text-muted-foreground">Projects Completed</p>
//                 </div>
//               </div>
//             </div>

//             <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-brand-lg p-6 max-w-xs">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-brand-blue/10 p-3 rounded-lg">
//                   <Icon name="UserGroupIcon" size={32} className="text-brand-blue" variant="solid" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-display font-bold text-primary">25K+</p>
//                   <p className="text-sm font-body text-muted-foreground">Active Freelancers</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>);

// };

// export default HeroSection;

'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import Image from "next/image";
interface HeroSectionProps {
  onUserTypeSelect: (type: 'freelancer' | 'client') => void;
}

const HeroSection = ({ onUserTypeSelect }: HeroSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedType, setSelectedType] = useState<'freelancer' | 'client' | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleTypeSelect = (type: 'freelancer' | 'client') => {
    if (!isHydrated) return;
    setSelectedType(type);
    onUserTypeSelect(type);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary via-secondary to-primary min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-blue rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-success rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/30">
              <Icon name="ShieldCheckIcon" size={20} variant="solid" />
              <span className="text-sm font-body font-medium">Trusted by 25,000+ professionals globally</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight">
                Where Talent Meets{' '}
                <span className="text-accent relative">
                  Opportunity
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                    <path d="M0 8C66.6667 2.66667 133.333 2.66667 200 8" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl sm:text-xl text-white/90 font-body max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Build your business, not just your portfolio. Join the premium destination where serious freelancers meet clients who value quality over quantity.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => handleTypeSelect('freelancer')}
                disabled={!isHydrated}
                className={`group relative px-8 py-5 rounded-xl font-display font-bold text-lg transition-all duration-300 ${selectedType === 'freelancer'
                  ? 'bg-accent text-white shadow-brand-lg scale-105'
                  : 'bg-white text-primary hover:bg-accent hover:text-white shadow-brand hover:shadow-brand-lg hover:scale-105'
                  }`}
              >
                <span className="flex items-center justify-center space-x-3">
                  <Icon name="UserIcon" size={24} />
                  <span>I'm a Freelancer</span>
                  <Icon name="ArrowRightIcon" size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => handleTypeSelect('client')}
                disabled={!isHydrated}
                className={`group relative px-8 py-5 rounded-xl font-display font-bold text-lg transition-all duration-300 ${selectedType === 'client'
                  ? 'bg-brand-blue text-white shadow-brand-lg scale-105'
                  : 'bg-white text-primary hover:bg-brand-blue hover:text-white shadow-brand hover:shadow-brand-lg hover:scale-105'
                  }`}
              >
                <span className="flex items-center justify-center space-x-3">
                  <Icon name="BriefcaseIcon" size={24} />
                  <span>I'm Hiring Talent </span>
                  <Icon name="ArrowRightIcon" size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                <Icon name="CheckCircleIcon" size={20} variant="solid" className="text-success" />
                <span className="font-body text-sm font-medium">Verified Professionals</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                <Icon name="LockClosedIcon" size={20} variant="solid" className="text-brand-blue" />
                <span className="font-body text-sm font-medium">Secure Escrow</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                <Icon name="StarIcon" size={20} variant="solid" className="text-warning" />
                <span className="font-body text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="hidden lg:block relative">
            {/* Main Image Container */}
            <div className="relative w-full h-[550px] rounded-3xl overflow-hidden shadow-2xl">
              {/* <AppImage
                src="/homepage.png"
                alt="Diverse team of professionals collaborating in modern office with laptops and documents on table"
                fill
                className="w-full h-full object-cover"
              /> */}
              {/* <img src="/homepage.png" className="w-full h-full object-cover" alt="Diverse team of professionals collaborating in modern office with laptops and documents on table" /> */}
              <Image src="/homepage.png" fill className="w-full h-full object-cover" alt="Diverse team of professionals collaborating in modern office with laptops and documents on table" priority sizes="(max-width: 768px) 100vw, 50vw" />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent"></div> */}
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 max-w-xs animate-float">
              <div className="flex items-center space-x-4">
                <div className="bg-success/10 p-4 rounded-xl">
                  <Icon name="CheckBadgeIcon" size={36} className="text-success" variant="solid" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary">50K+</p>
                  <p className="text-sm font-body text-muted-foreground">Projects Completed</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 max-w-xs animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center space-x-4">
                <div className="bg-brand-blue/10 p-4 rounded-xl">
                  <Icon name="UserGroupIcon" size={36} className="text-brand-blue" variant="solid" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary">25K+</p>
                  <p className="text-sm font-body text-muted-foreground">Active Freelancers</p>
                </div>
              </div>
            </div>

            {/* Total Earnings - Repositioned to right middle */}
            {/* <div className="absolute top-1/3 -right-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-4">
                <div className="bg-accent/10 p-4 rounded-xl">
                  <Icon name="CurrencyDollarIcon" size={36} className="text-accent" variant="solid" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-primary">$250M+</p>
                  <p className="text-sm font-body text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;