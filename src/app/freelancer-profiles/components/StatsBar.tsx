"use client";
import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { usegetFreelancerActivity } from '@/app/hook/useProfile';
import CardSkeleton from '@/components/Loader/Loader';

interface Stat {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}


const StatsBar = () => {
  const { data, isLoading, error } = usegetFreelancerActivity();
  const freelancerActivity = data?.freelancerActivity || [];
  const activeFreelancersRandom = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
  const totalCompletedJobsRandom = Math.floor(Math.random() * (150 - 100 + 1)) + 100;
  const averageRatingRandom = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
  const avgResponseTimeRandom = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  const stats: Stat[] = [
    {
      icon: 'UserGroupIcon',
      label: 'Active Freelancers',
      // value: freelancerActivity.activeFreelancers || '12,847',
      value: activeFreelancersRandom || '12,847',
      color: 'text-brand-blue',
    },
    {
      icon: 'BriefcaseIcon',
      label: 'Projects Completed',
      // value: freelancerActivity.totalCompletedJobs || '45,231',
      value: totalCompletedJobsRandom || '45,231',
      color: 'text-success',
    },
    {
      icon: 'StarIcon',
      label: 'Average Rating',
      // value: freelancerActivity.averageRating || '4.8',
      value: averageRatingRandom || '4.8',
      color: 'text-warning',
    },
    {
      icon: 'ClockIcon',
      label: 'Avg Response Time',
      // value: freelancerActivity.avgResponseTime || '2 hours',
      value: avgResponseTimeRandom || '2 hours',

      color: 'text-accent',
    },
  ];

  if (isLoading) {
    return (

      <CardSkeleton view="grid" count={4} />

    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3 ${stat.color}`}>
              <Icon name={stat.icon as any} size={24} />
            </div>
            <div className="text-2xl font-display font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;