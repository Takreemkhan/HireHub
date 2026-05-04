// 'use client';

// import React from 'react';
// import { FiSettings, FiPlus, FiClock, FiZap, FiCheckCircle } from 'react-icons/fi';

// export default function MembershipConnects() {
//     return (
//         <div className="p-8">
//             <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-2xl font-bold text-gray-900 font-display">Membership & Connects</h2>
//             </div>

//             <div className="space-y-8">
//                 {/* Membership Plan */}
//                 <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
//                     <div className="absolute top-0 right-0 p-3">
//                         <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wide">CURRENT PLAN</span>
//                     </div>
//                     <div className="flex justify-between items-start mb-6">
//                         <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1">Membership plan</h3>
//                         <button className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-colors border border-orange-500/20">
//                             Manage membership
//                         </button>
//                     </div>

//                     <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-8 max-w-sm">
//                         <div className="flex items-center justify-between mb-2">
//                             <h4 className="text-xl font-bold text-gray-900">Plus</h4>
//                             <FiZap className="text-orange-500 text-xl" />
//                         </div>
//                         <p className="text-lg font-semibold text-gray-900 mb-6">$10.99 <span className="text-xs font-normal text-gray-500">per month</span></p>

//                         <ul className="space-y-3">
//                             <li className="flex items-start gap-2 text-xs text-gray-600 font-medium">
//                                 <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
//                                 Win more work with competitive tools
//                             </li>
//                             <li>
//                                 <button className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider">View your plan benefits</button>
//                             </li>
//                         </ul>
//                     </div>
//                 </section>

//                 {/* Membership Cycle */}
//                 <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//                     <div className="flex justify-between items-start mb-6">
//                         <h3 className="text-base font-semibold text-gray-900">Membership cycle</h3>
//                         <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors shadow-sm ring-2 ring-white">
//                             Add billing method
//                         </button>
//                     </div>

//                     <div className="space-y-3">
//                         <p className="text-sm font-medium text-gray-900">Current cycle: <span className="text-gray-600 font-normal">Jan 11, 2026 – Feb 10, 2026</span></p>
//                         <p className="text-sm font-medium text-gray-900">Next charge: <span className="text-gray-600 font-normal">$10.99 on Feb 11, 2026</span></p>
//                         <button className="text-xs font-bold text-orange-600 hover:underline mt-2">Add promo code</button>
//                     </div>
//                     <div className="mt-6 pt-4 border-t border-gray-50">
//                         <button className="text-xs text-gray-400 hover:text-orange-600 font-medium transition-colors">Learn more about membership & billing</button>
//                     </div>
//                 </section>

//                 {/* Connects Section */}
//                 <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//                     <div className="flex justify-between items-start mb-6">
//                         <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1">Connects</h3>
//                         <button className="px-4 py-2 bg-white border border-gray-200 text-orange-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-orange-500/10">
//                             Buy Connects
//                         </button>
//                     </div>

//                     <div className="flex items-end gap-2 mb-4">
//                         <span className="text-3xl font-bold text-gray-900 tracking-tight">84</span>
//                         <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Connects balance</span>
//                     </div>

//                     <button className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:underline mb-8">
//                         <FiClock />
//                         View Connects History
//                     </button>

//                     <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100/50 relative">
//                         <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
//                             <FiPlus className="rotate-45" />
//                         </button>
//                         <div className="flex gap-4">
//                             <div className="p-2 bg-white rounded-lg shadow-sm self-start ring-1 ring-orange-500/5">
//                                 <FiZap className="text-orange-500 text-lg" />
//                             </div>
//                             <div>
//                                 <p className="text-xs font-bold text-gray-900 mb-1">Freelancer Plus tip</p>
//                                 <p className="text-xs text-gray-600 mb-3 leading-relaxed">Bid Connects to spotlight your profile and increase your chance of getting hired by up to 2x.</p>
//                                 <button className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-widest">Boost Profile</button>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus, FiClock, FiZap, FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type PlanType = 'Basic' | 'Plus' | 'Premium';

const PLAN_DATA: Record<PlanType, { price: string; monthlyConnects: number }> = {
  Basic: { price: '$0', monthlyConnects: 10 },
  Plus: { price: '$10.99', monthlyConnects: 100 },
  Premium: { price: '$49.99', monthlyConnects: 500 },
};

export default function MembershipConnects() {
  const router = useRouter();

  // ✅ State
  const [plan, setPlan] = useState<PlanType>('Basic');
  const [monthlyConnects, setMonthlyConnects] = useState(10);
  const [availableConnects, setAvailableConnects] = useState(10);
  const [usedConnects, setUsedConnects] = useState(0);

  // ✅ Load plan from localStorage
  useEffect(() => {
    const savedPlan =
      (localStorage.getItem('freelancerMembershipPlan') as PlanType) || 'Basic';

    const connects = PLAN_DATA[savedPlan].monthlyConnects;

    const used = Number(localStorage.getItem('usedConnects') || 0);

    setPlan(savedPlan);
    setMonthlyConnects(connects);
    setUsedConnects(used);
    setAvailableConnects(connects - used);
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 font-display">
          Membership & Connects
        </h2>
      </div>

      <div className="space-y-8">
        {/* Membership Plan */}
        <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wide">
              CURRENT PLAN
            </span>
          </div>

          <div className="flex justify-between items-start mb-6">
            <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1">
              Membership plan
            </h3>
            <button
              onClick={() => router.push('/freelancer-membership')}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-colors border border-orange-500/20"
            >
              Manage membership
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-8 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              {/* ✅ Dynamic plan name */}
              <h4 className="text-xl font-bold text-gray-900">{plan}</h4>
              <FiZap className="text-orange-500 text-xl" />
            </div>

            {/* ✅ Dynamic price */}
            <p className="text-lg font-semibold text-gray-900 mb-6">
              {PLAN_DATA[plan].price}{' '}
              <span className="text-xs font-normal text-gray-500">
                per month
              </span>
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                Win more work with competitive tools
              </li>
              <li>
                <button className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider">
                  View your plan benefits
                </button>
              </li>
            </ul>
          </div>
        </section>

        {/* Membership Cycle */}
        <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              Membership cycle
            </h3>
            <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors shadow-sm ring-2 ring-white">
              Add billing method
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">
              Current cycle:{' '}
              <span className="text-gray-600 font-normal">
                Jan 11, 2026 – Feb 10, 2026
              </span>
            </p>
            <p className="text-sm font-medium text-gray-900">
              Next charge:{' '}
              <span className="text-gray-600 font-normal">
                {PLAN_DATA[plan].price} on Feb 11, 2026
              </span>
            </p>
            <button className="text-xs font-bold text-orange-600 hover:underline mt-2">
              Add promo code
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-50">
            <button className="text-xs text-gray-400 hover:text-orange-600 font-medium transition-colors">
              Learn more about membership & billing
            </button>
          </div>
        </section>

        {/* Connects Section */}
        <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-base font-semibold text-gray-900 border-b-2 border-orange-500 pb-1">
              Connects
            </h3>
            <button className="px-4 py-2 bg-white border border-gray-200 text-orange-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-orange-500/10">
              Buy Connects
            </button>
          </div>

          {/* ✅ Dynamic connects balance */}
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">
              {availableConnects}
            </span>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
              Connects balance
            </span>
          </div>

          <button className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:underline mb-8">
            <FiClock />
            View Connects History
          </button>

          <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100/50 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <FiPlus className="rotate-45" />
            </button>
            <div className="flex gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm self-start ring-1 ring-orange-500/5">
                <FiZap className="text-orange-500 text-lg" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 mb-1">
                  Freelancer {plan} tip
                </p>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  Bid Connects to spotlight your profile and increase your chance
                  of getting hired by up to 2x.
                </p>
                <button className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-widest">
                  Boost Profile
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
