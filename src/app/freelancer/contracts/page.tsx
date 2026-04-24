"use client";

import { useState } from "react";
import { FiSearch, FiFilter, FiDownload, FiMoreVertical } from "react-icons/fi";

export default function ContractsPage() {
  const [sortBy, setSortBy] = useState("Start date");
  const [sortOrder, setSortOrder] = useState("Descending");

  const contracts = [
    {
      id: 1,
      title: "Android App Development with Admin Dashboard",
      offerFrom: "Jack Wilshere",
      client: "Jack Wilshere",
      status: "Pending",
      statusType: "pending",
      statusDetail: "Waiting for you to accept or reject to approve",
      offerReceived: "4 days ago",
      changesRequested: "4 days ago",
      budget: null,
      dates: null,
      hasOffer: true,
    },
    {
      id: 2,
      title: "Construction Business Website Development",
      hiredBy: "Barry Allen",
      client: "Barry Allen",
      status: "Paused",
      statusType: "paused",
      budget: "$5,000.00 Budget",
      escrowFunds: "$0.00 in escrow funds",
      investigation: "We are investigating a problem with Barry's account. Please do not resume work until the contract is active again.",
      dates: "Jan 15, 2025 - Present",
      hasMessage: true,
    },
    {
      id: 3,
      title: "E-commerce Platform with Payment Integration",
      hiredBy: "Sarah Johnson",
      client: "Sarah Johnson",
      status: "Ended",
      statusType: "ended",
      rating: 5.0,
      budget: "$8,500.00 Budget",
      dates: "Nov 10, 2024 - Jan 5, 2025",
      hasPropose: true,
    },
    {
      id: 4,
      title: "Mobile App UI/UX Design and Development",
      hiredBy: "Michael Chen",
      client: "Michael Chen",
      status: "Ended",
      statusType: "ended",
      rating: 5.0,
      budget: "$12,000.00",
      rateDetail: "Rate: $45.00/hr, 25 hrs weekly limit",
      investigation: "We are investigating a problem with Michael's account. Please do not resume work until the contract is active again.",
      dates: "Sep 20, 2024 - Dec 15, 2024",
      hasPropose: true,
    },
    {
      id: 5,
      title: "React Native App Development for Healthcare",
      hiredBy: "Emily Rodriguez",
      client: "TechHealth Solutions",
      status: "Ended",
      statusType: "ended",
      rating: 5.0,
      budget: "$15,500.00 Budget",
      dates: "Aug 5, 2024 - Nov 30, 2024",
      hasPropose: true,
    },
    {
      id: 6,
      title: "WordPress Plugin Development and Customization",
      hiredBy: "David Park",
      client: "WebPlugins Ltd",
      status: "Ended",
      statusType: "ended",
      feedback: "No feedback given",
      budget: "$3,200.00 Budget",
      dates: "Oct 12, 2024 - Nov 8, 2024",
      hasPropose: true,
    },
    {
      id: 7,
      title: "API Integration and Backend Development",
      hiredBy: "Lisa Anderson",
      client: "CloudSync Inc",
      status: "Ended",
      statusType: "ended",
      rating: 5.0,
      hourlyRate: "$60.00/hr, $2,400.00 this week",
      lastActivity: "Last activity: 3 weeks ago",
      rateDetail: "Rate: $60.00/hr, 40 hrs weekly limit",
      dates: "Jul 1, 2024 - Present",
      hasTimesheet: true,
    },
    {
      id: 8,
      title: "Full Stack Web Application Development",
      hiredBy: "James Wilson",
      client: "StartupHub",
      status: "Ended",
      statusType: "ended",
      rating: 5.0,
      budget: "$18,000.00 Budget",
      dates: "May 15, 2024 - Sep 30, 2024",
      hasPropose: true,
    },
    {
      id: 9,
      title: "Database Design and Optimization",
      hiredBy: "Maria Garcia",
      client: "DataFlow Systems",
      status: "Ended",
      statusType: "ended",
      feedback: "No feedback given",
      budget: "$4,500.00 Budget",
      dates: "Jun 20, 2024 - Aug 10, 2024",
      hasPropose: true,
    },
    {
      id: 10,
      title: "Progressive Web App Development",
      hiredBy: "Thomas Lee",
      client: "WebTech Solutions",
      status: "Ended",
      statusType: "ended",
      rating: 5.0,
      budget: "$9,200.00 Budget",
      dates: "Apr 1, 2024 - Jun 25, 2024",
      hasPropose: true,
    },
  ];

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case "pending":
        return "text-blue-600";
      case "paused":
        return "text-yellow-600";
      case "ended":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusDetailColor = (statusType: string) => {
    switch (statusType) {
      case "pending":
        return "text-red-600";
      case "paused":
        return "text-gray-700";
      default:
        return "text-gray-700";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span key={index} className="text-orange-400 text-sm">
            ★
          </span>
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">All contracts</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex-1 max-w-md relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by contract, client, or company name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-full border border-gray-300 transition">
                <FiFilter />
                <span className="font-medium">Filters</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-gray-400"
                >
                  <option>Start date</option>
                  <option>End date</option>
                  <option>Budget</option>
                  <option>Client name</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-gray-400"
                >
                  <option>Descending</option>
                  <option>Ascending</option>
                </select>

                <span className="text-sm text-gray-500">229 total</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
              <FiDownload />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Contracts List */}
        <div className="space-y-6">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-medium text-gray-900 flex-1 pr-4">
                  {contract.title}
                </h2>
                <div className="flex items-center gap-2">
                  {contract.hasOffer && (
                    <button className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition">
                      See offer
                    </button>
                  )}
                  {contract.hasMessage && (
                    <button className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition">
                      Send a message
                    </button>
                  )}
                  {contract.hasPropose && (
                    <button className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition">
                      Propose new contract
                    </button>
                  )}
                  {contract.hasTimesheet && (
                    <button className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition">
                      See timesheet
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <FiMoreVertical className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {contract.offerFrom && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Offer from</span> {contract.offerFrom}
                  </p>
                )}
                {contract.hiredBy && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Hired by</span> {contract.hiredBy}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <span className={`${getStatusColor(contract.statusType)} font-medium`}>
                    {contract.status}
                  </span>
                  {contract.rating && renderStars(contract.rating)}
                </div>

                {contract.statusDetail && (
                  <p className={`text-sm ${getStatusDetailColor(contract.statusType)}`}>
                    {contract.statusDetail}
                  </p>
                )}

                {contract.client && (
                  <p className="text-sm text-gray-700">{contract.client}</p>
                )}

                {contract.offerReceived && (
                  <p className="text-sm text-gray-600">Offer received {contract.offerReceived}</p>
                )}

                {contract.changesRequested && (
                  <p className="text-sm text-gray-600">
                    You requested changes {contract.changesRequested}
                  </p>
                )}

                {contract.budget && (
                  <p className="text-sm text-gray-700 font-medium">{contract.budget}</p>
                )}

                {contract.escrowFunds && (
                  <p className="text-sm text-gray-700">{contract.escrowFunds}</p>
                )}

                {contract.hourlyRate && (
                  <p className="text-sm text-gray-700 font-medium">{contract.hourlyRate}</p>
                )}

                {contract.lastActivity && (
                  <p className="text-sm text-gray-600">{contract.lastActivity}</p>
                )}

                {contract.rateDetail && (
                  <p className="text-sm text-gray-700">{contract.rateDetail}</p>
                )}

                {contract.investigation && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2">
                    <p className="text-sm text-gray-700">
                      {contract.investigation}{" "}
                      <a href="#" className="text-green-600 font-medium hover:underline">
                        Learn more
                      </a>
                    </p>
                  </div>
                )}

                {contract.feedback && (
                  <p className="text-sm text-gray-700">{contract.feedback}</p>
                )}

                {contract.dates && (
                  <p className="text-sm text-gray-600">{contract.dates}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">1 - 10 of 229 Contracts</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition">
              ‹
            </button>
            <button className="px-3 py-1 bg-gray-900 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition">
              4
            </button>
            <span className="px-2">...</span>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}