import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Deadline {
  id: string;
  project: string;
  task: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'overdue';
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

const UpcomingDeadlines = ({ deadlines }: UpcomingDeadlinesProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600 bg-green-100';
      case 'at-risk':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'ExclamationCircleIcon';
      case 'medium':
        return 'MinusCircleIcon';
      case 'low':
        return 'InformationCircleIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">
          Upcoming Deadlines
        </h2>
        <Icon name="CalendarIcon" size={24} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="p-4 rounded-lg border border-border hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {deadline.task}
                </h3>
                <p className="text-xs text-muted-foreground">{deadline.project}</p>
              </div>
              <Icon
                name={getPriorityIcon(deadline.priority) as any}
                size={20}
                className={
                  deadline.priority === 'high' ?'text-red-600'
                    : deadline.priority === 'medium' ?'text-yellow-600' :'text-green-600'
                }
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Icon name="ClockIcon" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{deadline.dueDate}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  deadline.status
                )}`}
              >
                {deadline.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;