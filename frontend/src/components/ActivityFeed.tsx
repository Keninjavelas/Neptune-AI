'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Zap, Droplet } from 'lucide-react';

export interface ActivityEvent {
  id: string;
  timestamp: number;
  type: 'info' | 'warning' | 'critical' | 'action';
  title: string;
  message: string;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest event
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'action':
        return <Zap className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      case 'action':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      default:
        return 'border-green-200 bg-green-50 hover:bg-green-100';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
        <Droplet className="w-12 h-12 mb-3 opacity-30" />
        <p>Waiting for system events...</p>
      </div>
    );
  }

  return (
    <div
      ref={feedRef}
      className="space-y-2 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
    >
      {events.map((event, idx) => (
        <div
          key={event.id}
          className={`border-l-4 p-3 rounded-lg transition-all duration-300 transform ${getEventColor(
            event.type
          )} ${idx === events.length - 1 ? 'ring-2 ring-slate-400 ring-opacity-50' : ''}`}
          style={{
            animation: idx === events.length - 1 ? 'slideIn 0.3s ease-out' : 'none',
          }}
        >
          <div className="flex gap-3 items-start">
            <div className="mt-0.5 flex-shrink-0">{getIcon(event.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="font-semibold text-slate-900 text-sm">{event.title}</p>
                <span className="text-xs text-slate-600 whitespace-nowrap">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <p className="text-sm text-slate-700">{event.message}</p>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
