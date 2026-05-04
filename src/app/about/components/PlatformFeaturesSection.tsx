'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function PlatformFeaturesSection() {
  const features = [
    {
      icon: 'RocketLaunchIcon',
      title: 'Smart Matching Algorithm',
      description: 'Our AI-powered system connects you with the perfect matches based on skills, experience, budget, and project requirements.',
      bgColor: 'bg-blue-50',
      iconColor: 'text-[#1B365D]',
    },
    {
      icon: 'DocumentTextIcon',
      title: 'Automated Contracts',
      description: 'Generate legally-binding contracts instantly. Protect both parties with clear terms, milestones, and payment schedules.',
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FF6B35]',
    },
    {
      icon: 'ChartBarSquareIcon',
      title: 'Comprehensive Analytics',
      description: 'Track project progress, earnings, and performance metrics with detailed dashboards and real-time reporting.',
      bgColor: 'bg-blue-50',
      iconColor: 'text-[#1B365D]',
    },
    {
      icon: 'VideoCameraIcon',
      title: 'Integrated Workspace',
      description: 'Video calls, screen sharing, file management, and time tracking - all in one platform. No external tools needed.',
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FF6B35]',
    },
    {
      icon: 'AcademicCapIcon',
      title: 'Skill Development',
      description: 'Access free courses, workshops, and certifications to enhance your skills and stay competitive in the market.',
      bgColor: 'bg-blue-50',
      iconColor: 'text-[#1B365D]',
    },
    {
      icon: 'BuildingLibraryIcon',
      title: 'Dispute Resolution',
      description: 'Fair and fast conflict resolution with our expert mediation team. Most disputes resolved within 48 hours.',
      bgColor: 'bg-orange-50',
      iconColor: 'text-[#FF6B35]',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#FF6B35]/10 text-[#FF6B35] px-4 py-2 rounded-full mb-4">
            <Icon name="SparklesIcon" size={16} />
            <span className="text-sm font-semibold">Platform Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Powerful Tools for <span className="text-[#FF6B35]">Success</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We've packed FreelanceHub Pro with cutting-edge features designed to make 
            freelancing easier, safer, and more profitable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-card rounded-2xl p-8 border border-border hover:border-[#FF6B35]/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon name={feature.icon as any} size={32} className={feature.iconColor} />
                </div>
                
                <h3 className="text-xl font-display font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1B365D]/5 to-[#FF6B35]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#1B365D] to-[#2A4A7F] rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Mobile App Coming Soon
              </h3>
              <p className="text-gray-200">
                Manage your projects on the go with our iOS and Android apps. Stay connected anywhere, anytime.
              </p>
            </div>
            <div className="flex space-x-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg text-center">
                <Icon name="DevicePhoneMobileIcon" size={32} className="mx-auto mb-2 text-[#FF6B35]" />
                <div className="text-sm font-semibold">iOS</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg text-center">
                <Icon name="DeviceTabletIcon" size={32} className="mx-auto mb-2 text-[#4299E1]" />
                <div className="text-sm font-semibold">Android</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}