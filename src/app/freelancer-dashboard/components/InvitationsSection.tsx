"use client";

import { useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle,
  XCircle,
  Tag,
  Calendar,
  User,
} from "lucide-react";

const mockInvitations = [
  {
    id: "1",
    clientName: "Alpha Corp",
    clientLocation: "United States",
    clientInitials: "AC",
    clientColor: "bg-blue-500",
    clientRating: 4.8,
    clientReviews: 34,
    clientSpent: "$12,400",
    jobTitle: "Frontend Developer Needed for SaaS Platform",
    jobDescription:
      "We're looking for an experienced React developer to help build our SaaS dashboard. The project involves building reusable components, integrating REST APIs, and optimizing performance for large datasets.",
    budget: "$500 – $1,200",
    budgetType: "Fixed Price",
    skills: ["React", "TypeScript", "Tailwind CSS", "REST API"],
    postedTime: "2 hours ago",
    invitedTime: "1 hour ago",
    deadline: "2 weeks",
  },
  {
    id: "2",
    clientName: "TechNova Ltd",
    clientLocation: "United Kingdom",
    clientInitials: "TN",
    clientColor: "bg-purple-500",
    clientRating: 5.0,
    clientReviews: 18,
    clientSpent: "$8,900",
    jobTitle: "React Native Mobile App – Android & iOS",
    jobDescription:
      "Need an experienced React Native developer to update our existing mobile app for Android 15/16 compatibility and test on iOS with TestFlight. Codebase is well-structured and documented.",
    budget: "$800 – $1,500",
    budgetType: "Fixed Price",
    skills: ["React Native", "Android", "iOS", "TestFlight"],
    postedTime: "5 hours ago",
    invitedTime: "3 hours ago",
    deadline: "1 week",
  },
  {
    id: "3",
    clientName: "GreenLeaf Inc.",
    clientLocation: "Canada",
    clientInitials: "GL",
    clientColor: "bg-green-500",
    clientRating: 4.6,
    clientReviews: 52,
    clientSpent: "$31,200",
    jobTitle: "Full Stack Developer – E-commerce Platform",
    jobDescription:
      "We need a full stack developer to build new features on our Shopify-based e-commerce store, including custom checkout flows, third-party integrations, and performance improvements.",
    budget: "$30/hr",
    budgetType: "Hourly",
    skills: ["Shopify", "JavaScript", "Node.js", "REST API"],
    postedTime: "1 day ago",
    invitedTime: "20 hours ago",
    deadline: "Ongoing",
  },
  {
    id: "4",
    clientName: "DataCore Systems",
    clientLocation: "Australia",
    clientInitials: "DC",
    clientColor: "bg-orange-500",
    clientRating: 4.9,
    clientReviews: 11,
    clientSpent: "$5,600",
    jobTitle: "Backend API Developer – Node.js & PostgreSQL",
    jobDescription:
      "Looking for a backend developer to build scalable REST APIs for our analytics platform. Requirements include authentication, rate limiting, caching with Redis, and comprehensive API documentation.",
    budget: "$1,000 – $2,500",
    budgetType: "Fixed Price",
    skills: ["Node.js", "PostgreSQL", "Redis", "Docker"],
    postedTime: "2 days ago",
    invitedTime: "1 day ago",
    deadline: "3 weeks",
  },
];

type InvitationStatus = "pending" | "accepted" | "declined";

export default function InvitationsSection() {
  const [statuses, setStatuses] = useState<Record<string, InvitationStatus>>(
    () => Object.fromEntries(mockInvitations.map((inv) => [inv.id, "pending"]))
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "accepted" }));
  };

  const handleDecline = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "declined" }));
  };

  const pending = mockInvitations.filter((i) => statuses[i.id] === "pending");
  const responded = mockInvitations.filter((i) => statuses[i.id] !== "pending");

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  const InvitationCard = ({ invitation }: { invitation: (typeof mockInvitations)[0] }) => {
    const status = statuses[invitation.id];
    const isExpanded = expandedId === invitation.id;

    return (

      <div
        className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden  ${status === "accepted"
          ? "border-green-200 bg-green-50/30"
          : status === "declined"
            ? "border-gray-200 opacity-60"
            : "border-gray-200 hover:border-blue-200 hover:shadow-md"
          }`}
      >
        {/* Status ribbon */}
        {status !== "pending" && (
          <div
            className={`px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${status === "accepted"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
              }`}
          >
            {status === "accepted" ? (
              <>
                <CheckCircle size={12} /> Invitation Accepted
              </>
            ) : (
              <>
                <XCircle size={12} /> Invitation Declined
              </>
            )}
          </div>
        )}

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Client info */}
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-full ${invitation.clientColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
              >
                {invitation.clientInitials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{invitation.clientName}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={11} />
                  {invitation.clientLocation}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {renderStars(invitation.clientRating)}
                  <span className="text-xs text-gray-500">
                    {invitation.clientRating} ({invitation.clientReviews})
                  </span>
                </div>
              </div>
            </div>

            {/* Time info */}
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                <Clock size={11} /> Invited {invitation.invitedTime}
              </span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block font-medium">
                New Invitation
              </span>
            </div>
          </div>

          {/* Job title */}
          <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
            {invitation.jobTitle}
          </h3>

          {/* Description */}
          <p className={`text-sm text-gray-500 leading-relaxed mb-3 ${!isExpanded ? "line-clamp-2" : ""}`}>
            {invitation.jobDescription}
          </p>
          {invitation.jobDescription.length > 120 && (
            <button
              onClick={() => setExpandedId(isExpanded ? null : invitation.id)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium mb-3"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
            <div className="flex items-center gap-1.5 text-gray-700 font-medium">
              <DollarSign size={14} className="text-green-600" />
              {invitation.budget}
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {invitation.budgetType}
            </span>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Calendar size={12} />
              {invitation.deadline}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Briefcase size={12} />
              Spent {invitation.clientSpent}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {invitation.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          {status === "pending" && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleAccept(invitation.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF6B35] hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all active:scale-95"
              >
                <CheckCircle size={15} />
                Accept
              </button>
              <button
                onClick={() => handleDecline(invitation.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg font-semibold text-sm transition-all active:scale-95"
              >
                <XCircle size={15} />
                Decline
              </button>
              <button className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-lg text-sm transition font-medium">
                View Job
              </button>
            </div>
          )}

          {status === "accepted" && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition">
                Send Proposal
              </button>
              <button className="flex-1 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
                View Job
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Invitations</h1>
          <p className="text-gray-500 text-sm">
            Clients have personally invited you to apply for these projects.
          </p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending", count: pending.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "Accepted", count: responded.filter((i) => statuses[i.id] === "accepted").length, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
            { label: "Declined", count: responded.filter((i) => statuses[i.id] === "declined").length, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-100" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending invitations */}
        {pending.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-gray-800">
                Pending Invitations
              </h2>
              <span className="bg-[#FF6B35] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pending.length}
              </span>
            </div>
            <div className="space-y-4">
              {pending.map((inv) => (
                <InvitationCard key={inv.id} invitation={inv} />
              ))}
            </div>
          </div>
        )}

        {/* No pending */}
        {pending.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 mb-8">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No pending invitations</p>
            <p className="text-gray-400 text-sm mt-1">You&apos;re all caught up!</p>
          </div>
        )}

        {/* Responded invitations */}
        {responded.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Previously Responded
            </h2>
            <div className="space-y-4">
              {responded.map((inv) => (
                <InvitationCard key={inv.id} invitation={inv} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
