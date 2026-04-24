'use client';

import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import EarningsOverview from './EarningsOverview';
import UpcomingDeadlines from './UpcomingDeadlines';
import TimeTracker from './TimeTracker';
import NotificationCenter from './NotificationCenter';

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
  milestones: Array<{
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'pending';
    dueDate: string;
    amount: number;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    alt: string;
  }>;
  unreadMessages: number;
  tasksCompleted: number;
  totalTasks: number;
}

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

interface Deadline {
  id: string;
  project: string;
  task: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'overdue';
}

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  duration: number;
  date: string;
}

interface Notification {
  id: string;
  type: 'message' | 'payment' | 'milestone' | 'deadline' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const WorkspaceDashboardInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'activity'>('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    setNotifications(mockNotifications);
  }, []);

  const mockProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'E-Commerce Platform Redesign',
    client: 'TechRetail Inc.',
    status: 'active',
    progress: 68,
    budget: 45000,
    spent: 30600,
    deadline: 'Jan 15, 2026',
    priority: 'high',
    milestones: [
    {
      id: 'm1',
      title: 'Design Phase',
      status: 'completed',
      dueDate: 'Dec 20, 2025',
      amount: 15000
    },
    {
      id: 'm2',
      title: 'Development Phase',
      status: 'in-progress',
      dueDate: 'Jan 10, 2026',
      amount: 20000
    }],

    team: [
    {
      id: 't1',
      name: 'Sarah Johnson',
      role: 'UI Designer',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fb6cf439-1763299224286.png",
      alt: 'Professional woman with brown hair in white blouse smiling at camera'
    },
    {
      id: 't2',
      name: 'Michael Chen',
      role: 'Frontend Developer',
      avatar: "https://images.unsplash.com/photo-1623685463489-bb0e546f3f5a",
      alt: 'Asian man with glasses in blue shirt working on laptop'
    },
    {
      id: 't3',
      name: 'Emily Rodriguez',
      role: 'Backend Developer',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19dc372df-1763294269106.png",
      alt: 'Hispanic woman with long dark hair in professional attire'
    }],

    unreadMessages: 3,
    tasksCompleted: 24,
    totalTasks: 35
  },
  {
    id: 'proj-002',
    title: 'Mobile App Development',
    client: 'HealthTech Solutions',
    status: 'review',
    progress: 92,
    budget: 60000,
    spent: 55200,
    deadline: 'Jan 8, 2026',
    priority: 'medium',
    milestones: [
    {
      id: 'm3',
      title: 'MVP Development',
      status: 'completed',
      dueDate: 'Dec 15, 2025',
      amount: 40000
    },
    {
      id: 'm4',
      title: 'Testing & QA',
      status: 'in-progress',
      dueDate: 'Jan 5, 2026',
      amount: 15000
    }],

    team: [
    {
      id: 't4',
      name: 'David Kim',
      role: 'Mobile Developer',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_187328f57-1763296745049.png",
      alt: 'Young Asian man in casual shirt smiling outdoors'
    },
    {
      id: 't5',
      name: 'Lisa Anderson',
      role: 'QA Engineer',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13f77cfee-1763296235667.png",
      alt: 'Blonde woman in business casual attire with confident expression'
    }],

    unreadMessages: 1,
    tasksCompleted: 46,
    totalTasks: 50
  },
  {
    id: 'proj-003',
    title: 'Brand Identity Package',
    client: 'StartupVentures LLC',
    status: 'active',
    progress: 45,
    budget: 25000,
    spent: 11250,
    deadline: 'Jan 25, 2026',
    priority: 'low',
    milestones: [
    {
      id: 'm5',
      title: 'Logo Design',
      status: 'completed',
      dueDate: 'Dec 28, 2025',
      amount: 8000
    },
    {
      id: 'm6',
      title: 'Brand Guidelines',
      status: 'in-progress',
      dueDate: 'Jan 15, 2026',
      amount: 12000
    }],

    team: [
    {
      id: 't6',
      name: 'Alex Thompson',
      role: 'Brand Designer',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1994297d6-1763294588832.png",
      alt: 'Young professional man with beard in navy blazer'
    }],

    unreadMessages: 0,
    tasksCompleted: 12,
    totalTasks: 28
  }];


  const mockActivities: Activity[] = [
  {
    id: 'act-001',
    type: 'milestone',
    user: 'Sarah Johnson',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fb6cf439-1763299224286.png",
    alt: 'Professional woman with brown hair in white blouse smiling at camera',
    action: 'completed milestone "Design Phase"',
    project: 'E-Commerce Platform Redesign',
    timestamp: '2 hours ago',
    details: 'All design mockups approved by client'
  },
  {
    id: 'act-002',
    type: 'payment',
    user: 'TechRetail Inc.',
    avatar: "https://images.unsplash.com/photo-1602917058415-d86121146559",
    alt: 'Modern office building with glass facade',
    action: 'released payment of $15,000',
    project: 'E-Commerce Platform Redesign',
    timestamp: '4 hours ago'
  },
  {
    id: 'act-003',
    type: 'message',
    user: 'Michael Chen',
    avatar: "https://images.unsplash.com/photo-1623685463489-bb0e546f3f5a",
    alt: 'Asian man with glasses in blue shirt working on laptop',
    action: 'sent you a message',
    project: 'E-Commerce Platform Redesign',
    timestamp: '5 hours ago',
    details: 'Need clarification on API integration requirements'
  },
  {
    id: 'act-004',
    type: 'file',
    user: 'David Kim',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_187328f57-1763296745049.png",
    alt: 'Young Asian man in casual shirt smiling outdoors',
    action: 'uploaded new files',
    project: 'Mobile App Development',
    timestamp: '1 day ago',
    details: 'Final build APK and documentation'
  },
  {
    id: 'act-005',
    type: 'task',
    user: 'Alex Thompson',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1994297d6-1763294588832.png",
    alt: 'Young professional man with beard in navy blazer',
    action: 'completed task "Logo Variations"',
    project: 'Brand Identity Package',
    timestamp: '1 day ago'
  }];


  const mockEarningsStats = [
  {
    label: 'Total Earnings',
    value: '$127,450',
    change: 12.5,
    icon: 'CurrencyDollarIcon',
    color: 'bg-green-600'
  },
  {
    label: 'This Month',
    value: '$18,200',
    change: 8.3,
    icon: 'CalendarIcon',
    color: 'bg-blue-600'
  },
  {
    label: 'Pending',
    value: '$9,500',
    change: -3.2,
    icon: 'ClockIcon',
    color: 'bg-yellow-600'
  },
  {
    label: 'Available',
    value: '$8,700',
    change: 15.7,
    icon: 'BanknotesIcon',
    color: 'bg-purple-600'
  }];


  const mockDeadlines: Deadline[] = [
  {
    id: 'dl-001',
    project: 'E-Commerce Platform Redesign',
    task: 'Complete checkout flow implementation',
    dueDate: 'Jan 10, 2026',
    priority: 'high',
    status: 'on-track'
  },
  {
    id: 'dl-002',
    project: 'Mobile App Development',
    task: 'Submit final build to app stores',
    dueDate: 'Jan 8, 2026',
    priority: 'high',
    status: 'at-risk'
  },
  {
    id: 'dl-003',
    project: 'Brand Identity Package',
    task: 'Deliver brand guidelines document',
    dueDate: 'Jan 15, 2026',
    priority: 'medium',
    status: 'on-track'
  },
  {
    id: 'dl-004',
    project: 'E-Commerce Platform Redesign',
    task: 'Client review meeting',
    dueDate: 'Jan 12, 2026',
    priority: 'medium',
    status: 'on-track'
  }];


  const mockTimeEntries: TimeEntry[] = [
  {
    id: 'te-001',
    project: 'E-Commerce Platform Redesign',
    task: 'Frontend development',
    duration: 14400,
    date: 'Today'
  },
  {
    id: 'te-002',
    project: 'Mobile App Development',
    task: 'Bug fixes',
    duration: 10800,
    date: 'Today'
  },
  {
    id: 'te-003',
    project: 'Brand Identity Package',
    task: 'Design revisions',
    duration: 7200,
    date: 'Yesterday'
  }];


  const mockNotifications: Notification[] = [
  {
    id: 'not-001',
    type: 'payment',
    title: 'Payment Received',
    message: 'TechRetail Inc. released $15,000 for milestone completion',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'not-002',
    type: 'message',
    title: 'New Message',
    message: 'Michael Chen sent you a message about API integration',
    timestamp: '5 hours ago',
    read: false
  },
  {
    id: 'not-003',
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: 'Mobile App Development final build due in 6 days',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: 'not-004',
    type: 'milestone',
    title: 'Milestone Approved',
    message: 'Client approved "Design Phase" milestone',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: 'not-005',
    type: 'system',
    title: 'Profile Update',
    message: 'Your profile has been viewed 24 times this week',
    timestamp: '2 days ago',
    read: true
  }];


  const handleQuickAction = (actionId: string) => {
    console.log('Quick action clicked:', actionId);
  };

  const handleStartTimer = (project: string, task: string) => {
    console.log('Timer started:', project, task);
  };

  const handleStopTimer = () => {
    console.log('Timer stopped');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
    prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded" />
                <div className="h-64 bg-muted rounded" />
              </div>
              <div className="space-y-6">
                <div className="h-96 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Workspace Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your projects, track time, and stay on top of deadlines
          </p>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
            activeTab === 'overview' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-foreground hover:bg-muted border border-border'}`
            }>

            Overview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
            activeTab === 'projects' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-foreground hover:bg-muted border border-border'}`
            }>

            Projects
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
            activeTab === 'activity' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-foreground hover:bg-muted border border-border'}`
            }>

            Activity
          </button>
        </div>

        {activeTab === 'overview' &&
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <EarningsOverview stats={mockEarningsStats} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickActions onActionClick={handleQuickAction} />
                <UpcomingDeadlines deadlines={mockDeadlines} />
              </div>

              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  Active Projects
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {mockProjects.
                filter((p) => p.status === 'active').
                map((project) =>
                <ProjectCard key={project.id} project={project} />
                )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <TimeTracker
              entries={mockTimeEntries}
              onStartTimer={handleStartTimer}
              onStopTimer={handleStopTimer} />

              <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead} />

            </div>
          </div>
        }

        {activeTab === 'projects' &&
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {mockProjects.map((project) =>
            <ProjectCard key={project.id} project={project} />
            )}
            </div>
          </div>
        }

        {activeTab === 'activity' &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActivityFeed activities={mockActivities} />
            <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead} />

          </div>
        }
      </div>
    </div>);

};

export default WorkspaceDashboardInteractive;