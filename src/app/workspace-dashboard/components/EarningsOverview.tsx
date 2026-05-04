import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface EarningsStat {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface EarningsOverviewProps {
  stats: EarningsStat[];
}

const EarningsOverview = ({ stats }: EarningsOverviewProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">
          Earnings Overview
        </h2>
        <button className="text-sm text-primary font-medium hover:underline">
          View Details
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center`}>
                <Icon name={stat.icon as any} size={16} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground mb-2">
              {stat.value}
            </p>
            <div className="flex items-center gap-1">
              <Icon
                name={stat.change >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'}
                size={16}
                className={stat.change >= 0 ? 'text-green-600' : 'text-red-600'}
              />
              <span
                className={`text-sm font-medium ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(stat.change)}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsOverview;