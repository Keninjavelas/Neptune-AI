'use client';

import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Alert {
  id: string;
  timestamp: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

interface AlertsFeedProps {
  alerts: Alert[];
}

export default function AlertsFeed({ alerts }: AlertsFeedProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
        <p className="text-slate-600">No active alerts</p>
        <p className="text-sm text-slate-500 mt-1">System is operating normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
            alert.severity === 'critical'
              ? 'bg-red-50 border-red-500'
              : alert.severity === 'warning'
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-blue-50 border-blue-500'
          }`}
        >
          <div className="mt-0.5">
            {alert.severity === 'critical' ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : alert.severity === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            ) : (
              <Info className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">{alert.message}</p>
            <p className="text-xs text-slate-600 mt-1">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
