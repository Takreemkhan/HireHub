'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function DifferenceSection() {
  const differences = [
    {
      icon: 'ShieldCheckIcon',
      title: 'Verified Professionals Only',
      description: 'Every freelancer goes through our rigorous verification process. We check portfolios, test skills, and verify identities to ensure you work with genuine experts.',
      color: 'blue',
    },
    {
      icon: 'CurrencyDollarIcon',
      title: 'Fair & Transparent Pricing',
      description: 'No hidden fees or surprise charges. We maintain the lowest commission rates in the industry, with clear pricing that benefits both clients and freelancers.',
      color: 'orange',
    },
    {
      icon: 'LockClosedIcon',
      title: 'Secure Payment Escrow',
      description: 'Your funds are protected with our advanced escrow system. Payments are only released when milestones are met, ensuring peace of mind for everyone.',
      color: 'blue',
    },
    {
      icon: 'StarIcon',
      title: 'Quality Over Quantity',
      description: 'We curate our talent pool carefully. Unlike platforms with millions of unverified users, we focus on maintaining a community of skilled, reliable professionals.',
      color: 'orange',
    },
    {
      icon: 'ChatBubbleLeftRightIcon',
      title: 'Real-Time Communication',
      description: 'Built-in chat, video calls, and collaboration tools. No need for third-party apps - everything you need is right here in one integrated workspace.',
      color: 'blue',
    },
    {
      icon: 'ClockIcon',
      title: '24/7 Premium Support',
      description: 'Get help whenever you need it. Our dedicated support team is available around the clock to resolve issues and ensure smooth project execution.',
      color: 'orange',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
            What Makes Us <span className="text-[#FF6B35]">Different</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We've built FreelanceHub Pro from the ground up with one goal: creating the most 
            reliable, secure, and efficient platform for professional freelancing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differences.map((item, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-[#FF6B35]/30"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  item.color === 'blue'
                    ? 'bg-[#1B365D]/10 text-[#1B365D]'
                    : 'bg-[#FF6B35]/10 text-[#FF6B35]'
                }`}
              >
                <Icon name={item.icon as any} size={28} />
              </div>
              
              <h3 className="text-xl font-display font-bold text-primary mb-3">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}