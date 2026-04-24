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

const PaymentCenterInteractive = () => {
  const { data: session, status } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'methods' | 'tax' | 'withdraw' | 'wallet'>('overview');

  // ONLY show Earnings dashboard when user is EXPLICITLY a freelancer
  // All other roles (client, business, etc.) see the Spending/Client dashboard
  const userRole = (session?.user as any)?.role || '';
  const isFreelancer = userRole === 'freelancer';
  const sessionReady = status !== 'loading';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Tabs Skeleton */}
          <div className="flex space-x-2 mb-8 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 w-32 rounded-lg" />
            ))}
          </div>

          {/* Dashboard Skeleton */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Payment Center</h1>
          <p className="text-muted-foreground font-body">
            {isFreelancer
              ? 'Manage your earnings, payments, and financial documents in one secure place'
              : 'Manage your project spending, payments, and financial documents in one secure place'}
          </p>
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-body font-medium transition-all duration-300 ${activeTab === tab.id
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
          {/* Freelancers see Earnings; Clients see Spending */}
          {activeTab === 'overview' && (isFreelancer ? <EarningsDashboard /> : <ClientDashboard />)}
          {activeTab === 'transactions' && <TransactionHistory />}
          {activeTab === 'methods' && <PaymentMethods />}
          {activeTab === 'tax' && <TaxDocuments />}
          {activeTab === 'withdraw' && <WithdrawalSection />}
          {activeTab === 'wallet' && <WalletSection />}
        </div>
      </div>
    </div>
  );
};

export default PaymentCenterInteractive;
