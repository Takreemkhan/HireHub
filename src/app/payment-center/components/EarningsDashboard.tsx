'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '@/components/ui/AppIcon';
import Skeleton from '@/components/ui/Skeleton';

interface EarningData {
  month: string;
  earnings: number;
  projects: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const EarningsDashboard = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'6months' | '1year' | 'all'>('6months');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payment-center/stats');
      const data = await res.json();
      if (data.success) {
        setStatsData(data.stats);
      }
    } catch (e) {
      console.error('Fetch stats error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Earnings', value: `₹${(statsData?.totalEarnings || 0).toLocaleString('en-IN')}`, change: '+12.5%', icon: 'CurrencyDollarIcon', color: 'text-brand-green' },
    { label: 'This Month', value: `₹${(statsData?.thisMonthEarnings || 0).toLocaleString('en-IN')}`, change: '+16.0%', icon: 'TrendingUpIcon', color: 'text-brand-blue' },
    { label: 'Avg. Project Value', value: `₹${(Math.round(statsData?.avgProjectValue || 0)).toLocaleString('en-IN')}`, change: '+8.3%', icon: 'ChartBarIcon', color: 'text-accent' },
    { label: 'Active Projects', value: statsData?.activeProjectsCount || '0', change: '+2', icon: 'BriefcaseIcon', color: 'text-brand-coral' },
  ];

  const earningsData = statsData?.trend || [];
  const categoryData = statsData?.categories || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton variant="circle" className="h-9 w-9" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="bg-card rounded-xl p-6 border border-border">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card rounded-xl p-6 border border-border hover:shadow-brand transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-body text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <Icon name={stat.icon as any} size={20} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm font-body text-brand-green flex items-center space-x-1">
                <Icon name="ArrowTrendingUpIcon" size={16} />
                <span>{stat.change}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-display font-bold text-foreground">Earnings Trend</h2>
          <div className="flex items-center space-x-2">
            {(['6months', '1year', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-300 ${timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
              >
                {range === '6months' ? '6 Months' : range === '1year' ? '1 Year' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full h-80" aria-label="Earnings trend line chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line type="monotone" dataKey="earnings" stroke="#1B365D" strokeWidth={3} dot={{ fill: '#1B365D', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">Projects by Month</h2>
          <div className="w-full h-64" aria-label="Projects by month bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
                <Bar dataKey="projects" fill="#4299E1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">Earnings by Category</h2>
          <div className="w-full h-64" aria-label="Earnings by category pie chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry: CategoryData, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;