'use client';

import React from 'react';
import { FiDownload, FiFilter, FiSearch } from 'react-icons/fi';

// const mockTransactions = [
//     { id: 'TR-9021', date: 'Feb 05, 2026', description: 'Payment for "E-Commerce Project"', amount: '+$1,250.00', status: 'Completed', type: 'Credit' },
//     { id: 'TR-8842', date: 'Feb 03, 2026', description: 'Withdrawal to Bank Account (****4321)', amount: '-$500.00', status: 'Processing', type: 'Debit' },
//     { id: 'TR-8711', date: 'Jan 28, 2026', description: 'Connects Bundle (80 Connects)', amount: '-$12.00', status: 'Completed', type: 'Debit' },
//     { id: 'TR-8654', date: 'Jan 11, 2026', description: 'Freelancer Plus Membership', amount: '-$10.99', status: 'Completed', type: 'Debit' },
//     { id: 'TR-8521', date: 'Jan 05, 2026', description: 'Payment for "Logo Design"', amount: '+$350.00', status: 'Completed', type: 'Credit' },
// ];

const mockTransactions = [
  { id: 'TR-9021', date: 'Feb 05, 2026', description: 'Payment to John (Web App Project)', amount: '-$1,250.00', status: 'Completed', type: 'Debit' },
  { id: 'TR-8842', date: 'Feb 03, 2026', description: 'Added funds via Card', amount: '+$2,000.00', status: 'Completed', type: 'Credit' },
];

export default function Transactions() {
    return (
        <div className="h-full flex flex-col">
            <div className="p-8 border-b border-gray-100 bg-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 font-display">Billing & Payments</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <FiDownload className="text-gray-400" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        <FiFilter className="text-gray-400" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Date</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Description</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 text-right">Amount</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {mockTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 text-sm text-gray-600">{tx.date}</td>
                                <td className="px-8 py-5">
                                    <p className="text-sm font-semibold text-gray-900">{tx.description}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-widest">{tx.id}</p>
                                </td>
                                <td className={`px-8 py-5 text-sm font-bold text-right ${tx.type === 'Credit' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.amount}
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-center">
                <button className="text-sm font-bold text-orange-600 hover:underline">View All History</button>
            </div>
        </div>
    );
}
