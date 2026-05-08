"use client";

import React, { useState, useEffect } from "react";
import FreelancerCard from "@/app/freelancer-profiles/components/FreelancerCard";

export default function SavedFreelancersSection() {
    const [freelancers, setFreelancers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSaved();
    }, []);

    const fetchSaved = async () => {
        try {
            const res = await fetch("/api/client/saved-freelancers", { credentials: "include" });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed to load");
            setFreelancers(data.freelancers || []);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const mapProfile = (profile: any) => {
        const skills = Array.isArray(profile.skills)
            ? profile.skills.map((s: any) =>
                typeof s === "string" ? { name: s, level: "Expert" } : { name: s.name || String(s), level: s.level || "Expert" }
            )
            : [];

        return {
            id: profile.userId || profile._id || "",
            name: profile.name || "Unknown",
            title: profile.title || "Freelancer",
            image: profile.profileImage || null,
            alt: `${profile.name || "Freelancer"} profile photo`,
            hourlyRate: Number(profile.hourlyRate) || 0,
            rating: (Array.isArray(profile.reviews) && profile.reviews.length === 0) ? 0 : Number(profile.rating) || 0,
            reviewCount: Array.isArray(profile.reviews) ? profile.reviews.length : 0,
            completedProjects: profile.completedJobs || 0,
            skills,
            availability: profile.availability || "Available Now",
            verified: profile.verified || false,
            location: profile.location || "Remote",
            responseTime: profile.responseTime || "1 hour",
        };
    };

    if (loading) {
        return (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-20 h-20 rounded-full bg-muted flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4" />
                                <div className="h-3 bg-muted rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
                <p>{error}</p>
                <button onClick={fetchSaved} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Try Again</button>
            </div>
        );
    }

    if (freelancers.length === 0) {
        return (
            <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No saved freelancers yet</h3>
                <p className="text-gray-500 mb-6">Browse the talent pool and use the bookmark icon to save profiles for later.</p>
                <a href="/freelancer-profiles" className="px-6 py-2 bg-[#FF6B35] text-white font-medium rounded-lg hover:bg-orange-600 transition">
                    Find Talent
                </a>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {freelancers.map((profile) => (
                    <FreelancerCard key={profile._id} {...mapProfile(profile)} isSavedInitial={true} />
                ))}
            </div>
        </div>
    );
}
