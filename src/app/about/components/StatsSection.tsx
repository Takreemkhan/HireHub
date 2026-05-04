'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function StatsSection() {
  const stats = [
    {
      icon: 'UserGroupIcon',
      number: '25,000+',
      label: 'Verified Freelancers',
      description: 'Top professionals from around the world',
      color: 'blue',
    },
    {
      icon: 'BriefcaseIcon',
      number: '50,000+',
      label: 'Projects Completed',
      description: 'Successfully delivered with excellence',
      color: 'orange',
    },
    {
      icon: 'CurrencyDollarIcon',
      number: '$50M+',
      label: 'Paid to Freelancers',
      description: 'Fair compensation, secure transactions',
      color: 'blue',
    },
    {
      icon: 'StarIcon',
      number: '98%',
      label: 'Satisfaction Rate',
      description: 'Clients and freelancers love us',
      color: 'orange',
    },
    {
      icon: 'ClockIcon',
      number: '< 2hrs',
      label: 'Average Response',
      description: 'Lightning-fast support team',
      color: 'blue',
    },
    {
      icon: 'GlobeAltIcon',
      number: '150+',
      label: 'Countries',
      description: 'Truly global marketplace',
      color: 'orange',
    },
  ];

  const achievements = [
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'FreelanceHub Pro goes live with 5,000 verified professionals',
    },
    {
      year: '2024',
      title: 'Rapid Growth',
      description: 'Reached 25,000+ active users and 50,000+ completed projects',
    },
    {
      year: '2025',
      title: 'Industry Recognition',
      description: 'Awarded "Best Freelancing Platform" by Tech Innovation Awards',
    },
    {
      year: '2026',
      title: 'Global Expansion',
      description: 'Serving clients and freelancers in over 150 countries worldwide',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Our Impact in <span className="text-[#FF6B35]">Numbers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real achievements, real growth, real success stories. 
            Here's what we've accomplished together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#FF6B35]/30"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110 ${
                stat.color === 'blue'
                  ? 'bg-[#1B365D]/10 text-[#1B365D]'
                  : 'bg-[#FF6B35]/10 text-[#FF6B35]'
              }`}>
                <Icon name={stat.icon as any} size={28} />
              </div>
              
              <div className="text-4xl font-display font-bold text-primary mb-2">
                {stat.number}
              </div>
              
              <div className="text-lg font-semibold text-primary mb-2">
                {stat.label}
              </div>
              
              <p className="text-muted-foreground text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-display font-bold text-center text-primary mb-12">
            Our <span className="text-[#FF6B35]">Journey</span>
          </h3>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#1B365D] via-[#FF6B35] to-[#1B365D]"></div>
            
            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-[#FF6B35]/30 transition-all duration-300">
                      <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-3 ${
                        index % 2 === 0 
                          ? 'bg-[#1B365D] text-white' 
                          : 'bg-[#FF6B35] text-white'
                      }`}>
                        {achievement.year}
                      </div>
                      <h4 className="text-xl font-bold text-primary mb-2">
                        {achievement.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex w-2/12 justify-center my-4 md:my-0">
                    <div className={`w-4 h-4 rounded-full ${
                      index % 2 === 0 ? 'bg-[#1B365D]' : 'bg-[#FF6B35]'
                    } border-4 border-white shadow-lg z-10`}></div>
                  </div>
                  
                  <div className="w-full md:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 bg-gradient-to-r from-[#1B365D] to-[#2A4A7F] rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
            Trusted By Industry Leaders
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-3">
                <Icon name="ShieldCheckIcon" size={32} className="text-[#FF6B35]" />
              </div>
              <div className="text-sm text-gray-200">SSL Encrypted</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-3">
                <Icon name="LockClosedIcon" size={32} className="text-[#4299E1]" />
              </div>
              <div className="text-sm text-gray-200">GDPR Compliant</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-3">
                <Icon name="CheckBadgeIcon" size={32} className="text-[#FF6B35]" />
              </div>
              <div className="text-sm text-gray-200">Verified Payments</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-3">
                <Icon name="StarIcon" size={32} className="text-[#4299E1]" />
              </div>
              <div className="text-sm text-gray-200">Award Winning</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}