// 'use client';

// import React, { useState } from 'react';
// import HeroSection from './HeroSection';
// import StatsSection from './StatsSection';
// import TestimonialCarousel from './TestimonialCarousel';
// import FeaturesSection from './FeaturesSection';
// import CaseStudiesSection from './CaseStudiesSection';
// import TrustSignalsSection from './TrustSignalsSection';
// import CTASection from './CTASection';
// import FooterSection from './FooterSection';

// const HomepageInteractive = () => {
//   const [selectedUserType, setSelectedUserType] = useState<'freelancer' | 'client' | null>(null);

//   const handleUserTypeSelect = (type: 'freelancer' | 'client') => {
//     setSelectedUserType(type);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <HeroSection onUserTypeSelect={handleUserTypeSelect} />
//       <StatsSection />
//       <FeaturesSection />
//       <TestimonialCarousel />
//       <CaseStudiesSection />
//       <TrustSignalsSection />
//       <CTASection />
//       <FooterSection />
//     </div>
//   );
// };

// export default HomepageInteractive;


'use client';

import React, { useState } from 'react';
import ImprovedHeroSection from './HeroSection';
import StatsSection from './StatsSection';
import TestimonialCarousel from './TestimonialCarousel';
import ImprovedFeaturesSection from './FeaturesSection';
import CaseStudiesSection from './CaseStudiesSection';
import CTASection from './CTASection';
import FooterSection from './FooterSection';

const HomepageInteractive = () => {
  const [selectedUserType, setSelectedUserType] = useState<'freelancer' | 'client' | null>(null);

  const handleUserTypeSelect = (type: 'freelancer' | 'client') => {
    setSelectedUserType(type);
    
    // Smooth scroll to features section after selection
    setTimeout(() => {
      const featuresSection = document.getElementById('features-section');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Enhanced with better CTAs and visuals */}
      <ImprovedHeroSection onUserTypeSelect={handleUserTypeSelect} />
      
      {/* Stats Section - Social proof early */}
      <StatsSection />
      
      {/* Features Section - Enhanced with better descriptions */}
      <div id="features-section">
        <ImprovedFeaturesSection />
      </div>
      
      {/* Testimonials - Build trust with real stories */}
      <TestimonialCarousel />
      
      {/* Case Studies - Show real results */}
      <CaseStudiesSection />
      
      {/* CTA Section - Drive conversions */}
      <CTASection />
      
      {/* Footer - Complete navigation */}
      <FooterSection />
    </div>
  );
};

export default HomepageInteractive;