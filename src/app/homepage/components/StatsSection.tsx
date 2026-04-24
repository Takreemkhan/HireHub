// import React from 'react';
// import Icon from '@/components/ui/AppIcon';

// interface StatItem {
//   icon: string;
//   value: string;
//   label: string;
//   color: string;
// }

// const StatsSection = () => {
//   const stats: StatItem[] = [
//     {
//       icon: 'BriefcaseIcon',
//       value: '50,000+',
//       label: 'Projects Completed',
//       color: 'text-success',
//     },
//     {
//       icon: 'CurrencyDollarIcon',
//       value: '$250M+',
//       label: 'Payments Processed',
//       color: 'text-brand-blue',
//     },
//     {
//       icon: 'UserGroupIcon',
//       value: '25,000+',
//       label: 'Active Freelancers',
//       color: 'text-accent',
//     },
//     {
//       icon: 'StarIcon',
//       value: '4.9/5',
//       label: 'User Satisfaction',
//       color: 'text-warning',
//     },
//   ];

//   return (
//     <section className="bg-muted py-16 lg:py-24">
//       <div className="max-w-7xl mx-auto px-4 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl lg:text-4xl font-display font-bold text-primary mb-4">
//             Trusted by Professionals Worldwide
//           </h2>
//           <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
//             Real-time platform statistics showcasing our commitment to excellence and success
//           </p>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               className="bg-card rounded-xl shadow-brand p-8 text-center hover:shadow-brand-lg transition-all duration-300 hover:scale-105"
//             >
//               <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 ${stat.color}`}>
//                 <Icon name={stat.icon as any} size={32} variant="solid" />
//               </div>
//               <p className="text-4xl font-display font-bold text-primary mb-2">{stat.value}</p>
//               <p className="text-sm font-body text-muted-foreground">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StatsSection;


'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatItem {
  icon: string;
  value: string;
  numericValue: number;
  label: string;
  suffix: string;
  color: string;
  bgColor: string;
}

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<{ [key: number]: number }>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatItem[] = [
    {
      icon: 'BriefcaseIcon',
      value: '50,000+',
      numericValue: 50000,
      suffix: '+',
      label: 'Projects Completed',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: 'CurrencyDollarIcon',
      value: '$250M+',
      numericValue: 250,
      suffix: 'M+',
      label: 'Payments Processed',
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
    },
    {
      icon: 'UserGroupIcon',
      value: '25,000+',
      numericValue: 25000,
      suffix: '+',
      label: 'Active Freelancers',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: 'StarIcon',
      value: '4.9/5',
      numericValue: 4.9,
      suffix: '/5',
      label: 'User Satisfaction',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.numericValue / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCounts((prev) => ({
            ...prev,
            [index]: Math.min(increment * currentStep, stat.numericValue),
          }));
        } else {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    });
  }, [isVisible]);

  const formatCount = (count: number, stat: StatItem) => {
    if (stat.suffix === 'M+') {
      return `$${Math.floor(count)}M+`;
    } else if (stat.suffix === '/5') {
      return count.toFixed(1);
    } else if (stat.suffix === '+') {
      return `${Math.floor(count).toLocaleString()}+`;
    }
    return count.toString();
  };

  return (
    <section ref={sectionRef} className="bg-muted py-20 lg:py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-primary mb-6">
            <Icon name="ChartBarIcon" size={20} />
            <span className="text-sm font-body font-semibold">Platform Statistics</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-6">
            Trusted by Professionals{' '}
            <span className="text-accent">Worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto leading-relaxed">
            Real-time platform statistics showcasing our commitment to excellence and the success of our community
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl shadow-brand p-8 text-center hover:shadow-brand-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-border relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={stat.icon as any} size={40} className={stat.color} variant="solid" />
                </div>

                {/* Animated Counter */}
                <div className="mb-4">
                  <p className={`text-5xl font-display font-bold ${stat.color} transition-all duration-300 group-hover:scale-110`}>
                    {isVisible && counts[index] !== undefined
                      ? formatCount(counts[index], stat)
                      : stat.value}
                  </p>
                </div>

                {/* Label */}
                <p className="text-base font-body text-muted-foreground font-medium">
                  {stat.label}
                </p>

                {/* Decorative Line */}
                <div className={`w-16 h-1 ${stat.color.replace('text-', 'bg-')} mx-auto mt-4 rounded-full group-hover:w-full transition-all duration-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Statement */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-card rounded-2xl shadow-brand px-8 py-6 border border-border">
            <div className="flex items-center space-x-3">
              <div className="bg-success/10 p-3 rounded-xl">
                <Icon name="ShieldCheckIcon" size={28} className="text-success" variant="solid" />
              </div>
              <div className="text-left">
                <p className="text-lg font-display font-bold text-primary">Enterprise-Grade Security</p>
                <p className="text-sm text-muted-foreground font-body">SOC 2 Type II Certified</p>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border"></div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-brand-blue/10 p-3 rounded-xl">
                <Icon name="BanknotesIcon" size={28} className="text-brand-blue" variant="solid" />
              </div>
              <div className="text-left">
                <p className="text-lg font-display font-bold text-primary">Payment Protection</p>
                <p className="text-sm text-muted-foreground font-body">100% Secure Transactions</p>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border"></div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-accent/10 p-3 rounded-xl">
                <Icon name="ClockIcon" size={28} className="text-accent" variant="solid" />
              </div>
              <div className="text-left">
                <p className="text-lg font-display font-bold text-primary">24/7 Support</p>
                <p className="text-sm text-muted-foreground font-body">Always Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;