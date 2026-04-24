'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TaxDocument {
  id: string;
  year: number;
  type: string;
  status: 'available' | 'processing' | 'pending';
  date: string;
  size: string;
}

const TaxDocuments = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const taxDocuments: TaxDocument[] = [
    {
      id: 'TAX001',
      year: 2025,
      type: '1099-NEC Form',
      status: 'available',
      date: '2026-01-15',
      size: '245 KB',
    },
    {
      id: 'TAX002',
      year: 2025,
      type: 'Annual Earnings Summary',
      status: 'available',
      date: '2026-01-15',
      size: '189 KB',
    },
    {
      id: 'TAX003',
      year: 2024,
      type: '1099-NEC Form',
      status: 'available',
      date: '2025-01-20',
      size: '238 KB',
    },
    {
      id: 'TAX004',
      year: 2024,
      type: 'Annual Earnings Summary',
      status: 'available',
      date: '2025-01-20',
      size: '195 KB',
    },
  ];

  const taxTips = [
    {
      icon: 'DocumentTextIcon',
      title: 'Keep Records',
      description: 'Maintain detailed records of all income and expenses throughout the year.',
    },
    {
      icon: 'CalculatorIcon',
      title: 'Quarterly Estimates',
      description: 'Consider making quarterly estimated tax payments to avoid penalties.',
    },
    {
      icon: 'AcademicCapIcon',
      title: 'Deductions',
      description: 'Track business expenses like equipment, software, and home office costs.',
    },
  ];

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">Tax Documents</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-body font-medium hover:bg-opacity-90 transition-all duration-300">
            <Icon name="DocumentArrowDownIcon" size={20} />
            <span>Download All</span>
          </button>
        </div>

        <div className="space-y-3">
          {taxDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Icon name="DocumentTextIcon" size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-foreground">
                    {doc.type} - {doc.year}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Generated on {doc.date} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                  <Icon name="EyeIcon" size={20} className="text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                  <Icon name="ArrowDownTrayIcon" size={20} className="text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-display font-bold text-foreground mb-6">Tax Planning Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taxTips.map((tip, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3">
                <Icon name={tip.icon as any} size={24} className="text-primary" />
              </div>
              <h3 className="font-body font-semibold text-foreground mb-2">{tip.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Icon name="LightBulbIcon" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg mb-2">Need Tax Help?</h3>
            <p className="text-white/90 font-body mb-4">
              Connect with certified tax professionals who specialize in freelance income. Get personalized advice and maximize your deductions.
            </p>
            <button className="px-6 py-2 bg-white text-primary rounded-lg font-body font-semibold hover:bg-white/90 transition-all duration-300">
              Find a Tax Professional
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDocuments;