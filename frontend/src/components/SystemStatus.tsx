'use client';

import { Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface SystemStatusProps {
  isConnected: boolean;
  status: 'online' | 'warning' | 'critical';
  flowRate: number;
  leakProbability: number;
}

export default function SystemStatus({
  isConnected,
  status,
  flowRate,
  leakProbability,
}: SystemStatusProps) {
  const getStatusColor = () => {
    if (!isConnected) return 'from-red-500 to-red-600';
    if (status === 'critical') return 'from-red-500 to-red-600';
    if (status === 'warning') return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getStatusLabel = () => {
    if (!isConnected) return 'OFFLINE';
    if (status === 'critical') return 'CRITICAL LEAK';
    if (status === 'warning') return 'WARNING';
    return 'ONLINE';
  };

  const getStatusIcon = () => {
    if (status === 'critical') return <AlertTriangle className="w-6 h-6" />;
    if (status === 'warning') return <AlertTriangle className="w-6 h-6" />;
    return <CheckCircle className="w-6 h-6" />;
  };

  const getPulseAnimation = () => {
    if (status === 'critical') return 'animate-pulse';
    if (status === 'warning') return '';
    return 'animate-pulse';
  };

  return (
    <div className={`relative bg-gradient-to-r ${getStatusColor()} rounded-lg shadow-lg p-6 text-white overflow-hidden`}>
      {/* Animated background glow */}
      {status === 'critical' && (
        <div className="absolute inset-0 animate-pulse bg-red-400 opacity-20" />
      )}
      {status === 'warning' && (
        <div className="absolute inset-0 animate-pulse bg-yellow-400 opacity-10" />
      )}
      {status === 'online' && (
        <div className="absolute inset-0 animate-pulse bg-green-400 opacity-10" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${getPulseAnimation()}`}>
              {getStatusIcon()}
            </div>
            <h3 className="text-2xl font-bold">{getStatusLabel()}</h3>
          </div>
          <Zap className="w-8 h-8 opacity-80" />
        </div>

        {/* Status Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Flow Rate</p>
            <p className="text-xl font-bold">{flowRate.toFixed(1)} L/min</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Leak Risk</p>
            <p className="text-xl font-bold">{leakProbability}%</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-4 text-sm opacity-90">
          {!isConnected && 'Waiting for connection...'}
          {isConnected && status === 'online' && 'All systems nominal'}
          {isConnected && status === 'warning' && 'Abnormal flow detected - monitoring'}
          {isConnected && status === 'critical' && 'CRITICAL LEAK - Valve closing automatically'}
        </div>
      </div>
    </div>
  );
}
