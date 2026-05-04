'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProjectHeaderProps {
  title: string;
  category: string;
  postedDate: string;
  budget: string;
  budgetType: string;
  experienceLevel: string;
  projectLength: string;
  timeCommitment: string;
}

const ProjectHeader = ({
  title,
  category,
  postedDate,
  budget,
  budgetType,
  experienceLevel,
  projectLength,
  timeCommitment,
}: ProjectHeaderProps) => {
  return (
    <div className="bg-card rounded-lg shadow-brand p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {category}
            </span>
            <span className="text-sm text-muted-foreground">{postedDate}</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            {title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon name="CurrencyDollarIcon" size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="font-semibold text-foreground">{budget}</p>
            <p className="text-xs text-muted-foreground">{budgetType}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 bg-brand-blue/10 rounded-lg">
            <Icon name="AcademicCapIcon" size={20} className="text-brand-blue" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Experience</p>
            <p className="font-semibold text-foreground">{experienceLevel}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 bg-brand-green/10 rounded-lg">
            <Icon name="ClockIcon" size={20} className="text-brand-green" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Project Length</p>
            <p className="font-semibold text-foreground">{projectLength}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 bg-brand-coral/10 rounded-lg">
            <Icon name="CalendarIcon" size={20} className="text-brand-coral" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time Commitment</p>
            <p className="font-semibold text-foreground">{timeCommitment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;