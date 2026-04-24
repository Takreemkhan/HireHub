'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function WhyChooseUsSection() {
  const clientBenefits = [
    {
      icon: 'UserGroupIcon',
      title: 'Pre-Vetted Talent',
      description: 'Access top 5% of freelancers who have passed our screening',
    },
    {
      icon: 'ClockIcon',
      title: 'Faster Hiring',
      description: 'Find the right expert in hours, not weeks',
    },
    {
      icon: 'ShieldCheckIcon',
      title: 'Risk-Free Projects',
      description: 'Protected payments and guaranteed quality or refund',
    },
    {
      icon: 'CurrencyDollarIcon',
      title: 'Competitive Rates',
      description: 'Pay fair market rates without platform markups',
    },
  ];

  const freelancerBenefits = [
    {
      icon: 'BriefcaseIcon',
      title: 'Premium Projects',
      description: 'Work on high-value projects with serious clients',
    },
    {
      icon: 'BanknotesIcon',
      title: 'Higher Earnings',
      description: 'Keep more of what you earn with low fees',
    },
    {
      icon: 'CalendarDaysIcon',
      title: 'Flexible Schedule',
      description: 'Choose your projects and work on your terms',
    },
    {
      icon: 'ChartBarIcon',
      title: 'Career Growth',
      description: 'Build your reputation and expand your portfolio',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            Why Choose <span className="text-[#FF6B35]">FreelanceHub Pro</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you're hiring or freelancing, we've designed our platform 
            to maximize your success and minimize your hassles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* For Clients */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-[#1B365D] text-white p-3 rounded-xl">
                <Icon name="BriefcaseIcon" size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">
                For Clients
              </h3>
            </div>

            <div className="space-y-6">
              {clientBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#1B365D]/10 rounded-lg flex items-center justify-center">
                    <Icon name={benefit.icon as any} size={24} className="text-[#1B365D]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Freelancers */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-[#FF6B35] text-white p-3 rounded-xl">
                <Icon name="UserIcon" size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">
                For Freelancers
              </h3>
            </div>

            <div className="space-y-6">
              {freelancerBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                    <Icon name={benefit.icon as any} size={24} className="text-[#FF6B35]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}