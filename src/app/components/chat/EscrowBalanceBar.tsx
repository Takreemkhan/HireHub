'use client';

import React, { useState, useEffect } from 'react';

interface EscrowBalanceBarProps {
    jobId: string | null;
    isClient: boolean;
}

export default function EscrowBalanceBar({ jobId, isClient }: EscrowBalanceBarProps) {
    const [escrow, setEscrow] = useState<{ deposited: number; released: number; remaining: number; status: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositing, setDepositing] = useState(false);
    const [depositError, setDepositError] = useState('');
    const [depositSuccess, setDepositSuccess] = useState('');

    const fetchEscrow = async () => {
        if (!jobId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/jobs/${jobId}/escrow-status`);
            const data = await res.json();
            if (data.success) setEscrow(data.escrow);
        } catch (e) {
            console.error('Escrow status error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchEscrow();
    }, [jobId]);

    const handleDeposit = async () => {
        if (!jobId) return;
        setDepositing(true);
        setDepositError('');
        try {
            const res = await fetch(`/api/jobs/${jobId}/escrow-deposit`, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setDepositSuccess(data.message);
                await fetchEscrow();
                setTimeout(() => { setShowDepositModal(false); setDepositSuccess(''); }, 2000);
            } else {
                setDepositError(data.message);
            }
        } catch (e) {
            setDepositError('Network error. Please try again.');
        } finally {
            setDepositing(false);
        }
    };

    if (!jobId) return null;

    const fmtAmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    return (
        <>
            {/* Escrow bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#EBF5FB] border-b border-[#BFD7EA]">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1B6CA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs font-semibold text-[#1B6CA8]">Escrow balance</span>
                </div>

                {loading ? (
                    <div className="w-4 h-4 border-2 border-[#1B6CA8]/30 border-t-[#1B6CA8] rounded-full animate-spin" />
                ) : escrow ? (
                    <div className="flex items-center gap-5 text-xs">
                        <div className="text-right">
                            <p className="text-gray-400 font-medium">Deposited</p>
                            <p className="font-bold text-gray-800">{fmtAmt(escrow.deposited)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 font-medium">Released</p>
                            <p className="font-bold text-emerald-600">{fmtAmt(escrow.released)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 font-medium">{(escrow.remaining > 0) ? 'Held' : 'Completed'}</p>
                            <p className="font-bold text-[#1B6CA8]">{fmtAmt(escrow.remaining)}</p>
                        </div>
                    </div>
                ) : isClient ? (
                    <button
                        onClick={() => setShowDepositModal(true)}
                        className="text-xs px-3 py-1 bg-[#1B6CA8] text-white rounded-lg font-semibold hover:bg-[#165a91] transition-colors"
                    >
                        Deposit Escrow
                    </button>
                ) : (
                    <span className="text-xs text-gray-400">No escrow deposited yet</span>
                )}
            </div>

            {/* Deposit modal (client only) */}
            {showDepositModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="font-bold text-gray-900 mb-1">Deposit Escrow</h3>
                        <p className="text-xs text-gray-500 mb-4">This will deduct the full job budget from your wallet and hold it in escrow. Funds will be released to the freelancer as milestones are approved.</p>
                        {depositError && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{depositError}</p>}
                        {depositSuccess && <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 mb-3">{depositSuccess}</p>}
                        <div className="flex gap-3">
                            <button onClick={() => setShowDepositModal(false)} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
                            <button
                                onClick={handleDeposit}
                                disabled={depositing}
                                className="flex-1 py-2.5 bg-[#1B6CA8] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                            >
                                {depositing ? 'Processing…' : 'Confirm Deposit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
