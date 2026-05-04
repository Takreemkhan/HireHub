'use client';

import React, { useState, useEffect, useCallback } from 'react';
import JobCompletionBanner from './JobCompletionBanner';
import { getSocket } from '@/socket/socket';

interface Milestone {
    _id: string;
    title: string;
    description: string;
    amount: number;
    deadline?: string | null;
    orderIndex: number;
    status: 'proposed' | 'active' | 'submitted' | 'revision' | 'released' | 'locked';
    proposedBy?: 'freelancer' | 'client';
    rejectionReason?: string;
    revisionReason?: string;
    latestRequest?: {
        _id: string;
        description: string;
        attachments: { url: string; name: string; type: string }[];
        status: 'pending' | 'approved' | 'rejected';
        rejectionReason?: string;
    } | null;
}

interface MilestonePanelProps {
    jobId: string | null;
    chatId: string | null;
    userId: string;
    isClient: boolean;
    isJobAssigned: boolean | null;
    jobBudget?: number;
    jobCurrency?: string | null;
    otherUserName?: string;
}

const STATUS_CONFIG = {
    proposed: { label: 'Proposed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-400' },
    submitted: { label: 'Review', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
    revision: { label: 'Revision', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300' },
    released: { label: 'Released', color: 'text-emerald-700', bg: 'bg-white', border: 'border-emerald-200' },
    locked: { label: 'Locked', color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' },
};

export default function MilestonePanel({
    jobId,
    chatId,
    userId,
    isClient,
    isJobAssigned,
    jobBudget,
    jobCurrency,
    otherUserName,
}: MilestonePanelProps) {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [showProposeForm, setShowProposeForm] = useState(false);
    const [showReleaseModal, setShowReleaseModal] = useState<string | null>(null); // milestoneId
    const [showRevisionModal, setShowRevisionModal] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [isClientEditing, setIsClientEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

    const toggleMilestone = (id: string) => {
        setExpandedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
    };
    const [error, setError] = useState('');

    // Propose form state
    const [proposalItems, setProposalItems] = useState([
        { title: '', description: '', amount: '', deadline: '' },
    ]);

    // Release modal state
    const [releaseDesc, setReleaseDesc] = useState('');
    const [releaseAttachments, setReleaseAttachments] = useState<{ url: string; name: string; type: string }[]>([]);

    // Revision modal state
    const [revisionReason, setRevisionReason] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    const fetchMilestones = useCallback(async () => {
        if (!jobId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/milestones?jobId=${jobId}&_t=${Date.now()}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setMilestones(data.milestones);
        } catch (e) {
            console.error('Failed to fetch milestones', e);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        if (isJobAssigned) fetchMilestones();
    }, [isJobAssigned, fetchMilestones]);

    // Listen for WebSocket events to automatically refresh the panel
    useEffect(() => {
        if (!jobId || !chatId) return;

        const socket = getSocket();

        const handleNewNotification = (notification: any) => {
            if (
                notification.meta?.jobId === jobId ||
                notification.meta?.chatId === chatId
            ) {
                fetchMilestones();
            }
        };

        const handleMessage = (data: any) => {
            if (data.chatId === chatId) {
                fetchMilestones();
            }
        };

        socket.on('notification:new', handleNewNotification);
        socket.on('message:received', handleMessage);

        return () => {
            socket.off('notification:new', handleNewNotification);
            socket.off('message:received', handleMessage);
        };
    }, [jobId, chatId, fetchMilestones]);

    if (!isJobAssigned || !jobId) return null;

    const budgetTotal = proposalItems.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    const budgetMatches = jobBudget ? Math.abs(budgetTotal - jobBudget) < 0.01 : false;

    const pendingAction = milestones.filter(m => ['proposed', 'submitted'].includes(m.status)).length;
    const revisionCount = milestones.filter(m => m.status === 'revision').length;
    const badgeCount = isClient ? pendingAction : revisionCount;

    // Job is completed when all milestones are released
    const allReleased = milestones.length > 0 && milestones.every(m => m.status === 'released');



    /* ── Freelancer: Propose milestones ─────────────────── */
    const handlePropose = async () => {
        setError('');
        const clean = proposalItems.filter(i => i.title && i.amount);
        if (clean.length === 0) { setError('Add at least one milestone'); return; }
        if (jobBudget && !budgetMatches) { setError(`Total must equal ${currencySymbol}${jobBudget.toLocaleString('en-IN')}`); return; }
        setActionLoading(true);
        try {
            const res = await fetch('/api/milestones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId,
                    milestones: clean,
                    chatId,
                    proposedBy: isClient ? 'client' : 'freelancer'
                }),
            });
            const data = await res.json();
            if (data.success) {
                setShowProposeForm(false);
                setIsClientEditing(false);
                await fetchMilestones();
            } else {
                setError(data.message);
            }
        } catch (e) {
            setError('Network error');
        } finally {
            setActionLoading(false);
        }
    };

    /* ── Client: Approve all milestones ─────────────────── */
    const handleApproveAll = async () => {
        const first = milestones[0];
        if (!first) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/milestones/${first._id}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId }),
            });
            const data = await res.json();
            if (data.success) await fetchMilestones();
            else setError(data.message);
        } finally {
            setActionLoading(false);
        }
    };

    /* ── Client: Reject milestone proposal ──────────────── */
    const handleReject = async () => {
        const first = milestones[0];
        if (!first) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/milestones/${first._id}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: rejectReason, chatId }),
            });
            const data = await res.json();
            if (data.success) {
                setShowRejectModal(false);
                await fetchMilestones();
            } else setError(data.message);
        } finally {
            setActionLoading(false);
        }
    };

    /* ── Freelancer: Request release ─────────────────────── */
    const handleRequestRelease = async (milestoneId: string) => {
        if (!releaseDesc.trim()) { setError('Please describe your work'); return; }
        setActionLoading(true);
        try {
            const res = await fetch(`/api/milestones/${milestoneId}/request-release`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: releaseDesc, attachments: releaseAttachments, chatId }),
            });
            const data = await res.json();
            if (data.success) {
                setShowReleaseModal(null);
                setReleaseDesc('');
                await fetchMilestones();
            } else setError(data.message);
        } finally {
            setActionLoading(false);
        }
    };

    /* ── Client: Approve release payment ─────────────────── */
    const handleApproveRelease = async (milestoneId: string) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/milestones/${milestoneId}/approve-release`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId }),
            });
            const data = await res.json();
            if (data.success) await fetchMilestones();
            else setError(data.message);
        } finally {
            setActionLoading(false);
        }
    };

    /* ── Client: Request revision ─────────────────────────── */
    const handleRequestRevision = async (milestoneId: string) => {
        if (!revisionReason.trim()) { setError('Please explain the revision needed'); return; }
        setActionLoading(true);
        try {
            const res = await fetch(`/api/milestones/${milestoneId}/request-revision`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: revisionReason, chatId }),
            });
            const data = await res.json();
            if (data.success) {
                setShowRevisionModal(null);
                setRevisionReason('');
                await fetchMilestones();
            } else setError(data.message);
        } finally {
            setActionLoading(false);
        }
    };

    const currencySymbol = jobCurrency === 'USD' ? '$' : jobCurrency === 'GBP' ? '£' : jobCurrency === 'EUR' ? '€' : '₹';
    const fmtAmount = (n: number) => `${currencySymbol}${n.toLocaleString('en-IN')}`;

    /* ─────────────── RENDER ─────────────────────────────── */
    return (
        <div className="border-t border-gray-200 bg-[#FAFAF9] flex-shrink-0 flex flex-col" style={{ maxHeight: '50vh' }}>

            {/* ── Panel header ───────────────────────────────── */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">
                        Milestones {milestones.length > 0 && <span className="text-gray-500">· {milestones.length}</span>}
                    </span>
                    {badgeCount > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isClient ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                            {isClient && pendingAction > 0 ? `${pendingAction} review` : revisionCount > 0 ? 'revision' : ''}
                        </span>
                    )}
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>

            {!collapsed && (
                <div className="px-4 pb-4 space-y-3 overflow-y-auto flex-1 scrollbar-hide" style={{ overscrollBehavior: 'contain' }}>

                    {loading && (
                        <div className="py-2 space-y-3">
                            <div className="w-full h-24 bg-gray-200 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                            </div>
                            <div className="w-full h-24 bg-gray-200 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                            <button onClick={() => setError('')} className="ml-2 font-bold">×</button>
                        </div>
                    )}



                    {/* ── No milestones yet ─────────────────────── */}
                    {!loading && !allReleased && milestones.length === 0 && (
                        <>
                            {(!isClient || isClientEditing) ? (
                                /* Freelancer: Propose form trigger OR Client: Editing mode */
                                <>
                                    {!showProposeForm && !isClientEditing && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                                            <p className="text-blue-700 mb-3">
                                                Break the project into milestones. Total must equal {jobBudget ? fmtAmount(jobBudget) : 'the project budget'}. Client will review and approve before work begins.
                                            </p>
                                            <button
                                                onClick={() => setShowProposeForm(true)}
                                                className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors"
                                            >
                                                Propose Milestones
                                            </button>
                                        </div>
                                    )}
                                    {(showProposeForm || isClientEditing) && (
                                        <ProposeMilestonesForm
                                            items={proposalItems}
                                            setItems={setProposalItems}
                                            jobBudget={jobBudget}
                                            jobCurrency={jobCurrency}
                                            budgetTotal={budgetTotal}
                                            budgetMatches={budgetMatches}
                                            onSubmit={handlePropose}
                                            onCancel={() => { setShowProposeForm(false); setIsClientEditing(false); setEditingIndex(null); }}
                                            loading={actionLoading}
                                            isClient={isClient}
                                            editingIndex={editingIndex}
                                            setEditingIndex={setEditingIndex}
                                        />
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Waiting for freelancer to propose milestones…
                                </p>
                            )}
                        </>
                    )}

                    {/* ── Client editing mode (even if milestones exist) ── */}
                    {isClient && isClientEditing && milestones.length > 0 && (
                        <ProposeMilestonesForm
                            items={proposalItems}
                            setItems={setProposalItems}
                            jobBudget={jobBudget}
                            jobCurrency={jobCurrency}
                            budgetTotal={budgetTotal}
                            budgetMatches={budgetMatches}
                            onSubmit={handlePropose}
                            onCancel={() => { setShowProposeForm(false); setIsClientEditing(false); setEditingIndex(null); }}
                            loading={actionLoading}
                            isClient={isClient}
                            editingIndex={editingIndex}
                            setEditingIndex={setEditingIndex}
                        />
                    )}

                    {/* ── Milestone proposal (proposed state) ────────── */}
                    {!loading && !isClientEditing && milestones.length > 0 && milestones[0].status === 'proposed' && (
                        <>
                            {/* Notice banner for the reviewer */}
                            {!isClient && milestones[0].proposedBy === 'client' && (
                                <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm">
                                    <p className="font-bold text-amber-800 mb-0.5">📝 Client suggested changes!</p>
                                    <p className="text-amber-700">Review the updated milestone plan below and accept or modify it.</p>
                                </div>
                            )}
                            <MilestoneProposalCard
                                milestones={milestones}
                                otherUserName={otherUserName}
                                jobCurrency={jobCurrency}
                                onApproveAll={handleApproveAll}
                                onReject={() => setShowRejectModal(true)}
                                onEdit={(index) => {
                                    setProposalItems(milestones.map(m => ({
                                        title: m.title,
                                        description: m.description,
                                        amount: m.amount.toString(),
                                        deadline: m.deadline ? new Date(m.deadline).toISOString().split('T')[0] : ''
                                    })));
                                    if (isClient) {
                                        setIsClientEditing(true);
                                        setEditingIndex(typeof index === 'number' ? index : null);
                                    } else {
                                        setShowProposeForm(true);
                                        setEditingIndex(typeof index === 'number' ? index : null);
                                    }
                                }}
                                loading={actionLoading}
                                isClient={isClient}
                            />
                        </>
                    )}

                    {/* ── Active milestones list ────────────────────── */}
                    {!loading && milestones.length > 0 && milestones.some(m => !['proposed'].includes(m.status)) && (
                        <div className="space-y-2">
                            {milestones.map((m) => {
                                const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.locked;
                                const isLocked = m.status === 'locked';
                                const isActive = m.status === 'active';
                                const isSubmitted = m.status === 'submitted';
                                const isRevision = m.status === 'revision';
                                const isReleased = m.status === 'released';

                                return (
                                    <div
                                        key={m._id}
                                        onClick={() => toggleMilestone(m._id)}
                                        className={`rounded-xl border-2 p-3 transition-all ${cfg.border} ${cfg.bg} ${isLocked ? 'opacity-60' : ''} ${m.latestRequest ? 'cursor-pointer hover:shadow-md' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                {/* Index / icon */}
                                                {isReleased ? (
                                                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                ) : isLocked ? (
                                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4" />
                                                        </svg>
                                                    </div>
                                                ) : isRevision ? (
                                                    <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">!</div>
                                                ) : (
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${isActive ? 'bg-emerald-600 text-white' : isSubmitted ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'}`}>
                                                        {m.orderIndex}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-semibold truncate ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{m.title}</p>
                                                    <p className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {fmtAmount(m.amount)}
                                                        {isActive && m.deadline && ` · Active — deadline ${new Date(m.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`}
                                                        {isReleased && ' · Released'}
                                                        {isLocked && ' · Locked'}
                                                        {isRevision && ' · Revision needed'}
                                                        {isSubmitted && ' · Awaiting your approval'}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Status badge + actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isReleased ? 'bg-white border-emerald-500 text-emerald-700' : `${cfg.bg} ${cfg.color} border ${cfg.border}`}`}>
                                                    {cfg.label}
                                                </span>
                                                {/* Freelancer: Request release */}
                                                {!isClient && isActive && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setShowReleaseModal(m._id); }}
                                                        className="text-xs px-3 py-1 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-gray-500 transition-colors"
                                                    >
                                                        Request release
                                                    </button>
                                                )}
                                                {/* Freelancer: Resubmit after revision */}
                                                {!isClient && isRevision && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setShowReleaseModal(m._id); }}
                                                        className="text-xs px-3 py-1 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                                                    >
                                                        Resubmit
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Client: review card for submitted milestone / Everyone: historical view */}
                                        {((isClient && isSubmitted) || expandedMilestones[m._id]) && m.latestRequest && (
                                            <div className="mt-3 border-t border-amber-200 pt-3 space-y-2" onClick={e => e.stopPropagation()}>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-semibold text-gray-800">
                                                        {isReleased ? "Freelancer's completed submission:" : "Freelancer's submission:"}
                                                    </p>
                                                    {expandedMilestones[m._id] && <span className="text-[10px] text-gray-400">Click card again to collapse</span>}
                                                </div>
                                                <p className="text-xs text-gray-700 bg-white rounded-lg p-2 border border-gray-200">
                                                    "{m.latestRequest.description}"
                                                </p>
                                                {m.latestRequest.attachments?.map((att, i) => (
                                                    <a key={i} href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                        {att.name}
                                                    </a>
                                                ))}
                                                {isClient && isSubmitted && (
                                                    <div className="flex gap-2 pt-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApproveRelease(m._id); }}
                                                            disabled={actionLoading}
                                                            className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                                        >
                                                            {actionLoading ? 'Processing…' : `Approve & release ${fmtAmount(m.amount)} to freelancer`}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setShowRevisionModal(m._id); }}
                                                            className="flex-1 py-2 border-2 border-red-300 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                                                        >
                                                            Request revision
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Freelancer: revision feedback card */}
                                        {!isClient && isRevision && (
                                            <div className="mt-3 border-t border-orange-200 pt-3">
                                                <p className="text-xs font-semibold text-orange-800 mb-1">Client's feedback:</p>
                                                <p className="text-xs text-gray-700 bg-white rounded-lg p-2 border border-gray-200">
                                                    "{m.revisionReason}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Completed Job Banner ─────────────────────── */}
                    {allReleased && (
                        <div className="mt-4 -mx-4">
                            <JobCompletionBanner
                                jobId={jobId!}
                                jobTitle={otherUserName || 'Project'}
                                milestones={milestones}
                                isClient={isClient}
                                otherUserName={otherUserName || ''}
                                otherUserId={otherUserName} // Need valid ID if available, but username provided is string
                            />
                        </div>
                    )}

                    {/* ── Request Release Modal ──────────────────── */}
                    {showReleaseModal && (
                        <RequestReleaseModal
                            milestone={milestones.find(m => m._id === showReleaseModal)!}
                            description={releaseDesc}
                            setDescription={setReleaseDesc}
                            onSubmit={() => handleRequestRelease(showReleaseModal)}
                            onCancel={() => { setShowReleaseModal(null); setError(''); }}
                            loading={actionLoading}
                            error={error}
                            attachments={releaseAttachments}
                            setAttachments={setReleaseAttachments}
                        />
                    )}

                    {/* ── Revision Reason Modal (Client) ─────────── */}
                    {showRevisionModal && (
                        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                                <h3 className="font-bold text-gray-900 mb-1">Request Revision</h3>
                                <p className="text-xs text-gray-500 mb-4">Explain what needs to be fixed</p>
                                <textarea
                                    value={revisionReason}
                                    onChange={e => setRevisionReason(e.target.value)}
                                    placeholder="Describe what needs to be changed or fixed…"
                                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none h-28 focus:outline-none focus:border-orange-400"
                                />
                                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => { setShowRevisionModal(null); setError(''); }} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
                                    <button
                                        onClick={() => handleRequestRevision(showRevisionModal)}
                                        disabled={actionLoading}
                                        className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Sending…' : 'Send revision request'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Reject Modal (Client) ──────────────────── */}
                    {showRejectModal && (
                        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                                <h3 className="font-bold text-gray-900 mb-1">Reject Proposal</h3>
                                <p className="text-xs text-gray-500 mb-4">Freelancer will need to re-propose</p>
                                <textarea
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    placeholder="Reason for rejection (optional)…"
                                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:border-red-400"
                                />
                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => setShowRejectModal(false)} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600">Cancel</button>
                                    <button
                                        onClick={handleReject}
                                        disabled={actionLoading}
                                        className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Rejecting…' : 'Reject proposal'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════ */

function ProposeMilestonesForm({
    items,
    setItems,
    jobBudget,
    jobCurrency,
    budgetTotal,
    budgetMatches,
    onSubmit,
    onCancel,
    loading,
    isClient,
    editingIndex,
    setEditingIndex,
}: {
    items: { title: string; description: string; amount: string; deadline: string }[];
    setItems: (v: any) => void;
    jobBudget?: number;
    jobCurrency?: string | null;
    budgetTotal: number;
    budgetMatches: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    loading: boolean;
    isClient?: boolean;
    editingIndex?: number | null;
    setEditingIndex?: (v: number | null) => void;
}) {
    const updateItem = (i: number, field: string, val: string) => {
        setItems((prev: any[]) => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
    };

    const addItem = () => setItems((prev: any[]) => [...prev, { title: '', description: '', amount: '', deadline: '' }]);
    const removeItem = (i: number) => setItems((prev: any[]) => prev.filter((_, idx) => idx !== i));

    const currencySymbol = jobCurrency === 'USD' ? '$' : jobCurrency === 'GBP' ? '£' : jobCurrency === 'EUR' ? '€' : '₹';
    const fmtAmt = (n: number) => `${currencySymbol}${n.toLocaleString('en-IN')}`;

    return (
        <div className="space-y-3">
            {/* Budget reminder */}
            {jobBudget && (
                <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-gray-500 font-medium">
                        {isClient
                            ? (editingIndex !== null ? 'Modify milestone' : 'Modify milestones')
                            : 'Propose milestones'}
                    </span>
                    <span className="text-gray-600 font-semibold">Total budget: {fmtAmt(jobBudget)}</span>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700">
                Break the project into milestones. Total must equal {jobBudget ? fmtAmt(jobBudget) : 'the budget'}. Client will review and approve before work begins.
            </div>

            {items.map((item, i) => {
                // If editing specific item, skip others
                if (editingIndex !== null && editingIndex !== undefined && editingIndex !== i) return null;

                return (
                    <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-600">Milestone {i + 1}</span>
                            {items.length > 1 && editingIndex === null && (
                                <button onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Title</label>
                            <input
                                value={item.title}
                                onChange={e => updateItem(i, 'title', e.target.value)}
                                placeholder="e.g. UI Design & Mockup"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Amount ({currencySymbol})</label>
                                <input
                                    type="number"
                                    value={item.amount}
                                    onChange={e => updateItem(i, 'amount', e.target.value)}
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    placeholder="3,000"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Deadline</label>
                                <input
                                    type="date"
                                    value={item.deadline}
                                    onChange={e => updateItem(i, 'deadline', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Description</label>
                            <input
                                value={item.description}
                                onChange={e => updateItem(i, 'description', e.target.value)}
                                placeholder="What will be delivered in this milestone?"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
                            />
                        </div>
                    </div>
                );
            })}

            {/* Add milestone - hide if editing specific one */}
            {editingIndex === null && (
                <button
                    onClick={addItem}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Add another milestone
                </button>
            )}

            {/* If focused on one, add "Show all" button */}
            {editingIndex !== null && (
                <button
                    onClick={() => setEditingIndex?.(null)}
                    className="w-full py-2 text-xs text-emerald-600 font-semibold hover:underline"
                >
                    Show all milestones to balance budget
                </button>
            )}

            {/* Budget validator */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold ${budgetMatches ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                <span>Total proposed: {fmtAmt(budgetTotal)}</span>
                {jobBudget && (
                    <span>{budgetMatches ? '✓ Matches budget' : `Need ${fmtAmt(Math.abs(jobBudget - budgetTotal))} ${budgetTotal < jobBudget ? 'more' : 'less'}`}</span>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button onClick={onCancel} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading || (!!jobBudget && !budgetMatches)}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting…' : isClient ? 'Submit suggested changes' : 'Submit milestone proposal to client'}
                </button>
            </div>
        </div>
    );
}

function MilestoneProposalCard({
    milestones,
    otherUserName,
    jobCurrency,
    onApproveAll,
    onReject,
    onEdit,
    loading,
    isClient,
}: {
    milestones: Milestone[];
    otherUserName?: string;
    jobCurrency?: string | null;
    onApproveAll: () => void;
    onReject: () => void;
    onEdit: (index?: number) => void;
    loading: boolean;
    isClient?: boolean;
}) {
    const proposedBy = milestones[0]?.proposedBy;
    const isProposedByMe = isClient ? proposedBy === 'client' : (proposedBy === 'freelancer' || !proposedBy);
    const total = milestones.reduce((s, m) => s + m.amount, 0);
    const currencySymbol = jobCurrency === 'USD' ? '$' : jobCurrency === 'GBP' ? '£' : jobCurrency === 'EUR' ? '€' : '₹';
    const fmtAmt = (n: number) => `${currencySymbol}${n.toLocaleString('en-IN')}`;
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    return (
        <div className="border-2 border-blue-200 rounded-2xl overflow-hidden bg-white">
            {/* Header */}
            <div className="bg-blue-50 px-4 py-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-blue-900">
                        {isProposedByMe
                            ? (isClient ? 'Your suggested changes — awaiting freelancer review' : `Your proposal — awaiting client review`)
                            : (isClient ? `Milestone proposal from ${otherUserName || 'Freelancer'}` : `Client's suggested changes`)
                        }
                    </p>
                    <p className="text-xs text-blue-600">{milestones.length} milestones · Total {fmtAmt(total)} · Submitted {today}</p>
                </div>
            </div>

            {/* Milestones list */}
            <div className="divide-y divide-gray-100">
                {milestones.map((m, i) => (
                    <div key={m._id} className="px-4 py-3 flex items-start gap-3 bg-blue-50/30">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-blue-800">{m.title}</p>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-blue-900">{fmtAmt(m.amount)}</p>
                                    {!isProposedByMe && isClient && (
                                        <button onClick={(e) => { e.stopPropagation(); onEdit(i); }} className="text-xs text-blue-500 hover:underline">Edit</button>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">{m.description}</p>
                            {m.deadline && <p className="text-xs text-blue-500 mt-0.5">Deadline: {new Date(m.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-blue-100">
                <span className="text-sm font-semibold text-blue-700">Total</span>
                <span className="text-sm font-bold text-blue-900">{fmtAmt(total)} ✓ matches budget</span>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 flex gap-2 border-t border-blue-100">
                {isProposedByMe ? (
                    // Proposer sees "waiting" state
                    <div className="flex-1 flex items-center justify-between gap-2">
                        <p className="text-xs text-blue-600 font-medium">
                            {isClient ? '⏳ Waiting for freelancer to accept your changes…' : '⏳ Waiting for client to review your proposal…'}
                        </p>
                        {isClient && (
                            <button
                                onClick={() => onEdit()}
                                disabled={loading}
                                className="flex-shrink-0 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:border-gray-400 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                ) : (
                    // Reviewer sees approve / edit / reject
                    <>
                        <button
                            onClick={onApproveAll}
                            disabled={loading}
                            className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? (isClient ? 'Approving…' : 'Accepting…') : (isClient ? 'Approve all milestones' : "Accept client's plan")}
                        </button>
                        {isClient && (
                            <button
                                onClick={() => onEdit()}
                                disabled={loading}
                                className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:border-gray-400 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                        {isClient && (
                            <button
                                onClick={onReject}
                                disabled={loading}
                                className="px-4 py-2.5 border-2 border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function RequestReleaseModal({
    milestone,
    description,
    setDescription,
    onSubmit,
    onCancel,
    loading,
    error,
    attachments,
    setAttachments,
}: {
    milestone: Milestone;
    description: string;
    setDescription: (v: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    loading: boolean;
    error: string;
    attachments: { url: string; name: string; type: string }[];
    setAttachments: (v: { url: string; name: string; type: string }[]) => void;
}) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState('');

    const fmtAmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploading(true);
        setUploadError('');
        try {
            const uploaded: { url: string; name: string; type: string }[] = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('chatId', milestone._id);
                formData.append('userId', '');
                const res = await fetch('/api/chat/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success && data.fileUrl) {
                    uploaded.push({ url: data.fileUrl, name: file.name, type: file.type });
                } else {
                    setUploadError(`Failed to upload ${file.name}`);
                }
            }
            setAttachments([...attachments, ...uploaded]);
        } catch {
            setUploadError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeAttachment = (i: number) => {
        setAttachments(attachments.filter((_, idx) => idx !== i));
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return '🖼️';
        if (type.includes('pdf')) return '📄';
        if (type.includes('zip') || type.includes('rar')) return '🗜️';
        return '📎';
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-0.5">Request milestone release</h3>
                    <p className="text-xs text-emerald-600 font-semibold mb-4">
                        Milestone {milestone.orderIndex} · {milestone.title} · {fmtAmt(milestone.amount)}
                    </p>

                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Describe work completed <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Describe what you completed, tools used, how to review the work…"
                        className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none h-32 focus:outline-none focus:border-emerald-400 mb-4"
                    />

                    <label className="text-sm font-semibold text-gray-700 block mb-2">Attachments (optional)</label>

                    {/* Uploaded files list */}
                    {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {attachments.map((att, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5 text-xs max-w-[180px]">
                                    <span>{getFileIcon(att.type)}</span>
                                    <a href={att.url} target="_blank" rel="noreferrer" className="truncate text-blue-600 hover:underline flex-1 min-w-0">{att.name}</a>
                                    <button onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload drop zone */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer mb-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                                Uploading…
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                + Add files or screenshots
                            </>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,application/pdf,.doc,.docx,.zip,.rar,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {uploadError && <p className="text-xs text-red-500 mb-2">{uploadError}</p>}
                    <p className="text-xs text-gray-400 mb-4">Supported: images, PDF, Word, ZIP — max 10 MB each</p>

                    {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

                    <div className="flex gap-3">
                        <button onClick={onCancel} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            disabled={loading || !description.trim() || uploading}
                            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Sending…' : 'Send request to client'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
