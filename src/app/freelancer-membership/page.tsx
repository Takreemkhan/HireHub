'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/common/Header';
import FooterSection from '@/app/homepage/components/FooterSection';

declare global {
  interface Window { Razorpay: any; }
}

// Static BID_PACKS removed - now fetched from /api/freelancer/membership/catalog
type BidPack = {
  packKey: string;
  bids: number;
  amountINR: number;
  label: string;
  tagline: string;
  popular: boolean;
  color: string;
  gradient: string;
};

export default function FreelancerMembershipPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bidsRemaining, setBidsRemaining] = useState<number | null>(null);
  const [bidsTotal, setBidsTotal] = useState<number | null>(null);
  const [bidPacks, setBidPacks] = useState<BidPack[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load Razorpay SDK
  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) { setRazorpayReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
  }, []);

  // Fetch current bids balance
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch('/api/freelancer/membership/status', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setBidsRemaining(data.bidsRemaining ?? data.subscription?.bitsRemaining ?? 0);
          setBidsTotal(data.bidsTotal ?? data.subscription?.bitsTotal ?? 10);
        }
      } catch (_) { }
    };
    const fetchCatalog = async () => {
      try {
        const res = await fetch('/api/freelancer/membership/catalog', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setBidPacks(data.bidPacks);
        }
      } catch (_) { }
      finally { setCatalogLoading(false); }
    };
    fetchBids();
    fetchCatalog();
  }, [successMsg]);

  const handleBuyPack = async (pack: BidPack) => {
    if (!razorpayReady) { setErrorMsg('Payment system is loading, please try again.'); return; }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(pack.packKey);

    try {
      // Create order
      const orderRes = await fetch('/api/freelancer/membership/create-order', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packKey: pack.packKey }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      // Open Razorpay
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FreelanceHub',
        description: `${pack.label} – Bid Pack`,
        order_id: orderData.orderId,
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: { color: pack.color },
        modal: { ondismiss: () => setLoading(null) },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/freelancer/membership/verify', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                packKey: pack.packKey,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.message);

            // Update localStorage for other components
            const newTotal = verifyData.bidsTotal ?? verifyData.subscription?.bitsTotal ?? 0;
            const newRemaining = verifyData.bidsRemaining ?? verifyData.subscription?.bitsRemaining ?? 0;
            localStorage.setItem('freelancerBitsTotal', String(newTotal));
            localStorage.setItem('freelancerBitsRemaining', String(newRemaining));

            setSuccessMsg(`🎉 ${pack.bids} Bids added successfully! Your new balance: ${newRemaining} Bids`);
            setBidsRemaining(newRemaining);
            setBidsTotal(newTotal);
          } catch (e: any) {
            setErrorMsg(e.message || 'Payment verification failed.');
          } finally {
            setLoading(null);
          }
        },
      });
      rzp.open();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to start payment.');
      setLoading(null);
    }
  };

  const bidsUsed = bidsTotal !== null && bidsRemaining !== null ? bidsTotal - bidsRemaining : 0;
  const bidsProgress = bidsTotal ? Math.min(100, Math.round((bidsUsed / bidsTotal) * 100)) : 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FAFBFC] py-16 px-4 mt-12">
        <div className="max-w-3xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF6B35] mb-4">
              <span className="text-2xl">🪙</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1B365D] mb-2">Buy Bids</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Each proposal you submit uses 1 Bid. Buy a pack, use them anytime — no expiry, no subscription.
            </p>
          </div>

          {/* Current Balance Card */}
          <div className="mb-8 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <span className="font-semibold text-[#1A1D23]">Your Bids Balance</span>
              </div>
              <span className="text-2xl font-bold text-[#1B365D]">
                {bidsRemaining !== null ? bidsRemaining : '—'}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  remaining
                </span>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              1 Bid = 1 proposal submission · Bids never expire
            </p>
          </div>

          {/* Success / Error */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-sm text-green-800">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Bid Pack Cards */}
          {catalogLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {bidPacks.map((pack) => (
                <div
                  key={pack.packKey}
                  className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all
                  ${pack.popular ? 'border-[#FF6B35] shadow-lg scale-[1.02]' : 'border-[#E2E8F0] hover:border-gray-300 hover:shadow-md'}`}
                >
                  {/* Top accent bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${pack.gradient}`} />

                  {pack.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FF6B35] text-white">
                        Best Value
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Icon + Label */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3"
                      style={{ background: `linear-gradient(135deg, ${pack.color}, ${pack.color}cc)` }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </div>

                    <p className="text-xl font-bold text-[#1A1D23] mb-1">
                      {pack.bids} Bids
                    </p>
                    <p className="text-xs text-gray-400 mb-4">{pack.tagline}</p>

                    <div className="mb-5">
                      <span className="text-3xl font-bold" style={{ color: pack.color }}>
                        ₹{pack.amountINR}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">one-time</span>
                      <p className="text-xs text-gray-400 mt-1">
                        ≈ ₹{Math.round(pack.amountINR / pack.bids)} per Bid
                      </p>
                    </div>

                    <button
                      onClick={() => handleBuyPack(pack)}
                      disabled={!!loading}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                      disabled:opacity-60 disabled:cursor-not-allowed
                      bg-gradient-to-r ${pack.gradient} hover:opacity-90`}
                    >
                      {loading === pack.packKey ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                        </span>
                      ) : (
                        `Buy ${pack.bids} Bids — ₹${pack.amountINR}`
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How it works */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-[#1A1D23] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF6B35]" />
              How Bids Work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Buy a Pack', desc: 'Choose how many bids you need. No recurring fees.' },
                { step: '2', title: 'Apply to Jobs', desc: 'Each proposal submission uses 1 Bid from your balance.' },
                { step: '3', title: 'Bids Never Expire', desc: 'Your Bids stay until you use them. No pressure.' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35] text-xs font-bold">
                    {item.step}
                  </div>
                  <p className="font-semibold text-sm text-[#1A1D23]">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mb-4">
            Secure payment via Razorpay · UPI, Cards, Net Banking, EMI accepted
          </p>

          <div className="text-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}