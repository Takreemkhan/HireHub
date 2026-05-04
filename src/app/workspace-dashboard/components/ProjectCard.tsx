import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  amount: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
}

interface Project {
  id: string;
  title: string;
  client: string;
  status: 'active' | 'review' | 'completed';
  progress: number;
  budget: number;
  spent: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  milestones: Milestone[];
  team: TeamMember[];
  unreadMessages: number;
  tasksCompleted: number;
  totalTasks: number;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-brand transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-display font-semibold text-foreground">
              {project.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Client: {project.client}</p>
        </div>
        <Icon
          name="FlagIcon"
          size={20}
          className={getPriorityColor(project.priority)}
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Budget</p>
          <p className="text-sm font-semibold text-foreground">
            ${project.budget.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Spent</p>
          <p className="text-sm font-semibold text-foreground">
            ${project.spent.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Deadline</p>
          <p className="text-sm font-medium text-foreground">{project.deadline}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Tasks</p>
          <p className="text-sm font-medium text-foreground">
            {project.tasksCompleted}/{project.totalTasks}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex -space-x-2">
          {project.team.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="relative w-8 h-8 rounded-full border-2 border-card overflow-hidden"
              title={member.name}
            >
              <AppImage
                src={member.avatar}
                alt={member.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {project.team.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center">
              <span className="text-xs font-medium text-foreground">
                +{project.team.length - 3}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.unreadMessages > 0 && (
            <div className="relative">
              <Icon name="ChatBubbleLeftIcon" size={20} className="text-primary" />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {project.unreadMessages}
              </span>
            </div>
          )}
          <Link
            href={`/workspace-dashboard?project=${project.id}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;