'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const FooterSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentYear, setCurrentYear] = useState('2026');

  useEffect(() => {
    setIsHydrated(true);
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const footerLinks = {
    platform: [
      { name: 'Find Talent', path: '/freelancer-profiles' },
      { name: 'Browse Projects', path: '/project-detail-pages' },
      { name: 'Workspace', path: '/workspace-dashboard' },
      { name: 'Search', path: '/search-and-discovery' },
    ],
    resources: [
      { name: 'Help Center', path: '/help-center' },
      { name: 'Community Forum', path: '/community-forum' },
      { name: 'Learning Academy', path: '/learning-academy' },
      { name: 'Blog', path: '/blog' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press Kit', path: '/press-kit' },
      { name: 'Contact', path: '/contact' },
    ],
    legal: [
      { name: 'Terms & Conditions', path: '/terms-&-conditions' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Cookie Policy', path: '/cookie-policy' },
      { name: 'Security', path: '/security' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'AtSymbolIcon', url: 'https://x.com' },
    { name: 'LinkedIn', icon: 'BuildingOfficeIcon', url: 'https://www.linkedin.com' },
    { name: 'Facebook', icon: 'UserGroupIcon', url: 'https://www.facebook.com' },
    { name: 'Instagram', icon: 'CameraIcon', url: 'https://www.instagram.com' },
  ];

  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Link href="/homepage" className="flex items-center space-x-3 mb-4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="8" fill="#1B365D" />
                <path
                  d="M12 28V12H18C19.6569 12 21 13.3431 21 15V15C21 16.6569 19.6569 18 18 18H12"
                  stroke="#FF6B35"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 28V18H26C27.6569 18 29 19.3431 29 21V21C29 22.6569 27.6569 24 26 24H20"
                  stroke="#4299E1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <span className="text-lg font-display font-bold">FreelanceHub</span>
                <span className="text-lg font-display font-bold text-accent ml-1">Pro</span>
              </div>
            </Link>
            <p className="text-sm text-white/70 font-body mb-4">
              Where talent meets opportunity. Professional freelancing, simplified.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-300"
                  aria-label={social.name}
                >
                  <Icon name={social.icon as any} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-white/70 hover:text-accent transition-colors duration-300 font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-white/70 hover:text-accent transition-colors duration-300 font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-white/70 hover:text-accent transition-colors duration-300 font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-white/70 hover:text-accent transition-colors duration-300 font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-white/70 font-body">
              {isHydrated ? `© ${currentYear}` : '© 2026'} FreelanceHub Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="ShieldCheckIcon" size={20} className="text-success" variant="solid" />
                <span className="text-sm text-white/70 font-body">SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="LockClosedIcon" size={20} className="text-success" variant="solid" />
                <span className="text-sm text-white/70 font-body">256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;