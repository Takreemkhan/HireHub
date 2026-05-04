// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Icon from '@/components/ui/AppIcon';

// const CTASection = () => {
//   const [isHydrated, setIsHydrated] = useState(false);

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   return (
//     <section className="bg-gradient-to-br from-primary via-secondary to-primary py-16 lg:py-24">
//       <div className="max-w-7xl mx-auto px-4 lg:px-8">
//         <div className="text-center space-y-8">
//           <div className="space-y-4">
//             <h2 className="text-3xl lg:text-5xl font-display font-bold text-white">
//               Ready to Transform Your Career or Business?
//             </h2>
//             <p className="text-lg lg:text-xl text-white/90 font-body max-w-3xl mx-auto">
//               Join thousands of professionals who have already discovered the power of meaningful work relationships. Start your journey today with FreelanceHub Pro.
//             </p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Link
//               href="/freelancer-profiles"
//               className="group inline-flex items-center space-x-2 px-8 py-4 bg-accent text-white rounded-lg font-display font-semibold text-lg shadow-brand-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
//             >
//               <span>Browse Talent</span>
//               <Icon name="ArrowRightIcon" size={24} />
//             </Link>

//             <Link
//               href="/project-detail-pages"
//               className="group inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary rounded-lg font-display font-semibold text-lg shadow-brand-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
//             >
//               <span>Find Projects</span>
//               <Icon name="MagnifyingGlassIcon" size={24} />
//             </Link>
//           </div>

//           <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
//             <div className="flex items-center space-x-3 text-white">
//               <div className="bg-white/20 p-2 rounded-lg">
//                 <Icon name="CheckCircleIcon" size={24} variant="solid" />
//               </div>
//               <span className="font-body">No credit card required</span>
//             </div>
//             <div className="flex items-center space-x-3 text-white">
//               <div className="bg-white/20 p-2 rounded-lg">
//                 <Icon name="ClockIcon" size={24} variant="solid" />
//               </div>
//               <span className="font-body">Setup in 5 minutes</span>
//             </div>
//             <div className="flex items-center space-x-3 text-white">
//               <div className="bg-white/20 p-2 rounded-lg">
//                 <Icon name="UserGroupIcon" size={24} variant="solid" />
//               </div>
//               <span className="font-body">Join 25,000+ professionals</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CTASection;


'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const CTASection = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-primary via-secondary to-primary py-20 lg:py-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-blue rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-success rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
        <div className="text-center space-y-10">
          {/* Urgency Badge */}
          <div className="inline-flex items-center space-x-2 bg-accent/20 backdrop-blur-sm px-5 py-2 rounded-full text-white border border-accent/30">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm font-body font-semibold">Join 250+ professionals who signed up this week</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Ready to Transform Your{' '}
              <span className="relative">
                Career
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                  <path d="M0 8C100 2.66667 200 2.66667 300 8" stroke="#FF6B35" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
              {' '}or{' '}
              <span className="relative">
                Business?
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                  <path d="M0 8C100 2.66667 200 2.66667 300 8" stroke="#4299E1" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-white/90 font-body max-w-4xl mx-auto leading-relaxed">
              Join thousands of professionals who've discovered the power of meaningful work relationships. Start your journey today with FreelanceHub Pro.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
            <Link
              href="/sign-up-page"
              className="group inline-flex items-center space-x-3 px-10 py-5 bg-accent text-white rounded-xl font-display font-bold text-lg shadow-2xl hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-accent/50"
            >
              <span>Get Started Free</span>
              <Icon name="ArrowRightIcon" size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="group inline-flex items-center space-x-3 px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-display font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <Icon name="PlayCircleIcon" size={24} />
              <span>Watch Demo</span>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
            <div className="flex flex-col items-center space-y-3 bg-white/10 backdrop-blur-sm px-6 py-5 rounded-2xl border border-white/20">
              <div className="bg-white/20 p-3 rounded-xl">
                <Icon name="CheckCircleIcon" size={28} className="text-white" variant="solid" />
              </div>
              <div className="text-center">
                <p className="text-white font-body font-semibold">No Credit Card</p>
                <p className="text-white/70 text-sm font-body">Required to start</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 bg-white/10 backdrop-blur-sm px-6 py-5 rounded-2xl border border-white/20">
              <div className="bg-white/20 p-3 rounded-xl">
                <Icon name="ClockIcon" size={28} className="text-white" variant="solid" />
              </div>
              <div className="text-center">
                <p className="text-white font-body font-semibold">5-Minute Setup</p>
                <p className="text-white/70 text-sm font-body">Start earning today</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3 bg-white/10 backdrop-blur-sm px-6 py-5 rounded-2xl border border-white/20">
              <div className="bg-white/20 p-3 rounded-xl">
                <Icon name="UserGroupIcon" size={28} className="text-white" variant="solid" />
              </div>
              <div className="text-center">
                <p className="text-white font-body font-semibold">25K+ Community</p>
                <p className="text-white/70 text-sm font-body">Active professionals</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8">
            <p className="text-white/70 font-body mb-6">Trusted by professionals from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-70">
              <div className="text-white font-display font-bold text-xl">Google</div>
              <div className="text-white font-display font-bold text-xl">Microsoft</div>
              <div className="text-white font-display font-bold text-xl">Amazon</div>
              <div className="text-white font-display font-bold text-xl">Meta</div>
              <div className="text-white font-display font-bold text-xl">Apple</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" fillOpacity="0.1"/>
        </svg>
      </div>
    </section>
  );
};

export default CTASection;