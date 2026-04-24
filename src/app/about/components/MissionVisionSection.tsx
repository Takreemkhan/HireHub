'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function MissionVisionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1B365D] to-[#2A4A7F] rounded-2xl p-8 md:p-10 text-white h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35] opacity-20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl mb-6">
                    <Icon name="RocketLaunchIcon" size={32} className="text-[#FF6B35]" />
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold mb-4">Our Mission</h3>
                  
                  <p className="text-lg text-gray-100 leading-relaxed mb-6">
                    To revolutionize the freelancing industry by creating a platform where 
                    quality, trust, and professionalism are not just goals, but guarantees.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={24} className="text-[#4299E1] flex-shrink-0 mt-1" />
                      <p className="text-gray-200">
                        Empower freelancers to build sustainable, thriving careers
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={24} className="text-[#4299E1] flex-shrink-0 mt-1" />
                      <p className="text-gray-200">
                        Enable businesses to access world-class talent effortlessly
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={24} className="text-[#4299E1] flex-shrink-0 mt-1" />
                      <p className="text-gray-200">
                        Foster a community built on mutual respect and excellence
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl p-8 md:p-10 text-white h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B365D] opacity-20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl mb-6">
                    <Icon name="EyeIcon" size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold mb-4">Our Vision</h3>
                  
                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    To become the global standard for professional freelancing, where every 
                    project is a success story and every connection leads to growth.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={24} className="text-white flex-shrink-0 mt-1" />
                      <p className="text-white/90">
                        Leading innovation in freelance work management
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={24} className="text-white flex-shrink-0 mt-1" />
                      <p className="text-white/90">
                        Setting new benchmarks for platform security and trust
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={24} className="text-white flex-shrink-0 mt-1" />
                      <p className="text-white/90">
                        Building the largest community of verified professionals
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-16">
            <h3 className="text-3xl font-display font-bold text-center text-primary mb-12">
              Our Core <span className="text-[#FF6B35]">Values</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1B365D] text-white rounded-full mb-4">
                  <Icon name="HeartIcon" size={28} />
                </div>
                <h4 className="text-lg font-bold text-primary mb-2">Integrity</h4>
                <p className="text-sm text-muted-foreground">
                  Honest, transparent, and ethical in everything we do
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FF6B35] text-white rounded-full mb-4">
                  <Icon name="SparklesIcon" size={28} />
                </div>
                <h4 className="text-lg font-bold text-primary mb-2">Excellence</h4>
                <p className="text-sm text-muted-foreground">
                  Committed to the highest standards of quality
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1B365D] text-white rounded-full mb-4">
                  <Icon name="UserGroupIcon" size={28} />
                </div>
                <h4 className="text-lg font-bold text-primary mb-2">Community</h4>
                <p className="text-sm text-muted-foreground">
                  Building meaningful connections that last
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FF6B35] text-white rounded-full mb-4">
                  <Icon name="LightBulbIcon" size={28} />
                </div>
                <h4 className="text-lg font-bold text-primary mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Constantly evolving to serve you better
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}