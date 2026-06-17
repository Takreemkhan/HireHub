'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, Loader2, CheckCircle, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/common/Header';
import FooterSection from '@/app/homepage/components/FooterSection';

declare global {
  interface Window { Razorpay: any; }
}

export default function FreelancerMembershipPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bidsRemaining, setBidsRemaining] = useState<number | null>(null);
  const [bidsTotal, setBidsTotal] = useState<number | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic rates from database
  const [monthlyAmount, setMonthlyAmount] = useState<number>(25);
  const [monthlyBids, setMonthlyBids] = useState<number>(30);
  const [exchangeRate, setExchangeRate] = useState<number>(83);
  const [customBidsCount, setCustomBidsCount] = useState<number>(30);

  // Load Razorpay SDK
  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) { setRazorpayReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
  }, []);

  // Fetch current bids balance and catalog details
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
          setMonthlyAmount(data.monthlyAmount ?? 25);
          setMonthlyBids(data.monthlyBids ?? 30);
          setExchangeRate(data.exchangeRate ?? 83);
        }
      } catch (_) { }
      finally { setCatalogLoading(false); }
    };
    fetchBids();
    fetchCatalog();
  }, [successMsg]);

  const costPerBidUSD = monthlyAmount / monthlyBids;
  const calculatedUSD = costPerBidUSD * customBidsCount;
  const calculatedINR = Math.round(calculatedUSD * exchangeRate);

  const handleBuyCustomBids = async () => {
    if (!razorpayReady) { setErrorMsg('Payment system is loading, please try again.'); return; }
    if (customBidsCount <= 0 || isNaN(customBidsCount)) {
      setErrorMsg('Please enter a valid number of bids (minimum 1).');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Create order
      const orderRes = await fetch('/api/freelancer/membership/create-order', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidsCount: customBidsCount }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      // Open Razorpay
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FreelanceHub',
        description: `Purchase ${customBidsCount} Custom Bids`,
        order_id: orderData.orderId,
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: { color: '#FF6B35' },
        modal: { ondismiss: () => setLoading(false) },
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
                bidsCount: customBidsCount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.message);

            // Update localStorage for other components
            const newTotal = verifyData.bidsTotal ?? verifyData.subscription?.bitsTotal ?? 0;
            const newRemaining = verifyData.bidsRemaining ?? verifyData.subscription?.bitsRemaining ?? 0;
            localStorage.setItem('freelancerBitsTotal', String(newTotal));
            localStorage.setItem('freelancerBitsRemaining', String(newRemaining));

            setSuccessMsg(`🎉 ${customBidsCount} Bids added successfully! Your new balance: ${newRemaining} Bids`);
            setBidsRemaining(newRemaining);
            setBidsTotal(newTotal);
          } catch (e: any) {
            setErrorMsg(e.message || 'Payment verification failed.');
          } finally {
            setLoading(false);
          }
        },
      });
      rzp.open();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to start payment.');
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FAFBFC] py-16 px-4 mt-12">
        <div className="max-w-4xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF6B35] mb-4 shadow-md transform hover:scale-105 transition-transform duration-200">
              <span className="text-2xl text-white">🪙</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[#1B365D] mb-2 tracking-tight">Buy Custom Bids</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Choose exactly how many bids you want to purchase. Get instant balance updates, valid forever.
            </p>
          </div>

          {/* Current Balance Card */}
          <div className="mb-8 p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FF6B35]/10 rounded-xl">
                <span className="text-2xl">🪙</span>
              </div>
              <div>
                <span className="block font-semibold text-lg text-[#1A1D23]">Your Current Bids Balance</span>
                <span className="text-xs text-gray-400">1 Bid = 1 proposal submission · Bids never expire</span>
              </div>
            </div>
            <div className="text-right bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-xl">
              <span className="text-3xl font-extrabold text-[#1B365D]">
                {bidsRemaining !== null ? bidsRemaining : '—'}
                <span className="text-sm font-normal text-gray-400 ml-1.5">
                  remaining
                </span>
              </span>
            </div>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-sm text-green-800 animate-fadeIn">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
              <div>{successMsg}</div>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* Catalog / Calculator */}
          {catalogLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E2E8F0] rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35] mb-2" />
              <p className="text-gray-400 text-sm">Fetching custom rates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
              
              {/* Dynamic Calculator Controls */}
              <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#1A1D23]">Bid Calculator</h3>
                    <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                      <Info className="w-3 h-3 text-gray-500" />
                      Ref: {monthlyBids} Bids = ${monthlyAmount} USD
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Enter Quantity
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={customBidsCount || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCustomBidsCount(isNaN(val) ? 0 : Math.max(1, Math.min(10000, val)));
                        }}
                        className="w-full px-4 py-3 bg-[#FAFBFC] border border-[#E2E8F0] rounded-xl text-lg font-bold text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                        placeholder="Number of Bids"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <span className="text-sm font-semibold text-gray-400">Bids</span>
                      </div>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Adjust Slider
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="250"
                      step="5"
                      value={customBidsCount}
                      onChange={(e) => setCustomBidsCount(parseInt(e.target.value))}
                      className="w-full accent-[#FF6B35] h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>5 Bids</span>
                      <span>50 Bids</span>
                      <span>100 Bids</span>
                      <span>150 Bids</span>
                      <span>200 Bids</span>
                      <span>250+ Bids</span>
                    </div>
                  </div>

                  {/* Quick select buttons */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Quick Select
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[10, 30, 50, 100, 200, 500].map((bids) => (
                        <button
                          key={bids}
                          onClick={() => setCustomBidsCount(bids)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            customBidsCount === bids
                              ? 'bg-[#FF6B35] border-[#FF6B35] text-white shadow-sm'
                              : 'bg-white border-[#E2E8F0] text-[#1A1D23] hover:border-gray-300'
                          }`}
                        >
                          {bids} Bids
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="text-[#FF6B35]">●</span> Price updates automatically based on current exchange and unit rates.
                </div>
              </div>

              {/* Price Checkout Card */}
              <div className="lg:col-span-2 bg-[#1B365D] text-white border border-[#1B365D] rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                <div>
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#FF6B35]" />
                    Order Summary
                  </h3>

                  {/* Summary rows */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                      <span className="text-white/60">Bids Purchased</span>
                      <span className="font-semibold text-lg text-[#FF6B35]">{customBidsCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Unit Cost (USD)</span>
                      <span>${costPerBidUSD.toFixed(3)} / bid</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                      <span className="text-white/60">Subtotal (USD)</span>
                      <span>${calculatedUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Exchange Rate</span>
                      <span>1 USD = ₹{exchangeRate} INR</span>
                    </div>
                  </div>

                  {/* Total price section */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <span className="block text-xs text-white/50 uppercase tracking-wider mb-1">Total Amount</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-[#FF6B35]">₹{calculatedINR.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-white/60">INR</span>
                    </div>
                    <span className="text-[11px] text-white/40 block mt-1">
                      Includes dynamic currency conversions
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBuyCustomBids}
                  disabled={loading || customBidsCount <= 0}
                  className="w-full py-3.5 rounded-xl font-bold bg-[#FF6B35] hover:bg-[#e05621] text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      Buy {customBidsCount} Bids Now
                    </>
                  )}
                </button>
              </div>

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
                { step: '1', title: 'Select Quantity', desc: 'Choose exactly how many bids you want to purchase. No fixed plans.' },
                { step: '2', title: 'Apply to Jobs', desc: 'Each proposal submission uses 1 Bid from your balance.' },
                { step: '3', title: 'Bids Never Expire', desc: 'Your Bids stay in your wallet indefinitely. No recurring costs.' },
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