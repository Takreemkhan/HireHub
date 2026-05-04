'use client';

import React, { useState } from 'react';

interface Milestone {
    _id: string;
    title: string;
    amount: number;
    status: string;
}

interface JobCompletionBannerProps {
    jobId: string;
    jobTitle: string;
    milestones: Milestone[];
    isClient: boolean;
    otherUserName: string;
    otherUserId?: string;
    userId?: string;
}

export default function JobCompletionBanner({
    jobId,
    jobTitle,
    milestones,
    isClient,
    otherUserName,
    otherUserId,
    userId,
}: JobCompletionBannerProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const releasedMilestones = milestones.filter(m => m.status === 'released');
    const totalBudget = releasedMilestones.reduce((s, m) => s + m.amount, 0);
    const freelancerReceived = totalBudget;

    const fmtAmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    const handleSubmitReview = async () => {
        if (!rating) { setError('Please select a rating'); return; }
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/jobs/' + jobId + '/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review, revieweeId: otherUserId }),
            });
            const data = await res.json();
            if (data.success) setSubmitted(true);
            else setError(data.message || 'Failed to submit review');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-shrink-0">
            {/* ── Green Completion Banner Removed (Moved to ChatWindow pinned header) ── */}
            {/* ── Payment / Earnings Summary ────────────────────────── */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <p className="text-sm font-bold text-gray-800 mb-2">
                    {isClient ? 'Payment summary' : 'Earnings summary'}
                </p>
                <div className="space-y-2">
                    {isClient ? (
                        <>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Total paid to freelancer</span>
                                <span className="font-semibold text-gray-800">{fmtAmt(totalBudget)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-2">
                                <span className="text-emerald-700 font-semibold">Freelancer received</span>
                                <span className="font-bold text-emerald-700">{fmtAmt(freelancerReceived)}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Total earned</span>
                                <span className="font-semibold text-gray-800">{fmtAmt(totalBudget)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-2">
                                <span className="text-emerald-700 font-semibold">Wallet credited</span>
                                <span className="font-bold text-emerald-700">{fmtAmt(freelancerReceived)}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Star Rating Section ───────────────────────────────── */}
            {!submitted ? (
                <div className="bg-white px-4 py-4">
                    <p className="text-xs font-bold text-gray-800 mb-2">
                        Rate {otherUserName?.includes('@') ? otherUserName.split('@')[0] : otherUserName || (isClient ? 'Freelancer' : 'Client')}
                    </p>
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <svg
                                    className={`w-7 h-7 ${(hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-200'}`}
                                    fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    {/* Review text */}
                    <input
                        value={review}
                        onChange={e => setReview(e.target.value)}
                        placeholder="Leave a review…"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-400 mb-3"
                    />
                    {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
                    <button
                        onClick={handleSubmitReview}
                        disabled={submitting}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Submitting…' : 'Submit review'}
                    </button>
                </div>
            ) : (
                <div className="bg-emerald-50 px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs font-semibold text-emerald-700">Review submitted! Thank you.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
