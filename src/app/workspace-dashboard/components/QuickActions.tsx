'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface QuickActionsProps {
  onActionClick: (actionId: string) => void;
}

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const actions: QuickAction[] = [
    {
      id: 'message',
      label: 'Send Message',
      icon: 'ChatBubbleLeftEllipsisIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'time',
      label: 'Log Time',
      icon: 'ClockIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'file',
      label: 'Upload File',
      icon: 'ArrowUpTrayIcon',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'invoice',
      label: 'Create Invoice',
      icon: 'DocumentTextIcon',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.id)}
            className="flex flex-col items-center justify-center p-6 rounded-lg border border-border hover:shadow-brand transition-all duration-300 group"
          >
            <div
              className={`w-12 h-12 rounded-full ${action.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon name={action.icon as any} size={24} className={action.color} />
            </div>
            <span className="text-sm font-medium text-foreground text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;