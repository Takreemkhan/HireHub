'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import EarningsDashboard from './EarningsDashboard';
import ClientDashboard from './ClientDashboard';
import PaymentMethods from './PaymentMethods';
import TransactionHistory from './TransactionHistory';
import TaxDocuments from './TaxDocuments';
import WithdrawalSection from './WithdrawalSection';
import Icon from '@/components/ui/AppIcon';
import WalletSection from './WalletSection';
import Skeleton from '@/components/ui/Skeleton';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { useBusinessPages } from '@/app/hook/useBusinessPages';

const PaymentCenterInteractive = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const userRole = (session?.user as any)?.role || '';
  const isFreelancer = userRole === 'freelancer';

  const { data: businessPages = [], isLoading: bpLoading } = useBusinessPages(userId, isFreelancer);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'methods' | 'tax' | 'withdraw' | 'wallet'>('overview');
  const [viewMode, setViewMode] = useState<'freelancer' | 'business'>('freelancer');

  const sessionReady = status !== 'loading';
  const hasBusinessPages = businessPages.length > 0;

  useEffect(() => { setIsHydrated(true); }, []);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: 'ChartBarIcon' },
    { id: 'transactions' as const, label: 'Transactions', icon: 'ListBulletIcon' },
    { id: 'methods' as const, label: 'Payment Methods', icon: 'CreditCardIcon' },
    { id: 'tax' as const, label: 'Tax Documents', icon: 'DocumentTextIcon' },
    { id: 'withdraw' as const, label: 'Withdraw', icon: 'BanknotesIcon' },
    { id: 'wallet' as const, label: 'Wallet', icon: 'BanknotesIcon' },
  ];

  if (!isHydrated || !sessionReady) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 px-4 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex space-x-2 mb-8 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (<Skeleton key={i} className="h-12 w-32 rounded-lg" />))}
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (<Skeleton key={i} className="h-32 w-full rounded-xl" />))}
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Overview content — 3 cases ────────────────────────────────────────────
  const renderOverview = () => {
    if (!isFreelancer) return <ClientDashboard />;
    if (!hasBusinessPages) return <EarningsDashboard />;

    // Freelancer WITH business pages
    if (viewMode === 'business') {
      return (
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Business Page Spending</h2>
            </div>
            <ClientDashboard />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Split header */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Freelancer Earnings</p>
              <p className="text-sm text-emerald-600">Income from your freelance work</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Business Spend</p>
              <p className="text-sm text-blue-600">
                Spending across {businessPages.length} business page{businessPages.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Freelancer Earnings</h2>
          </div>
          <EarningsDashboard />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Payment Center</h1>
            <p className="text-muted-foreground font-body">
              {isFreelancer && hasBusinessPages
                ? (viewMode === 'freelancer' ? 'Your freelance earnings and business page spending overview' : 'Your business page spending details')
                : isFreelancer
                ? 'Manage your earnings, payments, and financial documents in one secure place'
                : 'Manage your project spending, payments, and financial documents in one secure place'}
            </p>
          </div>
          {isFreelancer && hasBusinessPages && (
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 mt-2 md:mt-0 shadow-sm">
              <button 
                onClick={() => setViewMode('freelancer')} 
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${viewMode === 'freelancer' ? 'bg-white shadow text-[#1B365D]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Freelancer
              </button>
              <button 
                onClick={() => setViewMode('business')} 
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${viewMode === 'business' ? 'bg-white shadow text-[#1B365D]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Business Page
              </button>
            </div>
          )}
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-body font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                }`}
              >
                <Icon name={tab.icon as any} size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="animation-smooth">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'transactions' && <TransactionHistory viewMode={!isFreelancer ? 'client' : viewMode} />}
          {activeTab === 'methods' && <PaymentMethods />}
          {activeTab === 'tax' && <TaxDocuments />}
          {activeTab === 'withdraw' && <WithdrawalSection />}
          {activeTab === 'wallet' && <WalletSection viewMode={!isFreelancer ? 'client' : viewMode} />}
        </div>
      </div>
    </div>
  );
};

export default PaymentCenterInteractive;
