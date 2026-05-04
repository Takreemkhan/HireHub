'use client';

import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown, ArrowRight, Info, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/common/Header';
import FooterSection from '@/app/homepage/components/FooterSection';
import { useGetClientMembershipPlan } from '../hook/useProfile';

type PlanKey = 'free' | 'plus' | 'premium';

declare global { interface Window { Razorpay: any; } }

export default function ClientMembershipPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: membershipData, isLoading: plansLoading } = useGetClientMembershipPlan();
  const freelancerPlans = membershipData?.plans || [];

  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currentPlan, setCurrentPlan] = useState<PlanKey>('free');
  const [loading, setLoading] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [razorpayReady, setRazorpayReady] = useState(false);

  // ── Load Razorpay SDK ──────────────────────────────────────────────────────
  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) { setRazorpayReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => setRazorpayReady(true);
    document.body.appendChild(s);
  }, []);

  // ── Fetch current subscription status ─────────────────────────────────────
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/client/membership/status');
        const data = await res.json();
        console.log("client membership status", data);
        if (data.success) {
          setCurrentPlan(data.subscription.plan);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatus();
  }, []);
  // ── Resolve plan values from DB by planKey (safe, order-independent) ───────
  const findPlan = (key: string, fb: any) =>
    freelancerPlans.find((x: any) => x.planKey === key) || fb;

  const freePlan = findPlan('free', { bitsTotal: 15, amountINR: 0, label: 'Free' });
  const plusPlan = findPlan('plus', { bitsTotal: 30, amountINR: 1999, label: 'Plus' });
  const premPlan = findPlan('premium', { bitsTotal: 50, amountINR: 4999, label: 'Premium' });

  const PLAN_CONFIG = {
    free: {
      name: freePlan.label,
      tagline: 'Get started with essential features',
      priceMonthly: 0,
      priceYearly: 0,
      bits: freePlan.bitsTotal,
      popular: false,
      icon: Star,
      colorGradient: 'from-gray-500 to-gray-600',
      connectFee: '5% service fee on Direct Contracts',
      features: [
        `${freePlan.bitsTotal} Bids per month`,
        'Bid on available projects',
        'Basic profile visibility',
        'Email support',
        'Standard payment protection',
      ],
      cta: 'Select Free Plan',
      planKey: 'free' as PlanKey,
    },
    plus: {
      name: plusPlan.label,
      tagline: 'Win more work with competitive tools',
      priceMonthly: plusPlan.amountINR,
      priceYearly: Math.round(plusPlan.amountINR * 12 * 0.8),
      bits: plusPlan.bitsTotal,
      popular: true,
      icon: Zap,
      colorGradient: 'from-orange-500 to-red-500',
      connectFee: '0% service fee on Direct Contracts',
      features: [
        'Everything in Free, plus:',
        `${plusPlan.bitsTotal} Bids per month`,
        'Personalized job alerts',
        'Proposal insights',
        'Custom profile URL',
        'Always-active profile',
        'Private earnings setting',
      ],
      cta: 'Upgrade to Plus',
      planKey: 'plus' as PlanKey,
    },
    premium: {
      name: premPlan.label,
      tagline: 'Maximize your freelancing potential',
      priceMonthly: premPlan.amountINR,
      priceYearly: Math.round(premPlan.amountINR * 12 * 0.8),
      bits: premPlan.bitsTotal,
      popular: false,
      icon: Crown,
      colorGradient: 'from-purple-500 to-indigo-600',
      connectFee: '0% service fee on Direct Contracts',
      features: [
        'Everything in Plus, plus:',
        `${premPlan.bitsTotal} Bids per month`,
        'Priority customer support',
        'Featured profile placement',
        'Advanced analytics dashboard',
        'Exclusive job opportunities',
        'Portfolio showcase priority',
        'Dedicated account manager',
      ],
      cta: 'Upgrade to Premium',
      planKey: 'premium' as PlanKey,
    },
  };

  // ── Sync localStorage (same keys used by OverviewSection) ─────────────────
  const syncLocalStorage = (planLabel: string, subscriptionId: string, bitsTotal: number, bitsRemaining: number) => {
    localStorage.setItem('freelancerMembershipPlan', planLabel);
    localStorage.setItem('freelancerSubscriptionId', subscriptionId);
    localStorage.setItem('freelancerBitsTotal', String(bitsTotal));
    localStorage.setItem('freelancerBitsRemaining', String(bitsRemaining));
  };

  // ── Free plan handler ──────────────────────────────────────────────────────
  const handleSelectFree = async () => {
    setLoading('free');
    try {
      const res = await fetch('/api/client/membership/status', { method: 'POST' });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      const sub = data.subscription;
      syncLocalStorage(sub.planLabel, sub.subscriptionId, sub.bitsTotal, sub.bitsRemaining);
      setCurrentPlan('free');
      alert(`Free plan activated! You have ${sub.bitsTotal} Bids to start bidding.`);
      router.push('/client-dashboard');
    } catch (err: any) {
      alert(err.message || 'Something went wrong.');
    } finally { setLoading(null); }
  };

  // ── Paid plan handler ──────────────────────────────────────────────────────
  const handlePaidPlan = async (planKey: PlanKey) => {
    if (!razorpayReady) { alert('Payment system is loading, please wait.'); return; }
    setLoading(planKey);
    try {
      const orderRes = await fetch('/api/client/membership/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      const planCfg = PLAN_CONFIG[planKey];

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: "9000",
        currency: orderData.currency,
        name: 'FreelanceHub',
        description: `${planCfg.name} Membership – ${planCfg.bits} Bids/month`,
        order_id: orderData.orderId,
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: { color: '#5335ffff' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/client/membership/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planKey,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.message);
            const sub = verifyData.subscription;
            syncLocalStorage(sub.planLabel, sub.subscriptionId, sub.bitsTotal, sub.bitsRemaining);
            setCurrentPlan(planKey);
            setLoading(null);
            alert(`Successfully upgraded to ${sub.planLabel}! You now have ${sub.bitsTotal} Bids.`);
            router.push('/client-dashboard');
          } catch (err: any) {
            alert(err.message || 'Verification failed.');
            setLoading(null);
          }
        },
        modal: { ondismiss: () => setLoading(null) },
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Payment failed. Please try again.');
      setLoading(null);
    }
  };

  const handleSelectPlan = (planKey: PlanKey) => {
    if (planKey === currentPlan) return;
    if (planKey === 'free') return handleSelectFree();
    return handlePaidPlan(planKey);
  };

  if (statusLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const planList = Object.values(PLAN_CONFIG);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-background mt-12">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold font-display text-brand-text-primary mb-4">
                Membership Plans
              </h1>
              <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto">
                Choose your plan. Each plan gives you Bids to bid on jobs — 1 Bid = 1 proposal.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mt-8">
              <div className="bg-muted p-1 rounded-full inline-flex">
                {['monthly', 'yearly'].map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-6 py-2 rounded-full font-medium transition-all capitalize relative ${billingCycle === cycle
                      ? 'bg-card text-accent shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {cycle}
                    {cycle === 'yearly' && (
                      <span className="absolute -top-2 -right-2 bg-success text-success-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                        Save 20%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bits info banner ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl">🪙</span>
            <p className="text-sm text-amber-800">
              <strong>How Bids work:</strong>{' '}
              Each proposal you submit costs 1 Bid.
              Free = {freePlan.bitsTotal} Bids &bull; Plus = {plusPlan.bitsTotal} Bids &bull; Premium = {premPlan.bitsTotal} Bids per month.
              When Bids run out, upgrade to keep bidding.
            </p>
          </div>
        </div>

        {/* ── Plan Cards ───────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {planList.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = currentPlan === plan.planKey;
              const isPlanLoading = loading === plan.planKey;
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

              return (
                <div
                  key={plan.planKey}
                  className={`relative bg-card rounded-2xl shadow-brand hover:shadow-brand-lg transition-all duration-300 overflow-hidden border ${plan.popular && !isCurrent
                    ? 'ring-2 ring-accent transform md:scale-105'
                    : 'border-border'
                    } ${isCurrent ? 'ring-2 ring-green-400' : ''}`}
                >
                  {/* Badges */}
                  {isCurrent && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-green-500 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                        ✓ CURRENT
                      </div>
                    </div>
                  )}
                  {plan.popular && !isCurrent && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-bl-lg font-semibold text-sm">
                        POPULAR
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Name */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`bg-gradient-to-r ${plan.colorGradient} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold font-display text-brand-text-primary">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-brand-text-secondary">{plan.tagline}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        {price === 0 ? (
                          <span className="text-5xl font-bold font-display text-brand-text-primary">Free</span>
                        ) : (
                          <>
                            <span className="text-5xl font-bold font-display text-brand-text-primary">
                              ₹{price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-brand-text-secondary ml-2">
                              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          </>
                        )}
                      </div>
                      {billingCycle === 'yearly' && price > 0 && (
                        <p className="text-sm text-success mt-1 font-semibold">
                          Save ₹{(plan.priceMonthly * 12 - plan.priceYearly).toLocaleString('en-IN')}/year
                        </p>
                      )}

                      {/* Bits badge */}
                      <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold px-3 py-2 rounded-lg">
                        🪙 {plan.bits} Bids / month
                      </div>

                      {/* Service fee */}
                      <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm font-semibold text-orange-700">{plan.connectFee}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <p className="font-semibold text-brand-text-primary mb-4">
                        {plan.planKey === 'free' ? 'Includes:' : 'Everything included:'}
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="w-5 h-5 text-success mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-brand-text-secondary text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handleSelectPlan(plan.planKey)}
                      disabled={isCurrent || !!loading}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${isCurrent
                        ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
                        : plan.planKey === 'plus'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg'
                          : plan.planKey === 'premium'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg'
                            : 'bg-brand-charcoal text-white hover:opacity-90'
                        }`}
                    >
                      {isPlanLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isCurrent ? (
                        <><Check className="w-5 h-5" /> Current Plan</>
                      ) : (
                        <>{plan.cta} <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <div className="mt-20 bg-card rounded-2xl p-8 shadow-brand border border-border">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-display text-brand-text-primary mb-2">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                { q: 'What are Bids?', a: 'Bids are your bidding currency. Each proposal submission costs 1 Bid. Your Bids reset every month based on your plan.' },
                { q: 'What happens when Bids run out?', a: "You won't be able to submit new proposals. Upgrade your plan to get more Bids. Existing proposals are unaffected." },
                { q: 'How does Razorpay billing work?', a: 'Payments are processed securely via Razorpay. Monthly plans bill every month, yearly plans save 20% and bill annually.' },
                { q: 'Can I cancel anytime?', a: 'Yes. You retain your Bids and plan access until the end of your billing period. No hidden fees.' },
              ].map((faq, i) => (
                <div key={i} className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-brand-text-primary mb-2 flex items-start gap-2">
                    <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-brand-text-secondary ml-7 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Trusted by over 25,000+ freelancers worldwide</p>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}