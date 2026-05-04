'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  duration: number;
  date: string;
}

interface TimeTrackerProps {
  entries: TimeEntry[];
  onStartTimer: (project: string, task: string) => void;
  onStopTimer: () => void;
}

const TimeTracker = ({ entries, onStartTimer, onStopTimer }: TimeTrackerProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isHydrated]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isTracking) {
      setIsTracking(false);
      onStopTimer();
      setCurrentTime(0);
    } else {
      if (selectedProject && selectedTask) {
        setIsTracking(true);
        onStartTimer(selectedProject, selectedTask);
      }
    }
  };

  const totalHours = entries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-6" />
          <div className="h-24 bg-muted rounded mb-4" />
          <div className="space-y-3">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">
        Time Tracker
      </h2>

      <div className="bg-muted rounded-lg p-6 mb-6">
        <div className="text-center mb-4">
          <p className="text-4xl font-display font-bold text-foreground mb-2">
            {formatTime(currentTime)}
          </p>
          <p className="text-sm text-muted-foreground">
            {isTracking ? 'Tracking time...' : 'Ready to track'}
          </p>
        </div>

        {!isTracking && (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Project name"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Task description"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        <button
          onClick={handleStartStop}
          disabled={!isTracking && (!selectedProject || !selectedTask)}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            isTracking
              ? 'bg-red-600 text-white hover:bg-red-700' :'bg-primary text-primary-foreground hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          <Icon name={isTracking ? 'StopIcon' : 'PlayIcon'} size={20} />
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Recent Entries</h3>
          <span className="text-sm text-muted-foreground">
            Total: {totalHours.toFixed(1)}h
          </span>
        </div>
        {entries.slice(0, 3).map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{entry.task}</p>
              <p className="text-xs text-muted-foreground">{entry.project}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {(entry.duration / 3600).toFixed(1)}h
              </p>
              <p className="text-xs text-muted-foreground">{entry.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTracker;