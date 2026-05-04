"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import { CheckCircle, Zap, Star, Crown, Loader2, Receipt } from "lucide-react";

declare global {
    interface Window { Razorpay: any; }
}

type PlanInfo = {
    planKey: string;
    label: string;
    amountINR: number;
    durationDays: number;
    maxVideos: number;
    description: string;
    features?: string[];
    accentColor?: string;
    popular?: boolean;
};

type Subscription = {
    isPlanActive: boolean;
    planKey: string | null;
    planLabel: string | null;
    maxVideos: number;
    planStartDate: string | null;
    planExpiry: string | null;
};

// Plan icons mapped locally by key
const PLAN_ICONS: Record<string, React.ReactNode> = {
    basic: <Zap size={22} />,
    pro: <Star size={22} />,
    elite: <Crown size={22} />,
};

export default function FreelancerPlansPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
                <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
            </div>
        }>
            <FreelancerPlansMain />
        </Suspense>
    );
}

function FreelancerPlansMain() {
    const router = useRouter();
    const { data: session } = useSession();

    const [plans, setPlans] = useState<PlanInfo[]>([]);
    const [subscription, setSubscription] = useState<Subscription>({
        isPlanActive: false, planKey: null, planLabel: null, maxVideos: 0,
        planStartDate: null, planExpiry: null,
    });
    const [keyId, setKeyId] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<string>("pro");
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");
    const [razorpayReady, setRazorpayReady] = useState(false);
    const [success, setSuccess] = useState("");
    const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

    // Proposal redirect context
    const searchParams = useSearchParams();
    const fromProposal = searchParams.get('from') === 'proposal';
    const proposalJobId = searchParams.get('jobId') ?? '';

    // Invoice history
    type Invoice = {
        type: string; label: string; amountINR?: number;
        bidsAdded?: number; orderId?: string; paymentId?: string;
        purchasedAt: string; planExpiry?: string;
    };
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesLoading, setInvoicesLoading] = useState(false);

    // Load Razorpay SDK
    useEffect(() => {
        if (document.querySelector('script[src*="razorpay"]')) { setRazorpayReady(true); return; }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayReady(true);
        document.body.appendChild(script);
    }, []);

    // Fetch all plans + subscription
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch("/api/freelancer/plans", { credentials: "include" });
                const data = await res.json();
                if (data.success) {
                    setPlans(data.plans);
                    setSubscription(data.subscription);
                    setKeyId(data.keyId);
                    if (data.subscription.isPlanActive && data.subscription.planKey) {
                        setSelectedPlan(data.subscription.planKey);
                    }
                }
            } catch (_) { }
            finally { setLoading(false); }
        };
        const fetchInvoices = async () => {
            setInvoicesLoading(true);
            try {
                const res = await fetch("/api/freelancer/plans/invoice", { credentials: "include" });
                const data = await res.json();
                if (data.success) setInvoices(data.invoices ?? []);
            } catch (_) { }
            finally { setInvoicesLoading(false); }
        };
        fetchPlans();
        fetchInvoices();
    }, []);

    const handleBuyPlan = async () => {
        if (!razorpayReady) { setError("Payment system loading, please try again."); return; }
        const plan = plans.find(p => p.planKey === selectedPlan);
        if (!plan) return;

        setError(""); setSuccess("");
        setPaying(true);

        try {
            // Step 1 — Create order
            const orderRes = await fetch("/api/freelancer/plans", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planKey: plan.planKey }),
            });
            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error(orderData.message);

            // Step 2 — Open Razorpay
            const rzp = new window.Razorpay({
                key: orderData.keyId || keyId,
                name: "FreelanceHub",
                description: plan.description,
                subscription_id: orderData.subscriptionId,
                prefill: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                },
                theme: { color: plan.accentColor ?? "#FF6B35" },
                modal: { ondismiss: () => setPaying(false) },
                handler: async (response: any) => {
                    try {
                        // Step 3 — Verify
                        const verifyRes = await fetch("/api/freelancer/plans", {
                            method: "PUT",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_subscription_id: response.razorpay_subscription_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planKey: plan.planKey,
                            }),
                        });
                        const verifyData = await verifyRes.json();
                        if (!verifyData.success) throw new Error(verifyData.message);

                        setSubscription(verifyData.subscription);
                        setSuccess(`🎉 ${plan.label} plan activated! You can now upload resume videos on proposals.`);
                        // Redirect based on context
                        setTimeout(() => {
                            if (fromProposal && proposalJobId) {
                                router.push(`/freelancer-dashboard?openProposal=${proposalJobId}`);
                            } else {
                                router.push('/freelancer-dashboard');
                            }
                        }, 1500);
                    } catch (e: any) {
                        setError(e.message || "Payment verification failed.");
                    } finally {
                        setPaying(false);
                    }
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
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.createElement("div");
            element.innerHTML = `
                <div style="padding: 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1D23; width: 800px; max-width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 30px;">
                        <div>
                            <h1 style="color: #FF6B35; margin: 0; font-size: 28px; font-weight: bold;">FreelanceHub Pro</h1>
                            <p style="color: #6B7280; font-size: 14px; margin-top: 5px;">Payment Receipt</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0; font-weight: bold; font-size: 16px;">Invoice / Receipt</p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: #6B7280;">Date: ${new Date(inv.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            ${inv.orderId ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #9CA3AF;">Order ID: ${inv.orderId}</p>` : ''}
                        </div>
                    </div>
                    <div style="margin-bottom: 40px;">
                        <h3 style="margin-bottom: 10px; font-size: 14px; color: #6B7280; text-transform: uppercase;">Billed To</h3>
                        <p style="margin: 0; font-size: 16px; font-weight: bold;">${session?.user?.name || 'Freelancer'}</p>
                        <p style="margin: 5px 0 0 0; font-size: 14px; color: #6B7280;">${session?.user?.email || 'User Account'}</p>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr style="background-color: #F7FAFC; border-bottom: 2px solid #E2E8F0;">
                                <th style="text-align: left; padding: 12px; font-size: 14px; color: #6B7280;">Description</th>
                                <th style="text-align: right; padding: 12px; font-size: 14px; color: #6B7280;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #E2E8F0;">
                                <td style="padding: 15px 12px; font-size: 16px; font-weight: 500;">
                                    ${inv.label}
                                    ${inv.bidsAdded ? `<div style="font-size: 13px; color: #FF6B35; margin-top: 4px;">+${inv.bidsAdded} Bids Added</div>` : ''}
                                    ${inv.planExpiry ? `<div style="font-size: 13px; color: #6B7280; margin-top: 4px;">Valid until ${new Date(inv.planExpiry).toLocaleDateString()}</div>` : ''}
                                </td>
                                <td style="padding: 15px 12px; text-align: right; font-size: 16px; font-weight: bold;">
                                    ${inv.amountINR ? `₹${inv.amountINR}.00` : '—'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 2px solid #E2E8F0; padding-top: 20px;">
                        <div>
                            <p style="font-size: 14px; color: #6B7280; margin: 0;">Paid electronically via Razorpay</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0; font-size: 14px; color: #6B7280; text-transform: uppercase;">Total Paid</p>
                            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1B365D;">${inv.amountINR ? `₹${inv.amountINR}.00` : '—'}</p>
                        </div>
                    </div>
                    <div style="margin-top: 60px; text-align: center; color: #9CA3AF; font-size: 12px; border-top: 1px dashed #E2E8F0; padding-top: 20px;">
                        <p>Thank you for using FreelanceHub Pro.</p>
                        <p>This is a computer generated document and does not require a physical signature.</p>
                    </div>
                </div>
            `;
            const opt = {
                margin: 10,
                filename: `FreelanceHub_Invoice_${id}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };
            await html2pdf().set(opt).from(element).save();
        } catch (e) {
            console.error('PDF generation failed', e);
        } finally {
            setDownloadingInvoice(null);
        }
    };

    const isActive = subscription.isPlanActive;
    const expiryDate = subscription.planExpiry
        ? new Date(subscription.planExpiry).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
        })
        : null;

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
                    <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#FAFBFC] py-16 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* ── Page Header ─────────────────────────────────────────────── */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FF6B35] mb-4">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-[#1B365D] mb-2">Resume Video Plans</h1>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Attach resume videos to your proposals and stand out from the competition.
                            More videos = more chances to impress clients.
                        </p>
                    </div>

                    {/* ── Active Plan Banner ───────────────────────────────────────── */}
                    {isActive && expiryDate && (
                        <div className="mb-8 flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50 max-w-xl mx-auto">
                            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-green-800">
                                    {subscription.planLabel} Plan is Active
                                </p>
                                <p className="text-xs text-green-600">
                                    {subscription.maxVideos} video{subscription.maxVideos !== 1 ? "s" : ""} per proposal · Expires {expiryDate}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Plan Cards Grid ──────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        {plans.map((plan) => {
                            const isCurrentActive = isActive && subscription.planKey === plan.planKey;
                            const isSelected = selectedPlan === plan.planKey;
                            const accentColor = plan.accentColor || "#1B365D";
                            const icon = PLAN_ICONS[plan.planKey] || <Zap size={22} />;
                            const features = plan.features || [];

                            // Badge mapping
                            let badge = null;
                            let badgeClass = "";
                            if (plan.planKey === 'pro') { badge = "Most Popular"; badgeClass = "bg-[#FF6B35] text-white"; }
                            if (plan.planKey === 'elite') { badge = "Best Value"; badgeClass = "bg-[#1B365D] text-white"; }

                            return (
                                <div
                                    key={plan.planKey}
                                    onClick={() => !isCurrentActive && setSelectedPlan(plan.planKey)}
                                    className={`relative bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${isCurrentActive
                                        ? "border-green-400 shadow-md"
                                        : isSelected
                                            ? "border-[#FF6B35] shadow-lg scale-[1.02]"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        } `}
                                >
                                    {/* Top gradient bar */}
                                    <div
                                        className="h-1.5"
                                        style={{ background: isCurrentActive ? "#22c55e" : accentColor }}
                                    />

                                    {/* Badge */}
                                    {(badge || isCurrentActive) && (
                                        <div className="absolute top-4 right-4">
                                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isCurrentActive ? "bg-green-100 text-green-700" : badgeClass
                                                } `}>
                                                {isCurrentActive ? "✓ Active" : badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-5">
                                        {/* Icon + Name */}
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                                style={{ backgroundColor: accentColor }}
                                            >
                                                {icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1A1D23]">{plan.label}</p>
                                                <p className="text-xs text-gray-400">{plan.durationDays}-day access</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-5">
                                            <span className="text-3xl font-bold" style={{ color: accentColor }}>
                                                ₹{plan.amountINR}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-1">/ month</span>
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-2.5">
                                            {features.map((f: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                                        style={{ backgroundColor: accentColor + "20" }}
                                                    >
                                                        <svg className="w-2.5 h-2.5" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs text-gray-600 leading-snug">{f}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Select indicator */}
                                        {!isCurrentActive && (
                                            <div className={`mt-5 w-full py-2 rounded-xl text-sm font-semibold text-center transition-colors ${isSelected
                                                ? "bg-[#FF6B35] text-white"
                                                : "bg-gray-100 text-gray-500"
                                                } `}>
                                                {isSelected ? "✓ Selected" : "Select Plan"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Error / Success ──────────────────────────────────────────── */}
                    {error && (
                        <div className="max-w-xl mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="max-w-xl mx-auto mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    {/* ── CTA Button ──────────────────────────────────────────────── */}
                    <div className="max-w-xl mx-auto">
                        {isActive ? (
                            <button
                                onClick={() => router.push("/freelancer-dashboard")}
                                className="w-full py-3.5 rounded-xl font-semibold text-white bg-[#1B365D] hover:bg-[#102542] transition-colors"
                            >
                                {fromProposal ? '← Back to Proposal' : 'Go to Dashboard →'}
                            </button>
                        ) : (
                            <button
                                onClick={handleBuyPlan}
                                disabled={paying || !selectedPlan}
                                className="w-full py-3.5 rounded-xl font-semibold text-white bg-[#FF6B35] hover:bg-[#e05520] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {paying ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Pay ₹{plans.find(p => p.planKey === selectedPlan)?.amountINR ?? ""} — {plans.find(p => p.planKey === selectedPlan)?.label ?? ""} Plan
                                    </>
                                )}
                            </button>
                        )}
                        {!isActive && (
                            <p className="text-center text-xs text-gray-400 mt-3">
                                Secure payment via Razorpay · UPI, Cards, Net Banking, EMI accepted
                            </p>
                        )}
                    </div>

                    {/* Back */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => router.back()}
                            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
                        >
                            ← Back
                        </button>
                    </div>

                    {/* ── Invoice History ─────────────────────────────── */}
                    {(invoices.length > 0 || invoicesLoading) && (
                        <div className="mt-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Receipt className="w-4 h-4 text-[#FF6B35]" />
                                <h2 className="font-bold text-[#1A1D23]">Payment History</h2>
                            </div>
                            {invoicesLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 text-[#FF6B35] animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {invoices.map((inv, i) => (
                                        <div key={i} className="flex items-start justify-between p-4 bg-white rounded-xl border border-[#E2E8F0]">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${inv.type === 'resume_video_plan' ? 'bg-orange-50' : 'bg-amber-50'
                                                    } `}>
                                                    <span className="text-base">
                                                        {inv.type === 'resume_video_plan' ? '🎬' : '🪙'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#1A1D23]">{inv.label}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(inv.purchasedAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                        {inv.planExpiry && ` · Expires ${new Date(inv.planExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} `}
                                                    </p>
                                                    {inv.orderId && <p className="text-[10px] text-gray-300 font-mono mt-0.5">{inv.orderId}</p>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {inv.amountINR != null && (
                                                    <span className="text-sm font-bold text-[#1B365D] whitespace-nowrap">₹{inv.amountINR}</span>
                                                )}
                                                {inv.bidsAdded != null && (
                                                    <span className="text-sm font-bold text-[#FF6B35] whitespace-nowrap">+{inv.bidsAdded} Bids</span>
                                                )}
                                                <button
                                                    onClick={() => handleDownloadInvoice(inv)}
                                                    disabled={downloadingInvoice === (inv.orderId || inv.paymentId || '1')}
                                                    className="w-8 h-8 rounded-full border border-[#E2E8F0] text-[#6B7280] hover:text-[#1B365D] hover:border-[#1B365D] flex items-center justify-center transition-colors disabled:opacity-50"
                                                    title="Download Invoice PDF"
                                                >
                                                    {downloadingInvoice === (inv.orderId || inv.paymentId || '1') ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    )}
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