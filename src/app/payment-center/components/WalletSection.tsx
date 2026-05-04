'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSession } from 'next-auth/react';
import Skeleton from '@/components/ui/Skeleton';

type WalletTab = 'balance' | 'add' | 'history';

interface Transaction {
    _id?: string;
    id?: string;
    type: 'credit' | 'debit';
    category?: string;
    description: string;
    amount: number;
    date?: string;
    createdAt?: string;
    status: 'completed' | 'pending' | 'failed' | 'pending_completion';
    icon?: string;
}

// Transactions fetched from API — no mock data

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

const ADD_METHODS = [
    { id: 'upi', label: 'UPI', icon: 'DevicePhoneMobileIcon', desc: 'PhonePe / GPay / Paytm', fee: '0%', time: 'Instant' },
    { id: 'netbank', label: 'Net Banking', icon: 'BuildingLibraryIcon', desc: 'All major banks', fee: '0%', time: 'Instant' },
    { id: 'card', label: 'Card', icon: 'CreditCardIcon', desc: 'Visa / Mastercard', fee: '1.5%', time: 'Instant' },
    { id: 'razorpay', label: 'Razorpay', icon: 'BoltIcon', desc: 'Secured by Razorpay', fee: '0%', time: 'Instant' },
];

const statusConfig = {
    completed: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completed' },
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
    failed: { color: 'text-red-500', bg: 'bg-red-50', label: 'Failed' },
    pending_completion: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
};


export default function WalletSection() {
    const { data: session } = useSession();
    const isFreelancer = session?.user?.role === 'freelancer';
    const [razorpayReady, setRazorpayReady] = useState(false);
    const [activeTab, setActiveTab] = useState<WalletTab>('balance');
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [selectedQuick, setSelectedQuick] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [txSummary, setTxSummary] = useState({ totalIn: 0, totalOut: 0, net: 0 });
    const [txLoading, setTxLoading] = useState(false);

    // Filter out pending transactions as requested
    const filteredTransactions = transactions.filter(tx =>
        tx.status !== 'pending' && tx.status !== 'pending_completion'
    );

    // ── Load Razorpay SDK (same as ClientMembershipPage) ─────────────────────
    useEffect(() => {
        if (document.querySelector('script[src*="razorpay"]')) { setRazorpayReady(true); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.async = true;
        s.onload = () => setRazorpayReady(true);
        document.body.appendChild(s);
    }, []);

    // ── Fetch wallet balance ───────────────────────────────────────────────
    const fetchBalance = async () => {
        try {
            setLoadingBalance(true);
            const res = await fetch('/api/wallet/status');
            const data = await res.json();

            if (data.success) setWalletBalance(data.wallet.balance ?? 0);
        } catch (e) { console.error('Wallet status error:', e); }
        finally { setLoadingBalance(false); }
    };

    // ── Fetch transactions ────────────────────────────────────────────────
    const fetchTransactions = async (type: 'all' | 'credit' | 'debit' = 'all') => {
        try {
            setTxLoading(true);
            const res = await fetch(`/api/wallet/transactions?type=${type}&limit=50&source=wallet`);
            const data = await res.json();
            if (data.success) {
                setTransactions(data.transactions);
                setTxSummary(data.summary);
            }
        } catch (e) { console.error('Wallet transactions error:', e); }
        finally { setTxLoading(false); }
    };

    const [stats, setStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    // ── Fetch stats ───────────────────────────────────────────────────────
    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const res = await fetch('/api/payment-center/stats');
            const data = await res.json();
            if (data.success) setStats(data.stats);
        } catch (e) { console.error('Fetch stats error:', e); }
        finally { setLoadingStats(false); }
    };

    useEffect(() => { fetchBalance(); fetchTransactions(); fetchStats(); }, []);
    useEffect(() => { if (activeTab === 'history') fetchTransactions(filter); }, [activeTab, filter]);

    const finalAmount = selectedQuick ?? (customAmount ? parseFloat(customAmount) : null);
    const method = ADD_METHODS.find(m => m.id === selectedMethod)!;
    const fee = finalAmount && method ? (method.fee === '0%' ? 0 : finalAmount * 0.015) : 0;
    const total = finalAmount ? finalAmount + fee : 0;

    const handleAddMoney = async () => {
        if (!finalAmount || finalAmount < 1) return;
        if (!razorpayReady) { alert('Payment system is loading, please wait.'); return; }
        setIsProcessing(true);
        try {
            // 1. Create Razorpay order
            const orderRes = await fetch('/api/wallet/create-order', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalAmount }),
            });
            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error(orderData.message);

            // 2. Open Razorpay checkout
            const rzpOptions: any = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: 'INR',
                order_id: orderData.orderId,
                name: 'FreelanceHub Pro',
                description: 'Wallet Top-up',
                handler: async (response: any) => {
                    // 3. Verify payment
                    const verifyRes = await fetch('/api/wallet/verify', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: finalAmount,
                            paymentMethod: selectedMethod,
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        setWalletBalance(verifyData.wallet.balance);
                        setSuccessMsg(`₹${finalAmount.toLocaleString('en-IN')} added to your wallet!`);
                        setCustomAmount('');
                        setSelectedQuick(null);

                        // Switch tab immediately so user sees the "Balance" screen
                        setActiveTab('balance');

                        // Force a full page reload after 1 second to sync all dashboard stats (Overview, etc.)
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                },
                prefill: { name: session?.user?.name || '', email: session?.user?.email || '' },
                theme: { color: '#1B365D' },
                modal: { ondismiss: () => setIsProcessing(false) },
            };

            // Force selected method if not 'razorpay' (default)
            if (selectedMethod !== 'razorpay') {
                const methodMap: any = {
                    upi: 'upi',
                    card: 'card',
                    netbank: 'netbanking'
                };
                const rzpMethod = methodMap[selectedMethod];
                if (rzpMethod) {
                    rzpOptions.config = {
                        display: {
                            blocks: {
                                [rzpMethod]: {
                                    name: method.label,
                                    instruments: [{ method: rzpMethod }]
                                }
                            },
                            sequence: [`block.${rzpMethod}`],
                            preferences: { show_default_blocks: false }
                        }
                    };
                }
            }

            const rzp = new (window as any).Razorpay(rzpOptions);
            rzp.open();
        } catch (e: any) {
            console.error('Add money error:', e);
        } finally {
            setIsProcessing(false);
        }
    };

    // Map API tx to icon
    const getTxIcon = (tx: Transaction) => {
        if (tx.category === 'topup') return 'WalletIcon';
        if (tx.category === 'withdrawal') return 'BuildingLibraryIcon';
        if (tx.category === 'escrow_deposit') return 'LockClosedIcon';
        if (tx.category === 'milestone_release') return 'CheckBadgeIcon';
        if (tx.category === 'platform_fee') return 'ReceiptPercentIcon';
        if (tx.category === 'escrow_refund') return 'ArrowPathIcon';
        return 'BriefcaseIcon';
    };

    // Get category label for display
    const getCategoryLabel = (tx: Transaction) => {
        if ((tx as any).category === 'escrow_deposit') return 'Funds Secured';
        if ((tx as any).category === 'milestone_release') return 'Payment Released';
        if ((tx as any).category === 'platform_fee') return 'Platform Fee';
        if ((tx as any).category === 'escrow_refund') return 'Refund';
        if ((tx as any).category === 'topup') return 'Top-up';
        if ((tx as any).category === 'withdrawal') return 'Withdrawal';
        return '';
    };

    const filteredTx = transactions.filter(t => filter === 'all' || t.type === filter);

    const tabs: { id: WalletTab; label: string; icon: string }[] = [
        { id: 'balance', label: 'Wallet Balance', icon: 'WalletIcon' },
        { id: 'add', label: 'Add Money', icon: 'PlusCircleIcon' },
        { id: 'history', label: 'History', icon: 'ClockIcon' },
    ];

    return (
        <div className="space-y-6">

            {/* ── Tab bar ─────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 bg-[#F7FAFC] p-1 rounded-xl border border-[#E2E8F0] w-fit">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === t.id
                            ? 'bg-white text-[#1B365D] shadow-sm border border-[#E2E8F0]'
                            : 'text-[#6B7280] hover:text-[#1A1D23]'
                            }`}
                    >
                        <Icon name={t.icon as any} size={16} />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════════════════════
          TAB 1 — BALANCE
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'balance' && (
                <div className="space-y-6">

                    {/* Balance card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B365D] via-[#1e4080] to-[#2563EB] text-white p-8 shadow-xl">
                        {/* decorative circles */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
                        <div className="absolute -bottom-12 -left-6 w-40 h-40 rounded-full bg-white/5" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <Icon name="WalletIcon" size={16} />
                                </div>
                                <span className="text-white/80 text-sm font-medium">Total Wallet Balance</span>
                            </div>

                            {loadingBalance ? (
                                <div className="space-y-2 mb-8">
                                    <Skeleton className="h-12 w-48 bg-white/10" />
                                    <Skeleton className="h-4 w-64 bg-white/10" />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-5xl font-bold mb-1 tracking-tight">
                                        ₹{walletBalance.toLocaleString('en-IN')}
                                    </h2>
                                    <p className="text-white/60 text-sm mb-8">Available for withdrawal or project payments</p>
                                </>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {loadingBalance || loadingStats ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                            <Skeleton className="h-3 w-16 bg-white/10 mb-2" />
                                            <Skeleton className="h-5 w-24 bg-white/10" />
                                        </div>
                                    ))
                                ) : (
                                    [
                                        { label: isFreelancer ? 'This Month' : 'Spending (Month)', value: `₹${(isFreelancer ? stats?.thisMonthEarnings : stats?.thisMonthSpent || 0).toLocaleString('en-IN')}`, icon: 'ArrowTrendingUpIcon' },
                                        { label: isFreelancer ? 'Total Earned' : 'Total Added', value: `₹${(isFreelancer ? (stats?.totalEarnings || stats?.totalAdded) : stats?.totalAdded || 0).toLocaleString('en-IN')}`, icon: 'BanknotesIcon' },
                                        { label: 'Total Spent', value: `₹${(stats?.totalSpent || 0).toLocaleString('en-IN')}`, icon: 'ShoppingCartIcon' },
                                    ].map(s => (
                                        <div key={s.label} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Icon name={s.icon as any} size={13} className="text-white/70" />
                                                <span className="text-white/70 text-xs">{s.label}</span>
                                            </div>
                                            <p className="text-white font-bold text-base">{s.value}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveTab('add')}
                            className="flex items-center gap-3 p-5 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#1B365D] hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Icon name="PlusCircleIcon" size={22} className="text-[#1B365D]" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-[#1A1D23] text-sm">Add Money</p>
                                <p className="text-xs text-[#6B7280]">UPI · Card · Net Banking</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab('history')}
                            className="flex items-center gap-3 p-5 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#1B365D] hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                <Icon name="ClockIcon" size={22} className="text-[#FF6B35]" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-[#1A1D23] text-sm">Transaction History</p>
                                <p className="text-xs text-[#6B7280]">View all activity</p>
                            </div>
                        </button>
                    </div>

                    {/* Recent transactions preview */}
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                            <h3 className="font-bold text-[#1A1D23]">Recent Activity</h3>
                            <button onClick={() => setActiveTab('history')} className="text-xs text-[#FF6B35] font-semibold hover:underline">
                                View all →
                            </button>
                        </div>
                        <div className="divide-y divide-[#F7FAFC]">
                            {txLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Skeleton variant="circle" className="h-9 w-9 bg-slate-100" />
                                            <div className="space-y-1.5 flex-1">
                                                <Skeleton className="h-4 w-1/2 bg-slate-100" />
                                                <Skeleton className="h-3 w-1/4 bg-slate-100" />
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <Skeleton className="h-4 w-16 ml-auto bg-slate-100" />
                                            <Skeleton className="h-3 w-12 ml-auto rounded-full bg-slate-100" />
                                        </div>
                                    </div>
                                ))
                            ) : filteredTransactions.length === 0 ? (
                                <div className="px-6 py-12 text-center text-[#6B7280] text-sm">No transactions found</div>
                            ) : (
                                filteredTransactions.slice(0, 4).map(tx => {
                                    const txIcon = tx.icon || getTxIcon(tx);
                                    const txDate = tx.createdAt || tx.date || '';
                                    const txKey = tx._id || tx.id || txDate;
                                    const catLabel = getCategoryLabel(tx);
                                    return (
                                        <div key={txKey} className="flex items-center justify-between px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                                    <Icon name={txIcon as any} size={16} className={tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-[#1A1D23] leading-tight">{tx.description}</p>
                                                        {catLabel && (
                                                            <span className="text-[10px] px-1.5 py-0 rounded-full font-semibold bg-blue-50 text-blue-600 border border-blue-100">{catLabel}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-[#6B7280]">{txDate ? new Date(txDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                                </p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(statusConfig as any)[tx.status]?.bg || 'bg-gray-50'} ${(statusConfig as any)[tx.status]?.color || 'text-gray-600'}`}>
                                                    {(statusConfig as any)[tx.status]?.label || tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
          TAB 2 — ADD MONEY
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'add' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Left — form */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Amount selection */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
                            <h3 className="font-bold text-[#1A1D23] mb-4">Enter Amount</h3>

                            {/* Quick amounts */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {QUICK_AMOUNTS.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => { setSelectedQuick(amt === selectedQuick ? null : amt); setCustomAmount(''); }}
                                        className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${selectedQuick === amt
                                            ? 'border-[#1B365D] bg-[#1B365D] text-white'
                                            : 'border-[#E2E8F0] text-[#1A1D23] hover:border-[#1B365D]'
                                            }`}
                                    >
                                        ₹{amt.toLocaleString('en-IN')}
                                    </button>
                                ))}
                            </div>

                            {/* Custom input */}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-bold text-lg">₹</span>
                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={e => { setCustomAmount(e.target.value); setSelectedQuick(null); }}
                                    placeholder="Enter custom amount"
                                    min={1}
                                    className="w-full pl-9 pr-4 py-3.5 border-2 border-[#E2E8F0] rounded-xl text-[#1A1D23] font-semibold text-lg focus:outline-none focus:border-[#1B365D] transition-colors"
                                />
                            </div>
                            <p className="text-xs text-[#6B7280] mt-2">Minimum top-up: ₹1</p>
                        </div>

                        {/* Payment method */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
                            <h3 className="font-bold text-[#1A1D23] mb-4">Payment Method</h3>
                            <div className="space-y-3">
                                {ADD_METHODS.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setSelectedMethod(m.id)}
                                        className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-200 ${selectedMethod === m.id
                                            ? 'border-[#1B365D] bg-blue-50/50'
                                            : 'border-[#E2E8F0] hover:border-[#CBD5E0]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMethod === m.id ? 'bg-[#1B365D] text-white' : 'bg-[#F7FAFC] text-[#6B7280]'}`}>
                                                <Icon name={m.icon as any} size={18} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-[#1A1D23] text-sm">{m.label}</p>
                                                <p className="text-xs text-[#6B7280]">{m.desc}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-[#1A1D23]">{m.fee} fee</p>
                                            <p className="text-xs text-[#6B7280]">{m.time}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sticky top-24">
                            <h3 className="font-bold text-[#1A1D23] mb-5">Order Summary</h3>

                            {/* Current balance */}
                            <div className="flex items-center gap-3 p-4 bg-[#F7FAFC] rounded-xl mb-5">
                                <div className="w-10 h-10 rounded-xl bg-[#1B365D] flex items-center justify-center">
                                    <Icon name="WalletIcon" size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#6B7280]">Current Balance</p>
                                    <p className="font-bold text-[#1A1D23]">₹{walletBalance.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6B7280]">Amount to add</span>
                                    <span className="font-semibold text-[#1A1D23]">{finalAmount ? `₹${finalAmount.toLocaleString('en-IN')}` : '—'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6B7280]">Processing fee ({method?.fee})</span>
                                    <span className="font-semibold text-[#1A1D23]">{fee > 0 ? `₹${fee.toFixed(2)}` : 'Free'}</span>
                                </div>
                                <div className="border-t border-[#E2E8F0] pt-3 flex justify-between">
                                    <span className="font-bold text-[#1A1D23]">Total Charged</span>
                                    <span className="font-bold text-[#1B365D] text-lg">{total > 0 ? `₹${total.toFixed(2)}` : '—'}</span>
                                </div>
                                {finalAmount && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#6B7280]">New Balance</span>
                                        <span className="font-bold text-emerald-600">₹{(walletBalance + finalAmount).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Success message */}
                            {successMsg && (
                                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                                    <Icon name="CheckCircleIcon" size={18} className="text-emerald-600 flex-shrink-0" />
                                    <p className="text-sm text-emerald-700 font-medium">{successMsg}</p>
                                </div>
                            )}

                            <button
                                onClick={handleAddMoney}
                                disabled={!finalAmount || finalAmount < 1 || isProcessing}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1B365D] text-white rounded-xl font-bold hover:bg-[#152a4a] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Processing…
                                    </>
                                ) : (
                                    <>
                                        <Icon name="PlusCircleIcon" size={18} />
                                        {finalAmount ? `Add ₹${finalAmount.toLocaleString('en-IN')}` : 'Add Money'}
                                    </>
                                )}
                            </button>

                            <div className="mt-4 flex items-center gap-2 justify-center">
                                <Icon name="ShieldCheckIcon" size={14} className="text-[#6B7280]" />
                                <p className="text-xs text-[#6B7280]">256-bit SSL secured · Powered by Razorpay</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
          TAB 3 — HISTORY
      ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'history' && (
                <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">

                    {/* Header + filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-[#E2E8F0]">
                        <h3 className="font-bold text-[#1A1D23]">All Transactions</h3>
                        <div className="flex items-center gap-2 bg-[#F7FAFC] p-1 rounded-xl border border-[#E2E8F0]">
                            {(['all', 'credit', 'debit'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${filter === f
                                        ? 'bg-white text-[#1B365D] shadow-sm border border-[#E2E8F0]'
                                        : 'text-[#6B7280] hover:text-[#1A1D23]'
                                        }`}
                                >
                                    {f === 'all' ? 'All' : f === 'credit' ? '↑ Money In' : '↓ Money Out'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary chips */}
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-[#FAFBFC] border-b border-[#E2E8F0]">
                        {[
                            { label: 'Total In', value: `₹${txSummary.totalIn.toLocaleString('en-IN')}`, color: 'text-emerald-600' },
                            { label: 'Total Out', value: `₹${txSummary.totalOut.toLocaleString('en-IN')}`, color: 'text-red-500' },
                            { label: 'Net', value: `₹${txSummary.net.toLocaleString('en-IN')}`, color: 'text-[#1B365D]' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="text-xs text-[#6B7280] mb-0.5">{s.label}</p>
                                <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Transaction list */}
                    <div className="divide-y divide-[#F7FAFC]">
                        {txLoading ? (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Skeleton variant="circle" className="h-10 w-10 flex-shrink-0 bg-slate-100" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-1/3 bg-slate-100" />
                                            <Skeleton className="h-3 w-1/5 bg-slate-100" />
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1 ml-4">
                                        <Skeleton className="h-5 w-20 ml-auto bg-slate-100" />
                                        <Skeleton className="h-3 w-14 ml-auto rounded-full bg-slate-100" />
                                    </div>
                                </div>
                            ))
                        ) : filteredTransactions.length === 0 ? (
                            <div className="py-16 text-center">
                                <Icon name="ClockIcon" size={40} className="text-[#E2E8F0] mx-auto mb-3" />
                                <p className="text-[#6B7280]">No transactions found</p>
                            </div>
                        ) : (
                            filteredTransactions.map(tx => {
                                const txIcon = tx.icon || getTxIcon(tx);
                                const txDate = tx.createdAt || tx.date || '';
                                const txKey = tx._id || tx.id || txDate;
                                return (
                                    <div key={txKey} className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFBFC] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                                <Icon name={txIcon as any} size={18} className={tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1A1D23] text-sm">{tx.description}</p>
                                                <p className="text-xs text-[#6B7280]">
                                                    {txDate ? new Date(txDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(statusConfig as any)[tx.status]?.bg || 'bg-gray-50'} ${(statusConfig as any)[tx.status]?.color || 'text-gray-600'}`}>
                                                {(statusConfig as any)[tx.status]?.label || tx.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}