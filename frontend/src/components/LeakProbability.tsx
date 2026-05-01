'use client';

import { Brain, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LeakProbabilityProps {
  probability: number; // 0-100
  severity: 'normal' | 'warning' | 'critical';
  reason: string;
  recommendedAction: string;
}

export default function LeakProbability({
  probability,
  severity,
  reason,
  recommendedAction,
}: LeakProbabilityProps) {
  const getColorScheme = () => {
    if (severity === 'critical') return 'border-red-300 bg-red-50';
    if (severity === 'warning') return 'border-yellow-300 bg-yellow-50';
    return 'border-green-300 bg-green-50';
  };

  const getIconColor = () => {
    if (severity === 'critical') return 'text-red-600';
    if (severity === 'warning') return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (probability >= 60) return 'bg-red-500';
    if (probability >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAIStatus = () => {
    if (probability === 0) return 'Monitoring';
    if (probability < 30) return 'Low Risk';
    if (probability < 60) return 'Elevated Risk';
    if (probability < 85) return 'Leak Suspected';
    return 'CRITICAL LEAK';
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getColorScheme()} transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-4">
        <Brain className={`w-6 h-6 ${getIconColor()}`} />
        <h3 className="text-lg font-bold text-slate-900">AI Analysis</h3>
      </div>

      {/* Leak Probability Meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Leak Probability</span>
          <span className="text-2xl font-bold text-slate-900">{probability}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${probability}%` }}
          />
        </div>
      </div>

      {/* AI Status Badge */}
      <div className="mb-4 inline-block">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            severity === 'critical'
              ? 'bg-red-200 text-red-900'
              : severity === 'warning'
              ? 'bg-yellow-200 text-yellow-900'
              : 'bg-green-200 text-green-900'
          }`}
        >
          {getAIStatus()}
        </span>
      </div>

      {/* Analysis Details */}
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Detection Reason</p>
          <p className="text-sm text-slate-700">{reason}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Recommended Action</p>
          <p className="text-sm text-slate-700 flex items-center gap-2">
            {severity === 'normal' ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            {recommendedAction}
          </p>
        </div>
      </div>

      {/* Confidence Note */}
      <div className="text-xs text-slate-600 border-t pt-3">
        <span className="font-semibold">Confidence:</span> Based on real-time flow analysis,
        threshold comparison, and trend detection
      </div>
    </div>
  );
}
