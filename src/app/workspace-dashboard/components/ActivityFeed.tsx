import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Activity {
  id: string;
  type: 'message' | 'milestone' | 'payment' | 'file' | 'task';
  user: string;
  avatar: string;
  alt: string;
  action: string;
  project: string;
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return 'ChatBubbleLeftIcon';
      case 'milestone':
        return 'CheckCircleIcon';
      case 'payment':
        return 'CreditCardIcon';
      case 'file':
        return 'DocumentIcon';
      case 'task':
        return 'ClipboardDocumentCheckIcon';
      default:
        return 'BellIcon';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'milestone':
        return 'bg-green-100 text-green-600';
      case 'payment':
        return 'bg-purple-100 text-purple-600';
      case 'file':
        return 'bg-yellow-100 text-yellow-600';
      case 'task':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <AppImage
                  src={activity.avatar}
                  alt={activity.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${getActivityColor(
                  activity.type
                )}`}
              >
                <Icon name={getActivityIcon(activity.type) as any} size={14} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{activity.user}</span>{' '}
                {activity.action}
              </p>
              <p className="text-sm text-primary font-medium mt-1">
                {activity.project}
              </p>
              {activity.details && (
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.details}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;