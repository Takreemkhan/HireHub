'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Notification {
  id: string;
  type: 'message' | 'payment' | 'milestone' | 'deadline' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationCenter = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationCenterProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return 'ChatBubbleLeftIcon';
      case 'payment':
        return 'CreditCardIcon';
      case 'milestone':
        return 'CheckCircleIcon';
      case 'deadline':
        return 'ClockIcon';
      case 'system':
        return 'BellIcon';
      default:
        return 'BellIcon';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'payment':
        return 'bg-green-100 text-green-600';
      case 'milestone':
        return 'bg-purple-100 text-purple-600';
      case 'deadline':
        return 'bg-yellow-100 text-yellow-600';
      case 'system':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-40 mb-6" />
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-display font-bold text-foreground">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-accent text-white text-xs font-medium rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-primary font-medium hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            filter === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-opacity-80'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            filter === 'unread' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-opacity-80'
          }`}
        >
          Unread
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
              notification.read
                ? 'border-border bg-card' :'border-primary bg-blue-50'
            }`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                  notification.type
                )}`}
              >
                <Icon name={getNotificationIcon(notification.type) as any} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;