'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#1B365D] via-[#2A4A7F] to-[#1B365D] text-white pt-32 pb-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4299E1] opacity-10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Icon name="SparklesIcon" size={20} className="text-[#FF6B35]" />
            <span className="text-sm font-semibold">About FreelanceHub Pro</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            Where <span className="text-[#FF6B35]">Quality</span> Meets{' '}
            <span className="text-[#4299E1]">Opportunity</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're not just another freelancing platform. We're a premium destination 
            for professionals who value quality over quantity, where every connection matters 
            and every project is an opportunity for excellence.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-[#FF6B35]">25K +</div>
              <div className="text-sm text-gray-300">Verified Professionals</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-[#4299E1]">50K+</div>
              <div className="text-sm text-gray-300">Projects Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-[#FF6B35]">98%</div>
              <div className="text-sm text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}