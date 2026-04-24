'use client';

import React from 'react';
import { FiArrowUpRight, FiPlus, FiCreditCard, FiCheckCircle, FiInfo } from 'react-icons/fi';

export default function PayFreelancers() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-display">Payout Methods</h2>
                <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg border border-orange-100 flex items-center gap-2 text-sm font-semibold shadow-sm">
                    <FiInfo className="flex-shrink-0" />
                    Available balance: $1,254.50
                </div>
            </div>

            <div className="space-y-8">
                {/* Active Accounts */}
                <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1">Payment methods</h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors shadow-sm ring-2 ring-white">
                            <FiPlus />
                            Add method
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-green-200 bg-green-50/30 rounded-xl p-4 flex items-start gap-4 ring-1 ring-green-100">
                            <div className="w-10 h-10 bg-white border border-green-100 rounded-lg flex items-center justify-center text-green-600 shadow-sm">
                                <FiCheckCircle />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">Direct to Bank (USD)</p>
                                <p className="text-xs text-gray-500 mb-2">**** 4321 • Active</p>
                                <button className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider">Set as primary</button>
                            </div>
                            <FiArrowUpRight className="text-gray-300" />
                        </div>

                        <div className="border border-gray-100 bg-white rounded-xl p-4 flex items-start gap-4 hover:border-orange-200 transition-colors group">
                            <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 shadow-sm group-hover:text-orange-500 group-hover:bg-orange-50 transition-all">
                                <FiCreditCard />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">PayPal</p>
                                <p className="text-xs text-gray-500 mb-2">s******n@gmail.com</p>
                                <button className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider">Edit account</button>
                            </div>
                            <FiArrowUpRight className="text-gray-300" />
                        </div>
                    </div>
                </section>

                {/* Withdrawal Schedule */}
                <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Automatic Payment Schedule</h3>
                    <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-700 leading-relaxed max-w-lg mb-4">
                            Payments to freelancers will be processed automatically from your primary payment method twice per month (1st and 15th) when your payable balance exceeds <span className="font-bold">$100.00</span>.
                        </p>
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            Edit Payment Schedule
                        </button>
                    </div>
                </section>

                {/* Recent History Prompt */}
                <div className="p-6 border-2 border-dashed border-gray-100 rounded-xl text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Looking for your payment history?</p>
                    <button className="text-sm font-bold text-orange-600 hover:underline uppercase tracking-widest">View Transactions Tab</button>
                </div>
            </div>
        </div>
    );
}
