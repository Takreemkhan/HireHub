"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import { CheckCircle, Zap, Crown, Loader2, Receipt } from "lucide-react";

declare global { interface Window { Razorpay: any; } }

type PricingOption = { amountUSD: number; bids: number; billingCycle: string };
type Plan = {
  planKey: string; planType: string; label: string; description: string;
  isFree: boolean; features: string[]; accentColor: string; popular?: boolean;
  bonusBids?: number; monthlyBids?: number;
  pricing?: { monthly: PricingOption; yearly: PricingOption };
};
type Subscription = {
  isPlanActive: boolean; planKey: string; planLabel: string;
  billingCycle: string | null; bidsRemaining: number; bidsTotal: number;
  planExpiry: string | null;
};
type Invoice = {
  type: string; label: string; amountUSD?: number; bids?: number;
  bidsAdded?: number; orderId?: string; paymentId?: string;
  purchasedAt: string; planExpiry?: string;
};

export default function FreelancerPlansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]"><Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" /></div>}>
      <FreelancerPlansMain />
    </Suspense>
  );
}

function FreelancerPlansMain() {
  const router = useRouter();
  const { data: session } = useSession();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription>({
    isPlanActive: true, planKey: "basic", planLabel: "Basic",
    billingCycle: null, bidsRemaining: 0, bidsTotal: 0, planExpiry: null,
  });
  const [keyId, setKeyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) { setRazorpayReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [plansRes, invRes] = await Promise.all([
          fetch("/api/freelancer/plans", { credentials: "include" }),
          fetch("/api/freelancer/plans/invoice", { credentials: "include" }),
        ]);
        const plansData = await plansRes.json();
        const invData = await invRes.json();
        if (plansData.success) {
          // Only keep Basic and Plus — filter out any old legacy plans
          const filtered = (plansData.plans ?? []).filter(
            (p: Plan) => p.planKey === "basic" || p.planKey === "plus"
          );
          
          // Deduplicate in case the DB has multiple copies
          const uniquePlans = Array.from(new Map(filtered.map((p: any) => [p.planKey, p])).values()) as Plan[];
          
          setPlans(uniquePlans);
          setSubscription(plansData.subscription);
          setKeyId(plansData.keyId ?? "");
          if (plansData.subscription?.billingCycle) {
            setBillingCycle(plansData.subscription.billingCycle as "monthly" | "yearly");
          }
        }
        if (invData.success) setInvoices(invData.invoices ?? []);
      } catch (_) {}
      finally { setLoading(false); setInvoicesLoading(false); }
    };
    setInvoicesLoading(true);
    fetchAll();
  }, []);

  const isOnPlus = subscription.planKey === "plus" && subscription.isPlanActive &&
    !!subscription.planExpiry && new Date(subscription.planExpiry) > new Date();

  const handleUpgradePlus = async () => {
    if (!razorpayReady) { setError("Payment system loading, please try again."); return; }
    setError(""); setSuccess(""); setPaying(true);
    try {
      const orderRes = await fetch("/api/freelancer/plans", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey: "plus", billingCycle }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      const plusPlan = plans.find(p => p.planKey === "plus");
      const pricing = plusPlan?.pricing?.[billingCycle];

      const rzp = new window.Razorpay({
        key: orderData.keyId || keyId,
        name: "FreelanceHub",
        description: `Plus Plan – ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: "INR",
        prefill: { name: session?.user?.name || "", email: session?.user?.email || "" },
        theme: { color: "#FF6B35" },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/freelancer/plans", {
              method: "PUT", credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planKey: "plus", billingCycle,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.message);
            setSubscription(verifyData.subscription);
            setSuccess(`🎉 Plus Plan activated! You now have ${verifyData.subscription.bidsTotal} bids.`);
            setTimeout(() => router.push("/freelancer-dashboard"), 1800);
          } catch (e: any) {
            setError(e.message || "Payment verification failed.");
          } finally { setPaying(false); }
        },
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || "Failed to start payment.");
      setPaying(false);
    }
  };

  const handleDownloadInvoice = async (inv: Invoice) => {
    const id = inv.orderId || inv.paymentId || String(Date.now());
    setDownloadingInvoice(id);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="padding: 40px; font-family: 'Inter', Helvetica, Arial, sans-serif; color: #1A1D23; width: 700px; background: #fff; box-sizing: border-box;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F1F5F9; padding-bottom: 20px; margin-bottom: 30px;">
            <div>
              <h1 style="margin: 0; color: #FF6B35; font-size: 28px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                FreelanceHub <span style="color: #1B365D;">Pro</span>
              </h1>
              <p style="margin: 8px 0 0; color: #64748B; font-size: 14px;">123 Freelance Ave, Tech City, 10001</p>
              <p style="margin: 4px 0 0; color: #64748B; font-size: 14px;">support@freelancehub.com</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 24px; color: #1E293B; text-transform: uppercase; letter-spacing: 2px;">Invoice</h2>
              <p style="margin: 8px 0 0; color: #64748B; font-size: 14px;">Date: <strong>${new Date(inv.purchasedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></p>
              <p style="margin: 4px 0 0; color: #64748B; font-size: 14px;">Invoice #: <strong>${inv.orderId || inv.paymentId || 'N/A'}</strong></p>
            </div>
          </div>

          <!-- Bill To -->
          <div style="margin-bottom: 40px;">
            <p style="margin: 0 0 8px; color: #94A3B8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Billed To</p>
            <p style="margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #0F172A;">${session?.user?.name || 'Customer'}</p>
            <p style="margin: 0; font-size: 14px; color: #64748B;">${session?.user?.email || ''}</p>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr>
                <th style="padding: 12px 16px; text-align: left; background-color: #F8FAFC; color: #475569; font-size: 13px; text-transform: uppercase; border-top: 1px solid #E2E8F0; border-bottom: 2px solid #E2E8F0;">Description</th>
                <th style="padding: 12px 16px; text-align: center; background-color: #F8FAFC; color: #475569; font-size: 13px; text-transform: uppercase; border-top: 1px solid #E2E8F0; border-bottom: 2px solid #E2E8F0;">Bids Allocated</th>
                <th style="padding: 12px 16px; text-align: right; background-color: #F8FAFC; color: #475569; font-size: 13px; text-transform: uppercase; border-top: 1px solid #E2E8F0; border-bottom: 2px solid #E2E8F0;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #E2E8F0; font-size: 15px; color: #1E293B;">
                  <div style="font-weight: 600;">${inv.label}</div>
                  ${inv.planExpiry ? '<div style="font-size: 13px; color: #64748B; margin-top: 4px;">Valid until: ' + new Date(inv.planExpiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + '</div>' : ''}
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #E2E8F0; font-size: 15px; color: #1E293B; text-align: center;">
                  ${inv.bids || inv.bidsAdded || '-'}
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #E2E8F0; font-size: 15px; color: #1E293B; text-align: right; font-weight: 600;">
                  ${inv.amountUSD != null ? '$' + inv.amountUSD.toFixed(2) : 'Free'}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Total -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; padding: 12px 16px; background-color: #F8FAFC; border-radius: 8px;">
                <span style="font-size: 16px; font-weight: 600; color: #1E293B;">Total</span>
                <span style="font-size: 20px; font-weight: 800; color: #FF6B35;">${inv.amountUSD != null ? '$' + inv.amountUSD.toFixed(2) : 'Free'}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #F1F5F9; padding-top: 30px; margin-top: 40px;">
            <p style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #1E293B;">Thank you for your business!</p>
            <p style="margin: 0; font-size: 13px; color: #94A3B8;">If you have any questions concerning this invoice, please contact support@freelancehub.com.</p>
          </div>
          
        </div>
      `;
      await html2pdf().set({ margin: 10, filename: `FreelanceHub_Invoice_${id}.pdf`, image: { type: "jpeg" as const, quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const } }).from(el).save();
    } catch (e) { console.error("PDF error", e); }
    finally { setDownloadingInvoice(null); }
  };

  if (loading) return (
    <><Header /><div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]"><Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" /></div></>
  );

  const expiryDate = subscription.planExpiry
    ? new Date(subscription.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const plusPlan = plans.find(p => p.planKey === "plus");
  const selectedPricing = plusPlan?.pricing?.[billingCycle];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FAFBFC] pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* ── Compact Page Header ─── */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1B365D] mb-1">Subscription Plans</h1>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              Choose a plan that fits your freelancing goals. Upgrade anytime.
            </p>
          </div>

          {/* ── Active Plus Banner ─── */}
          {isOnPlus && expiryDate && (
            <div className="mb-5 flex items-center gap-3 p-3.5 rounded-xl border border-green-200 bg-green-50 max-w-lg mx-auto">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Plus Plan is Active</p>
                <p className="text-xs text-green-600">
                  {subscription.bidsRemaining} bids remaining · Expires {expiryDate}
                </p>
              </div>
            </div>
          )}

          {/* ── Monthly / Yearly Toggle ─── */}
          {!isOnPlus && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${billingCycle === "monthly" ? "bg-white text-[#1B365D] shadow-sm" : "text-gray-500"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${billingCycle === "yearly" ? "bg-white text-[#1B365D] shadow-sm" : "text-gray-500"}`}
                >
                  Yearly <span className="text-[10px] text-green-600 font-bold ml-1">SAVE 17%</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Plan Cards — always exactly 2 ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {plans.map((plan) => {
              const isCurrentPlan =
                plan.planKey === "basic" ? !isOnPlus : isOnPlus;
              const accentColor = plan.accentColor || "#1B365D";
              const pricing = plan.pricing?.[billingCycle];

              return (
                <div
                  key={plan.planKey}
                  className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                    isCurrentPlan
                      ? "border-green-400 shadow-md"
                      : plan.planKey === "plus"
                      ? "border-[#FF6B35] shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Top accent bar */}
                  <div className="h-1.5" style={{ background: isCurrentPlan ? "#22c55e" : accentColor }} />

                  {/* Popular / Current badge */}
                  {(plan.popular || isCurrentPlan) && (
                    <div className="absolute top-4 right-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isCurrentPlan ? "bg-green-100 text-green-700" : "bg-[#FF6B35] text-white"}`}>
                        {isCurrentPlan ? "✓ Current Plan" : "Most Popular"}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Icon + Name */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
                        {plan.planKey === "plus" ? <Crown size={20} /> : <Zap size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1D23]">{plan.label} Plan</p>
                        <p className="text-xs text-gray-400">
                          {plan.isFree ? "Free forever" : billingCycle === "yearly" ? "Billed yearly" : "Billed monthly"}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      {plan.isFree ? (
                        <span className="text-3xl font-bold" style={{ color: accentColor }}>Free</span>
                      ) : pricing ? (
                        <>
                          <span className="text-3xl font-bold" style={{ color: accentColor }}>${pricing.amountUSD}</span>
                          <span className="text-xs text-gray-400 ml-1">/ {billingCycle === "yearly" ? "year" : "month"}</span>
                          {billingCycle === "yearly" && (
                            <p className="text-xs text-green-600 font-semibold mt-0.5">
                              ≈ ${Math.round(pricing.amountUSD / 12)}/month · Best value
                            </p>
                          )}
                        </>
                      ) : null}
                    </div>

                    {/* Bids highlight pill */}
                    <div className="mb-4 p-2.5 rounded-xl" style={{ backgroundColor: accentColor + "12" }}>
                      <p className="text-xs font-semibold" style={{ color: accentColor }}>
                        🪙 {plan.isFree
                          ? `${plan.bonusBids ?? 20} signup bonus + ${plan.monthlyBids ?? 10} bids/month`
                          : pricing
                          ? `${pricing.bids} bids / ${billingCycle === "yearly" ? "year" : "month"}`
                          : ""}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-5">
                      {(plan.features || []).map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: accentColor + "20" }}>
                            <svg className="w-2.5 h-2.5" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-600 leading-snug">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {isCurrentPlan ? (
                      <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-green-50 text-green-700 border border-green-200">
                        ✓ Your Current Plan
                      </div>
                    ) : plan.planKey === "plus" ? (
                      <button
                        onClick={handleUpgradePlus}
                        disabled={paying}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#e05520] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {paying
                          ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
                          : `Upgrade to Plus — $${selectedPricing?.amountUSD ?? ""} / ${billingCycle === "yearly" ? "yr" : "mo"}`}
                      </button>
                    ) : (
                      <div className="w-full py-2 rounded-xl text-sm font-semibold text-center bg-gray-50 text-gray-400 border border-gray-100">
                        Free — No payment needed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error / Success */}
          {error && <div className="max-w-lg mx-auto mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
          {success && <div className="max-w-lg mx-auto mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{success}</div>}

          {/* Dashboard CTA */}
          <div className="max-w-lg mx-auto mb-3">
            <button
              onClick={() => router.push("/freelancer-dashboard")}
              className="w-full py-3 rounded-xl font-semibold text-white bg-[#1B365D] hover:bg-[#102542] transition-colors"
            >
              Go to Dashboard →
            </button>
          </div>
          <div className="text-center mb-8">
            <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2">← Back</button>
          </div>

          {/* Payment History */}
          {(invoices.length > 0 || invoicesLoading) && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="w-4 h-4 text-[#FF6B35]" />
                <h2 className="font-bold text-[#1A1D23]">Payment History</h2>
              </div>
              {invoicesLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 text-[#FF6B35] animate-spin" /></div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv, i) => (
                    <div key={i} className="flex items-start justify-between p-4 bg-white rounded-xl border border-[#E2E8F0]">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${inv.type === "plus_plan" ? "bg-orange-50" : "bg-amber-50"}`}>
                          <span className="text-base">{inv.type === "plus_plan" ? "⭐" : "🪙"}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A1D23]">{inv.label}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(inv.purchasedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {inv.planExpiry && ` · Expires ${new Date(inv.planExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                          </p>
                          {inv.orderId && <p className="text-[10px] text-gray-300 font-mono mt-0.5">{inv.orderId}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {inv.amountUSD != null && <span className="text-sm font-bold text-[#1B365D]">${inv.amountUSD}</span>}
                        {inv.bidsAdded != null && <span className="text-sm font-bold text-[#FF6B35]">+{inv.bidsAdded} Bids</span>}
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          disabled={downloadingInvoice === (inv.orderId || inv.paymentId || "1")}
                          className="w-8 h-8 rounded-full border border-[#E2E8F0] text-[#6B7280] hover:text-[#1B365D] flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Download PDF"
                        >
                          {downloadingInvoice === (inv.orderId || inv.paymentId || "1")
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </>
  );
}