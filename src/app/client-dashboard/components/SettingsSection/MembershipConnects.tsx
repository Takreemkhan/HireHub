'use client';

import React, { useEffect, useState } from 'react';
import { FiZap, FiCheckCircle, FiSettings, FiLink } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type PlanKey = 'free' | 'business_plus' | 'enterprise';

interface Subscription {
  plan: PlanKey;
  planLabel: string;
  connectsTotal: number;
  connectsUsed: number;
  connectsRemaining: number;
  expiresAt?: string;
}

const PLAN_META: Record<PlanKey, { priceLabel: string; colorClass: string }> = {
  free: { priceLabel: '₹0/mo', colorClass: 'from-gray-500 to-gray-600' },
  business_plus: { priceLabel: '₹2,499/mo', colorClass: 'from-orange-500 to-red-500' },
  enterprise: { priceLabel: '₹6,999/mo', colorClass: 'from-purple-500 to-indigo-600' },
};

export default function MembershipConnects() {
  const router = useRouter();
  const [sub, setSub] = useState<Subscription>({
    plan: 'free', planLabel: 'Free',
    connectsTotal: 10, connectsUsed: 0, connectsRemaining: 10,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Instant display from localStorage (same keys as client-membership/page.tsx syncLS)
    const savedLabel = localStorage.getItem('clientMembershipPlan');
    const savedTotal = localStorage.getItem('clientConnectsTotal');
    const savedRemaining = localStorage.getItem('clientConnectsRemaining');

    if (savedLabel) {
      const planKey: PlanKey = savedLabel === 'Free' ? 'free'
        : savedLabel === 'Business Plus' ? 'business_plus' : 'enterprise';
      setSub({
        plan: planKey, planLabel: savedLabel,
        connectsTotal: Number(savedTotal) || 10,
        connectsUsed: 0,
        connectsRemaining: Number(savedRemaining) || Number(savedTotal) || 10,
      });
    }

    // Verify + sync with server
    fetch('/api/client/membership/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.subscription) {
          const s = data.subscription;
          localStorage.setItem('clientMembershipPlan', s.planLabel);
          localStorage.setItem('clientConnectsTotal', String(s.connectsTotal));
          localStorage.setItem('clientConnectsRemaining', String(s.connectsRemaining));
          setSub({
            plan: s.plan as PlanKey, planLabel: s.planLabel,
            connectsTotal: s.connectsTotal,
            connectsUsed: s.connectsUsed,
            connectsRemaining: s.connectsRemaining,
            expiresAt: s.expiresAt,
          });
        }
      })
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 bg-[#FAFBFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading membership details...</p>
        </div>
      </div>
    );
  }

  const meta = PLAN_META[sub.plan] || PLAN_META.free;
  const usedPct = sub.connectsTotal > 0
    ? Math.round(((sub.connectsTotal - sub.connectsRemaining) / sub.connectsTotal) * 100)
    : 0;

  return (
    <div className="p-8 bg-[#FAFBFC] min-h-screen">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">Membership & Billing</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your subscription and Connects</p>
          </div>
          <button onClick={() => router.push('/client-membership')}
            className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-colors border border-orange-500/20 flex items-center gap-2">
            <FiSettings /> Manage Plan
          </button>
        </div>

        {/* Current Plan Card */}
        <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 p-3">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wide">CURRENT PLAN</span>
          </div>
          <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1 mb-6">Membership plan</h3>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Plan badge */}
            <div className={`bg-gradient-to-br ${meta.colorClass} rounded-xl p-6 text-white min-w-[200px]`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-bold">{sub.planLabel}</h4>
                <FiZap className="text-white text-xl" />
              </div>
              <p className="text-lg font-semibold opacity-90">{meta.priceLabel}</p>
              {sub.expiresAt && (
                <p className="text-xs opacity-70 mt-2">
                  Renews {new Date(sub.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>

            {/* Connects widget */}
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FiLink className="text-blue-600" />
                <p className="text-sm font-semibold text-blue-800">Connects Balance</p>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-blue-900">{sub.connectsRemaining}</span>
                <span className="text-sm text-blue-600">/ {sub.connectsTotal} remaining</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.max(0, 100 - usedPct)}%` }} />
              </div>
              <p className="text-xs text-blue-600">{sub.connectsUsed} used · 1 Connect = 1 direct freelancer invitation</p>
              {sub.connectsRemaining <= 3 && sub.connectsRemaining > 0 && (
                <p className="text-xs text-orange-600 font-semibold mt-2">⚠ Running low on Connects!</p>
              )}
              {sub.connectsRemaining === 0 && (
                <p className="text-xs text-red-600 font-semibold mt-2">🚫 No Connects left — upgrade to keep inviting</p>
              )}
            </div>
          </div>

          <ul className="flex flex-wrap gap-3 mt-4">
            <li className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <FiCheckCircle className="text-green-500 flex-shrink-0" />
              Post jobs and hire top freelancers faster
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-600 font-medium">
              <FiCheckCircle className="text-green-500 flex-shrink-0" />
              {sub.connectsTotal} Connects per month
            </li>
          </ul>
        </section>

        {/* Upgrade prompt */}
        {sub.plan !== 'enterprise' && (
          <section className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {sub.plan === 'free' ? 'Upgrade to Business Plus or Enterprise' : 'Upgrade to Enterprise'}
                </h3>
                <p className="text-purple-100 text-sm">
                  {sub.plan === 'free'
                    ? 'Get 30–60 Connects, priority support, and advanced hiring tools'
                    : 'Unlock 60 Connects, dedicated manager, and enterprise features'}
                </p>
              </div>
              <button onClick={() => router.push('/client-membership')}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg whitespace-nowrap">
                View Plans
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}