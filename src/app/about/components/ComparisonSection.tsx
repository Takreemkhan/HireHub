'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function ComparisonSection() {
  const comparisons = [
    {
      feature: 'Platform Fees',
      us: '5-10%',
      others: '15-25%',
      highlight: true,
    },
    {
      feature: 'Verification Process',
      us: 'Rigorous multi-step',
      others: 'Basic or none',
      highlight: true,
    },
    {
      feature: 'Payment Protection',
      us: 'Full escrow system',
      others: 'Limited or optional',
      highlight: true,
    },
    {
      feature: 'Support Response Time',
      us: '< 2 hours',
      others: '24-48 hours',
      highlight: true,
    },
    {
      feature: 'Dispute Resolution',
      us: '48 hours average',
      others: '1-2 weeks',
      highlight: true,
    },
    {
      feature: 'Quality Control',
      us: 'Continuous monitoring',
      others: 'User reporting only',
      highlight: true,
    },
    {
      feature: 'Communication Tools',
      us: 'Fully integrated',
      others: 'Third-party required',
      highlight: false,
    },
    {
      feature: 'Project Management',
      us: 'Built-in tools',
      others: 'External tools needed',
      highlight: false,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            How We <span className="text-[#FF6B35]">Compare</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See for yourself why thousands of professionals choose FreelanceHub Pro 
            over traditional freelancing platforms.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-3 bg-gradient-to-r from-[#1B365D] to-[#2A4A7F] text-white">
              <div className="p-6 text-lg font-display font-bold">Feature</div>
              <div className="p-6 text-lg font-display font-bold text-center border-l border-white/10">
                <div className="flex items-center justify-center space-x-2">
                  <span>FreelanceHub Pro</span>
                  <Icon name="CheckBadgeIcon" size={24} className="text-[#FF6B35]" />
                </div>
              </div>
              <div className="p-6 text-lg font-display font-bold text-center border-l border-white/10">
                Other Platforms
              </div>
            </div>

            {comparisons.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 border-t border-gray-100 ${
                  item.highlight ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="p-6 font-semibold text-primary flex items-center">
                  {item.feature}
                  {item.highlight && (
                    <Icon name="StarIcon" size={16} className="ml-2 text-[#FF6B35]" />
                  )}
                </div>
                <div className="p-6 text-center border-l border-gray-100 bg-green-50/50">
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="CheckCircleIcon" size={20} className="text-green-600" />
                    <span className="font-semibold text-green-800">{item.us}</span>
                  </div>
                </div>
                <div className="p-6 text-center border-l border-gray-100">
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="XCircleIcon" size={20} className="text-red-500" />
                    <span className="text-muted-foreground">{item.others}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {comparisons.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg p-6 border ${
                  item.highlight ? 'border-[#FF6B35]/30 bg-blue-50/30' : 'border-gray-100'
                }`}
              >
                <div className="font-semibold text-primary mb-4 flex items-center">
                  {item.feature}
                  {item.highlight && (
                    <Icon name="StarIcon" size={16} className="ml-2 text-[#FF6B35]" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">FreelanceHub Pro</span>
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircleIcon" size={18} className="text-green-600" />
                      <span className="font-semibold text-green-800">{item.us}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Others</span>
                    <div className="flex items-center space-x-2">
                      <Icon name="XCircleIcon" size={18} className="text-red-500" />
                      <span className="text-muted-foreground">{item.others}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] rounded-2xl p-8 text-white text-center">
            <Icon name="TrophyIcon" size={48} className="mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold mb-2">
              The Clear Winner in Professional Freelancing
            </h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Join thousands of satisfied users who've made the switch to a better freelancing experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}