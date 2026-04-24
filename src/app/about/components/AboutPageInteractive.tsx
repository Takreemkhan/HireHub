'use client';

import React, { useState } from 'react';
import HeroSection from './HeroSection';
import DifferenceSection from './DifferenceSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import PlatformFeaturesSection from './PlatformFeaturesSection';
import ComparisonSection from './ComparisonSection';
import MissionVisionSection from './MissionVisionSection';
import StatsSection from './StatsSection';
import CTASection from './CTASection';

export default function AboutPageInteractive() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DifferenceSection />
      <WhyChooseUsSection />
      <PlatformFeaturesSection />
      <ComparisonSection />
      <MissionVisionSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}