// "use client";

// import { useState } from "react";
// import { Eye, MessageSquare, Star, Flag, Info } from "lucide-react";

// // JSON data structure - Easy to replace with API call later
// const bidInsightsData = {
//   bids: [
//     {
//       id: 1,
//       projectName: "Dental Staffing Website",
//       status: "active",
//       timeToBid: "50 minutes, 18 seconds",
//       bidRank: "#100+ of 301 bids",
//       winningBid: null,
//       yourBid: "$2,000.00 USD",
//       clientCountry: "US",
//       clientRating: null,
//       clientFeedback: 0,
//       chatInitiated: false,
//     },
//     {
//       id: 2,
//       projectName: "Spa Therapy Institute Website",
//       status: "active",
//       timeToBid: "11 minutes, 19 seconds",
//       bidRank: "#40 of 57 bids",
//       winningBid: "₹3,000.00 INR",
//       yourBid: "₹8,000.00 INR",
//       clientCountry: "IN",
//       clientRating: 5.0,
//       clientFeedback: 1,
//       chatInitiated: false,
//     },
//     {
//       id: 3,
//       projectName: "Android App Development",
//       status: "active",
//       timeToBid: "9 minutes, 2 seconds",
//       bidRank: "#24 of 33 bids",
//       winningBid: null,
//       yourBid: "₹300.00 INR",
//       clientCountry: "IN",
//       clientRating: null,
//       clientFeedback: 0,
//       chatInitiated: false,
//     },
//     {
//       id: 4,
//       projectName: "School Management System",
//       status: "active",
//       timeToBid: "12 minutes, 5 seconds",
//       bidRank: "#67 of 90 bids",
//       winningBid: null,
//       yourBid: "₹25,000.00 INR",
//       clientCountry: "IN",
//       clientRating: null,
//       clientFeedback: 0,
//       chatInitiated: false,
//     },
//     {
//       id: 5,
//       projectName: "Multi-vendor eCommerce Platform",
//       status: "active",
//       timeToBid: "8 minutes, 39 seconds",
//       bidRank: "#100+ of 203 bids",
//       winningBid: null,
//       yourBid: "$350.00 USD",
//       clientCountry: "PK",
//       clientRating: null,
//       clientFeedback: 0,
//       chatInitiated: false,
//     },
//     {
//       id: 6,
//       projectName: "React Native Mobile App",
//       status: "active",
//       timeToBid: "15 minutes, 42 seconds",
//       bidRank: "#53 of 128 bids",
//       winningBid: null,
//       yourBid: "₹45,000.00 INR",
//       clientCountry: "JP",
//       clientRating: 5.0,
//       clientFeedback: 29,
//       chatInitiated: true,
//     },
//   ],
// };

// export default function BidInsightsSection() {
//   const [bids] = useState(bidInsightsData.bids);

//   const getStatusColor = (status: string) => {
//     return status === "active" ? "bg-green-500" : "bg-gray-400";
//   };

//   const getCountryFlag = (country: string) => {
//     const flags: { [key: string]: string } = {
//       US: "🇺🇸",
//       IN: "🇮🇳",
//       PK: "🇵🇰",
//       JP: "🇯🇵",
//     };
//     return flags[country] || "🌍";
//   };

//   return (
//     <div className="flex-1 p-8 bg-[#f9f9f9]">
      

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   Project
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   <div className="flex items-center gap-2">
//                     Time to bid
//                     <Info size={16} className="text-gray-400 cursor-help" />
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   <div className="flex items-center gap-2">
//                     Bid Rank
//                     <Info size={16} className="text-gray-400 cursor-help" />
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   <div className="flex items-center gap-2">
//                     Winning Bid
//                     <Info size={16} className="text-gray-400 cursor-help" />
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   Your Bid
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   <div className="flex items-center gap-2">
//                     Actions Taken
//                     <Info size={16} className="text-gray-400 cursor-help" />
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   <div className="flex items-center gap-2">
//                     Client Information
//                     <Info size={16} className="text-gray-400 cursor-help" />
//                   </div>
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
//                   <div className="flex items-center gap-2">
//                     Chat Initiated
//                     <Info size={16} className="text-gray-400 cursor-help" />
//                   </div>
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {bids.map((bid) => (
//                 <tr key={bid.id} className="hover:bg-gray-50 transition">
//                   {/* PROJECT NAME */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-2 h-2 rounded-full ${getStatusColor(
//                           bid.status
//                         )}`}
//                       />
//                       <span className="text-blue-600 font-medium hover:underline cursor-pointer">
//                         {bid.projectName}
//                       </span>
//                     </div>
//                   </td>

//                   {/* TIME TO BID */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     {bid.timeToBid}
//                   </td>

//                   {/* BID RANK */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     {bid.bidRank}
//                   </td>

//                   {/* WINNING BID */}
//                   <td className="px-6 py-4 text-sm text-gray-700">
//                     {bid.winningBid || "-"}
//                   </td>

//                   {/* YOUR BID */}
//                   <td className="px-6 py-4 text-sm font-semibold text-gray-900">
//                     {bid.yourBid}
//                   </td>

//                   {/* ACTIONS TAKEN */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <Eye size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
//                       <Flag size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
//                       <MessageSquare size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
//                       <span className="text-sm text-gray-500">-</span>
//                     </div>
//                   </td>

//                   {/* CLIENT INFORMATION */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl">
//                         {getCountryFlag(bid.clientCountry)}
//                       </span>
//                       {bid.clientRating && (
//                         <div className="flex items-center gap-1">
//                           <Star size={16} className="fill-pink-500 text-pink-500" />
//                           <span className="text-sm font-semibold">
//                             {bid.clientRating}
//                           </span>
//                         </div>
//                       )}
//                       {!bid.clientRating && (
//                         <div className="flex items-center gap-1">
//                           <Star size={16} className="text-gray-300" />
//                           <span className="text-sm text-gray-400">-</span>
//                         </div>
//                       )}
//                       {bid.clientFeedback > 0 && (
//                         <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
//                           {bid.clientFeedback}
//                         </span>
//                       )}
//                       {bid.clientFeedback === 0 && (
//                         <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
//                           0
//                         </span>
//                       )}
//                     </div>
//                   </td>

//                   {/* CHAT INITIATED */}
//                   <td className="px-6 py-4">
//                     {bid.chatInitiated ? (
//                       <button className="text-blue-500 hover:underline text-sm font-medium">
//                         Chat
//                       </button>
//                     ) : (
//                       <button className="text-gray-400 text-sm font-medium">
//                         Chat
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, MessageSquare, Star, Flag, Info } from "lucide-react";

/** API response shape from GET /api/bid-insights */
type BidInsightItem = {
  proposalId: string;
  project: { id: string; title: string; category?: string; status?: string };
  timeToBid: { formatted?: string; expired?: boolean } | null;
  submittedAt: string;
  bidRank: { current: number; total: number; formatted: string; percentage?: number };
  winningBid: { amount: number; currency: string; isAccepted?: boolean } | null;
  yourBid: {
    amount: number;
    currency: string;
    total?: number;
    isLowest?: boolean;
    isCompetitive?: boolean;
  };
  status: string;
  actionTaken: string | null;
  isShortlisted?: boolean;
  isAccepted?: boolean;
  isRejected?: boolean;
  clientInformation: {
    id?: string;
    name?: string;
    country?: string;
    rating?: number;
    totalJobsPosted?: number;
  };
  chatInitiated: boolean;
  unreadMessages?: number;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  bidInsights: BidInsightItem[];
  pagination?: { total: number; page: number; limit: number; pages: number };
  summary?: {
    total: number;
    pending: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
    totalBidValue: number;
    averageBid: number;
  };
};

function formatMoney(amount: number, currency: string): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return "-";
  const sym = currency === "USD" || currency === "INR" ? (currency === "USD" ? "$" : "₹") : currency + " ";
  const formatted = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sym}${formatted} ${currency}`;
}

function countryToCode(country: string | undefined): string {
  if (!country) return "US";
  const u = country.toUpperCase();
  if (u.includes("UNITED STATES") || u === "US" || u.includes("USA")) return "US";
  if (u.includes("INDIA") || u === "IN") return "IN";
  if (u.includes("PAKISTAN") || u === "PK") return "PK";
  if (u.includes("JAPAN") || u === "JP") return "JP";
  if (u.length === 2) return u;
  return "🌍";
}

export default function BidInsightsSection() {
  const [bids, setBids] = useState<BidInsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; pages: number } | null>(null);

  const fetchBidInsights = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/bid-insights?page=${pageNum}&limit=10`,
        { credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      const data: ApiResponse = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bid insights");
      }
      if (!data.success || !Array.isArray(data.bidInsights)) {
        setBids([]);
        return;
      }
      setBids(data.bidInsights);
      setPagination(data.pagination ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bid insights");
      setBids([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBidInsights(page);
  }, [page, fetchBidInsights]);

  const getStatusColor = (status: string) => {
    return status === "active" || status === "pending" ? "bg-green-500" : status === "accepted" ? "bg-green-500" : status === "rejected" ? "bg-red-500" : "bg-gray-400";
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      US: "🇺🇸",
      IN: "🇮🇳",
      PK: "🇵🇰",
      JP: "🇯🇵",
    };
    return flags[country] || "🌍";
  };

  const formatBidRank = (insight: BidInsightItem) => {
    const r = insight.bidRank;
    if (!r) return "-";
    if (r.current >= 100) return `#100+ of ${r.total} bids`;
    return `#${r.current} of ${r.total} bids`;
  };

  return (
    <div className="flex-1 p-8 bg-[#f9f9f9]">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-300 border-t-[#1B365D] rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">Loading bid insights…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Project</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Time to bid
                      <Info size={16} className="text-gray-400 cursor-help" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Bid Rank
                      <Info size={16} className="text-gray-400 cursor-help" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Winning Bid
                      <Info size={16} className="text-gray-400 cursor-help" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Your Bid</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Actions Taken
                      <Info size={16} className="text-gray-400 cursor-help" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Client Information
                      <Info size={16} className="text-gray-400 cursor-help" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      Chat Initiated
                      <Info size={16} className="text-gray-400 cursor-help" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {bids.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No bids yet. Your bids on projects will appear here.
                    </td>
                  </tr>
                )}
                {bids.map((bid) => (
                  <tr key={bid.proposalId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(bid.status)}`} />
                        <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                          {bid.project?.title || "Untitled Project"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {bid.timeToBid?.expired ? "Expired" : bid.timeToBid?.formatted ?? "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatBidRank(bid)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {bid.winningBid ? formatMoney(bid.winningBid.amount, bid.winningBid.currency) : "-"}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatMoney(bid.yourBid?.amount ?? 0, bid.yourBid?.currency ?? "USD")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Eye size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                        <Flag size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                        <MessageSquare size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                        <span className="text-sm text-gray-500">{bid.actionTaken ?? "-"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCountryFlag(countryToCode(bid.clientInformation?.country))}</span>
                        {bid.clientInformation?.rating != null && bid.clientInformation.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star size={16} className="fill-pink-500 text-pink-500" />
                            <span className="text-sm font-semibold">{bid.clientInformation.rating}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-gray-300" />
                            <span className="text-sm text-gray-400">-</span>
                          </div>
                        )}
                        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                          {bid.clientInformation?.totalJobsPosted ?? 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {bid.chatInitiated ? (
                        <button className="text-blue-500 hover:underline text-sm font-medium">Chat</button>
                      ) : (
                        <button className="text-gray-400 text-sm font-medium">Chat</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && !loading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages} · {pagination.total} total bids
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}