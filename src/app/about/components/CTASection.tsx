'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main CTA */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1B365D] via-[#2A4A7F] to-[#1B365D] rounded-3xl p-8 md:p-16 text-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35] opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4299E1] opacity-20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Icon name="SparklesIcon" size={20} className="text-[#FF6B35]" />
                <span className="text-sm font-semibold">Join Today</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                Ready to Experience the{' '}
                <span className="text-[#FF6B35]">Difference</span>?
              </h2>
              
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
                Join thousands of professionals who've already discovered a better way 
                to freelance. Start your journey with FreelanceHub Pro today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up-page">
                  <button className="flex items-center space-x-2 px-8 py-4 bg-[#FF6B35] text-white rounded-lg font-display font-semibold hover:bg-[#FF8C5A] transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span>Get Started Free</span>
                    <Icon name="ArrowRightIcon" size={20} />
                  </button>
                </Link>
                
                <Link href="/search-and-discovery">
                  <button className="flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-display font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30">
                    <Icon name="MagnifyingGlassIcon" size={20} />
                    <span>Browse Projects</span>
                  </button>
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-gray-300">
                No credit card required • Free to join • Cancel anytime
              </p>
            </div>
          </div>

          {/* Split CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* For Clients */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1B365D] text-white rounded-xl mb-6">
                <Icon name="BriefcaseIcon" size={28} />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-primary mb-3">
                Hiring Talent?
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Find pre-vetted professionals ready to bring your projects to life. 
                Post a job and receive proposals within hours.
              </p>
              
              <Link href="/post-page">
                <button className="flex items-center space-x-2 px-6 py-3 bg-[#1B365D] text-white rounded-lg font-semibold hover:bg-[#2A4A7F] transition-all duration-300 w-full justify-center">
                  <span>Post a Project</span>
                  <Icon name="PlusCircleIcon" size={20} />
                </button>
              </Link>
              
              <div className="mt-6 flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="CheckCircleIcon" size={18} className="text-green-600" />
                <span>Free to post • No hidden fees</span>
              </div>
            </div>

            {/* For Freelancers */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-orange-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FF6B35] text-white rounded-xl mb-6">
                <Icon name="UserIcon" size={28} />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-primary mb-3">
                Looking for Work?
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Browse thousands of quality projects and connect with clients 
                who value your expertise and pay fairly.
              </p>
              
              <Link href="/search-and-discovery">
                <button className="flex items-center space-x-2 px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#FF8C5A] transition-all duration-300 w-full justify-center">
                  <span>Find Projects</span>
                  <Icon name="MagnifyingGlassIcon" size={20} />
                </button>
              </Link>
              
              <div className="mt-6 flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="CheckCircleIcon" size={18} className="text-green-600" />
                <span>100% free to apply • Keep 90-95%</span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Have Questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you succeed. Reach out anytime.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="EnvelopeIcon" size={20} className="text-[#1B365D]" />
                <span>support@freelancehubpro.com</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="PhoneIcon" size={20} className="text-[#FF6B35]" />
                <span>+1 (555) 123-4567</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-[#1B365D]" />
                <span>Live Chat Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}