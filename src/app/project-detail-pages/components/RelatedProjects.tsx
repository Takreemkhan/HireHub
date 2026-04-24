import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface RelatedProject {
  id: number;
  title: string;
  category: string;
  budget: string;
  budgetType: string;
  postedDate: string;
  proposalCount: number;
  skills: string[];
}

interface RelatedProjectsProps {
  projects: RelatedProject[];
}

const RelatedProjects = ({ projects }: RelatedProjectsProps) => {
  return (
    <div className="bg-card rounded-lg shadow-brand p-6">
      <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center">
        <Icon name="SparklesIcon" size={24} className="mr-2 text-accent" />
        Similar Projects You Might Like
      </h2>

      <div className="space-y-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href="/project-detail-pages"
            className="block p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary/10 text-secondary">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{project.postedDate}</span>
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="CurrencyDollarIcon" size={16} className="text-accent" />
                  <span className="text-sm font-semibold text-foreground">{project.budget}</span>
                  <span className="text-xs text-muted-foreground">({project.budgetType})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="DocumentTextIcon" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.proposalCount} proposals
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted text-foreground"
                >
                  {skill}
                </span>
              ))}
              {project.skills.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-muted-foreground">
                  +{project.skills.length - 4} more
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/search-and-discovery"
        className="mt-4 flex items-center justify-center space-x-2 w-full px-4 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <span>Browse All Projects</span>
        <Icon name="ArrowRightIcon" size={18} />
      </Link>
    </div>
  );
};

export default RelatedProjects;