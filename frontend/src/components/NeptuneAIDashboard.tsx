'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Zap,
  Droplet,
  AlertCircle,
  CheckCircle2,
  Gauge,
  Brain,
  Activity,
} from 'lucide-react';
import { useTelemetry } from '@/context/TelemetryContext';
import { THRESHOLDS } from '@/lib/constants/thresholds';

const InfrastructureNodeMap = dynamic(() => import('@/components/InfrastructureNodeMap'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
        Infrastructure Node Map
      </p>
      <div className="mt-4 flex h-[520px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/60">
        <p className="text-sm text-slate-400">Initializing tactical map...</p>
      </div>
    </div>
  ),
});

/**
 * Neptune AI - Dark Mode Water Leak Detection Dashboard
 * Real-time IoT telemetry visualization with valve control
 */

interface FlowDataPoint {
  timestamp: number;
  flow: number;
}

interface SystemEvent {
  id: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical' | 'success';
  message: string;
}

interface AIStatus {
  state: 'monitoring' | 'analyzing' | 'responding' | 'stabilizing';
  leakProbability: number;
  confidence: number;
  decision: string;
}

interface NeptuneAIDashboardProps {
  onlineStatus?: 'online' | 'offline';
  flowRate?: number;
  valveAngle?: number;
  activeAlerts?: number;
  flowData?: FlowDataPoint[];
}

/**
 * Activity Feed Component
 */
function ActivityFeed({ events }: { events: SystemEvent[] }) {
  const feedRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [events]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'success':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 flex-shrink-0" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4 flex-shrink-0 animate-pulse" />;
      default:
        return <Activity className="w-4 h-4 flex-shrink-0" />;
    }
  };

  return (
    <div
      ref={feedRef}
      className="space-y-2 max-h-56 overflow-y-auto scrollbar-hide"
    >
      {events.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          Awaiting system events...
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className={`p-3 rounded-lg border animate-slide-in ${getSeverityColor(event.severity)}`}
          >
            <div className="flex items-start gap-2">
              {getSeverityIcon(event.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold leading-tight">
                    {event.message}
                  </p>
                  <span className="text-xs opacity-70 flex-shrink-0">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/**
 * AI Status Card Component
 */
function AIStatusCard({ aiStatus }: { aiStatus: AIStatus }) {
  const getStatusColor = (state: string) => {
    switch (state) {
      case 'monitoring':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'analyzing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'responding':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'stabilizing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Brain className="w-5 h-5 text-cyan-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-50">AI Engine</h2>
      </div>

      <div className="space-y-4">
        {/* AI Status */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
            Status
          </p>
          <div className={`inline-block px-3 py-1.5 rounded-lg border ${getStatusColor(aiStatus.state)}`}>
            <span className="text-sm font-semibold capitalize">
              {aiStatus.state.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Leak Probability */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Leak Probability
            </p>
            <p className="text-sm font-bold text-cyan-500">
              {aiStatus.leakProbability.toFixed(0)}%
            </p>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all duration-500"
              style={{ width: `${aiStatus.leakProbability}%` }}
            />
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Confidence
            </p>
            <p className="text-sm font-bold text-cyan-500">
              {(aiStatus.confidence * 100).toFixed(0)}%
            </p>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${aiStatus.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Decision */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Current Decision
          </p>
          <p className="text-sm text-slate-50 font-semibold">
            {aiStatus.decision}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * System Health Card Component
 */
function SystemHealthCard({
  health,
  riskLevel,
}: {
  health: number;
  riskLevel: 'low' | 'medium' | 'high';
}) {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'text-emerald-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getRiskBgColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'bg-emerald-500/20 border-emerald-500/30';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'high':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-slate-700/50 border-slate-600/30';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-slate-50 mb-5">
        Infrastructure Health
      </h2>

      <div className="space-y-4">
        {/* Health Percentage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              System Health
            </p>
            <p className="text-2xl font-bold text-cyan-500">
              {health.toFixed(0)}%
            </p>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 shadow-lg shadow-emerald-500/50"
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className={`border rounded-lg p-3 ${getRiskBgColor()}`}>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Leak Risk
          </p>
          <p className={`text-lg font-bold ${getRiskColor()} capitalize`}>
            {riskLevel}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
          <div
            className={`w-3 h-3 rounded-full ${
              riskLevel === 'low' ? 'bg-emerald-500 animate-pulse' : ''
            } ${riskLevel === 'medium' ? 'bg-yellow-500 animate-pulse' : ''} ${
              riskLevel === 'high' ? 'bg-red-500 animate-pulse' : ''
            }`}
          />
          <span className="text-sm text-slate-300">
            {riskLevel === 'low'
              ? 'System Stable'
              : riskLevel === 'medium'
                ? 'Elevated Caution'
                : 'Critical Alert'}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Toggle Switch Component
 */
function ToggleSwitch({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-cyan-500' : 'bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-slate-900 transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm text-slate-400">{label}</span>
    </label>
  );
}

/**
 * Circular Valve Gauge Component
 */
function ValveGauge({ angle = 90 }: { angle: number }) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const normalizedAngle = Math.max(0, Math.min(90, angle));
  const offset = circumference - (normalizedAngle / 90) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
          />

          {/* Animated fill */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="url(#cyanGradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: 'rotate(-90deg)',
              transformOrigin: '60px 60px',
            }}
            filter="drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))"
          />

          {/* Center circle */}
          <circle cx="60" cy="60" r="30" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

          {/* Needle */}
          <g transform={`rotate(${angle} 60 60)`}>
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="20"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
              filter="drop-shadow(0 0 4px rgba(6, 182, 212, 0.8))"
            />
          </g>

          {/* Center dot */}
          <circle cx="60" cy="60" r="4" fill="#06b6d4" />

          {/* Degree markers */}
          <text x="60" y="20" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
            0°
          </text>
          <text x="100" y="65" textAnchor="start" fill="#94a3b8" fontSize="11" fontWeight="600">
            45°
          </text>
          <text x="60" y="105" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
            90°
          </text>

          {/* Gradient definition */}
          <defs>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Angle display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-cyan-500 tracking-tighter">{angle}°</div>
        <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Valve Angle</div>
      </div>
    </div>
  );
}

/**
 * Main Dashboard Component
 */
export default function NeptuneAIDashboard({
  onlineStatus = 'online',
  flowRate = 4.2,
  valveAngle = 90,
  activeAlerts = 0,
  flowData: initialFlowData,
}: NeptuneAIDashboardProps) {
  const {
    telemetry,
    logs,
    setIsManual,
    setValveAngle,
    triggerAnomaly,
    resetSystem,
    isHardwareActive,
  } = useTelemetry();

  const {
    flowRate: liveFlow = flowRate,
    valveAngle: liveValveAngle = valveAngle,
    alerts = activeAlerts,
    riskScore = 0,
    systemHealth = 100,
    systemState = onlineStatus === 'online' ? 'NORMAL' : 'OFFLINE',
    valveState = 'OPEN',
    isManual = false,
    stability = 98,
    latency = 0,
    lastUpdated = 0,
  } = telemetry ?? {};

  const [flowChartData, setFlowChartData] = useState<FlowDataPoint[]>(() => initialFlowData ?? []);
  const [statusClock, setStatusClock] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setStatusClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof liveFlow !== 'number') {
      return;
    }

    setFlowChartData((prev) => {
      const nextPoint: FlowDataPoint = {
        timestamp: prev.length === 0 ? 1 : prev[prev.length - 1].timestamp + 1,
        flow: +liveFlow.toFixed(2),
      };

      if (
        prev.length > 0 &&
        prev[prev.length - 1].flow === nextPoint.flow &&
        lastUpdated === 0
      ) {
        return prev;
      }

      return [...prev.slice(-29), nextPoint];
    });
  }, [liveFlow, lastUpdated]);

  const telemetryAgeMs = lastUpdated ? Math.max(0, statusClock - lastUpdated) : null;
  const isOnline = isHardwareActive ? telemetryAgeMs !== null && telemetryAgeMs < 30000 : true;
  const status: 'online' | 'offline' = isOnline ? 'online' : 'offline';

  const aiStatus = useMemo<AIStatus>(() => {
    let state: AIStatus['state'] = 'monitoring';
    let decision = 'Maintaining nominal flow distribution';

    if (!isOnline) {
      state = 'analyzing';
      decision = 'Awaiting live node telemetry uplink';
    } else if (systemState === 'CRITICAL') {
      state = 'responding';
      decision = isManual
        ? 'Manual containment active on primary valve'
        : 'Autonomous containment sequence engaged';
    } else if (systemState === 'WARNING') {
      state = 'analyzing';
      decision = 'Monitoring elevated infrastructure variance';
    } else if (isManual) {
      state = 'stabilizing';
      decision = 'Manual override steering valve response';
    }

    const boundedConfidence = Math.max(0.35, Math.min(0.99, (stability ?? 98) / 100));

    return {
      state,
      leakProbability: riskScore,
      confidence: boundedConfidence,
      decision,
    };
  }, [isManual, isOnline, riskScore, stability, systemState]);

  const events = useMemo<SystemEvent[]>(() => {
    const severityForLog = (source: string): SystemEvent['severity'] => {
      switch (source) {
        case 'ALERT':
          return 'critical';
        case 'WARN':
          return 'warning';
        case 'SAFE':
          return 'success';
        default:
          return 'info';
      }
    };

    return logs.slice(0, 20).map((log) => ({
      id: log.id,
      timestamp: new Date(log.ts),
      severity: severityForLog(log.source),
      message: log.message.replace(/^\[.*?\]\s*/, ''),
    }));
  }, [logs]);

  const statusColor =
    status === 'online'
      ? systemState === 'CRITICAL'
        ? 'text-red-500'
        : systemState === 'WARNING'
          ? 'text-amber-500'
          : 'text-emerald-500'
      : 'text-red-500';
  const statusBgColor =
    status === 'online'
      ? systemState === 'CRITICAL'
        ? 'bg-red-500'
        : systemState === 'WARNING'
          ? 'bg-amber-500'
          : 'bg-emerald-500'
      : 'bg-red-500';
  const alertColor = alerts > 0 ? 'text-amber-500' : 'text-emerald-500';
  const riskLevel: 'low' | 'medium' | 'high' =
    riskScore >= THRESHOLDS.RISK_SCORE.HIGH
      ? 'high'
      : riskScore >= THRESHOLDS.RISK_SCORE.MEDIUM
        ? 'medium'
        : 'low';
  const flowStats = useMemo(() => {
    if (flowChartData.length === 0) {
      return { min: 0, avg: 0, max: 0 };
    }

    const values = flowChartData.map((point) => point.flow);
    const total = values.reduce((sum, value) => sum + value, 0);

    return {
      min: Math.min(...values),
      avg: total / values.length,
      max: Math.max(...values),
    };
  }, [flowChartData]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with controls */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Droplet className="w-8 h-8 text-cyan-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Neptune AI
              </h1>
            </div>
            <p className="text-slate-400">
              Real-time Water Leak Detection & Automatic Response
            </p>
          </div>

          {/* Control buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => triggerAnomaly()}
              disabled={systemState === 'CRITICAL'}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors text-sm"
            >
              Trigger Anomaly
            </button>
            <button
              onClick={() => resetSystem()}
              className="px-4 py-2 rounded-lg font-semibold transition-colors text-sm bg-slate-700 hover:bg-slate-600 text-white"
            >
              Reset System
            </button>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* System Status Card */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                  System Status
                </p>
                <div className="flex items-center gap-3">
                  {/* Pulsing indicator dot */}
                  <div className={`relative w-3 h-3 rounded-full ${statusBgColor}`}>
                    <div
                      className={`absolute inset-0 rounded-full ${statusBgColor} animate-pulse`}
                    />
                  </div>
                  <p className={`text-2xl font-bold ${statusColor}`}>
                    {status === 'online' ? systemState : 'OFFLINE'}
                  </p>
                </div>
              </div>
              <Zap className={`w-6 h-6 ${statusColor}`} />
            </div>
            <p className="text-xs text-slate-500">
              {status === 'online'
                ? `Node active • ${latency}ms uplink latency`
                : 'Awaiting connection...'}
            </p>
          </div>

          {/* Current Flow Card */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                  Current Flow
                </p>
                <p className="text-2xl font-bold text-cyan-500">
                  {liveFlow.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500 mt-1">L/min</p>
              </div>
              <Droplet className="w-6 h-6 text-cyan-500" />
            </div>
            <div className="text-xs text-slate-500">
              Safe envelope: {THRESHOLDS.FLOW_RATE.MIN_SAFE.toFixed(1)}-{THRESHOLDS.FLOW_RATE.MAX_SAFE.toFixed(1)} L/min
            </div>
          </div>

          {/* Active Alerts Card */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                  Active Alerts
                </p>
                <p className={`text-2xl font-bold ${alertColor}`}>{alerts}</p>
              </div>
              {alerts > 0 ? (
                <AlertCircle className={`w-6 h-6 ${alertColor} animate-pulse`} />
              ) : (
                <CheckCircle2 className={`w-6 h-6 ${alertColor}`} />
              )}
            </div>
            <p className="text-xs text-slate-500">
              {alerts > 0 ? `${alerts} active alert${alerts > 1 ? 's' : ''}` : 'System healthy'}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Flow Chart - Spans 2 columns on large screens */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-50 mb-6">
              Water Flow Rate
            </h2>

            {flowChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={flowChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="flowGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="timestamp"
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    tick={{ fill: '#94a3b8' }}
                    domain={[0, 8]}
                    label={{
                      value: 'L/min',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value: any) => [value.toFixed(2) + ' L/min', 'Flow']}
                  />
                  <ReferenceLine
                    y={THRESHOLDS.FLOW_RATE.MIN_SAFE}
                    stroke="#475569"
                    strokeDasharray="5 5"
                    label={{
                      value: `Min Safe (${THRESHOLDS.FLOW_RATE.MIN_SAFE.toFixed(1)})`,
                      position: 'right',
                      fill: '#64748b',
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine
                    y={THRESHOLDS.FLOW_RATE.CRITICAL_LOW}
                    stroke="#dc2626"
                    strokeDasharray="5 5"
                    label={{
                      value: 'Leak Alert',
                      position: 'right',
                      fill: '#dc2626',
                      fontSize: 11,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="flow"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="url(#flowGradient)"
                    isAnimationActive={true}
                    animationDuration={200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center border border-dashed border-slate-700 rounded-lg">
                <div className="text-center">
                  <p className="text-slate-500 text-sm">Awaiting live telemetry...</p>
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 mb-1">Min</p>
                <p className="text-cyan-500 font-semibold">
                  {flowStats.min.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 mb-1">Avg</p>
                <p className="text-cyan-500 font-semibold">
                  {flowStats.avg.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 mb-1">Max</p>
                <p className="text-cyan-500 font-semibold">
                  {flowStats.max.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: AI Status + System Health */}
          <div className="space-y-6">
            <AIStatusCard aiStatus={aiStatus} />
            <SystemHealthCard health={systemHealth} riskLevel={riskLevel} />
          </div>
        </div>

        {/* Live Infrastructure Map */}
        <div className="mb-8">
          <InfrastructureNodeMap />
        </div>

        {/* Valve Control + Activity Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Valve Control Panel */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-50 mb-6">Valve Control</h2>

            {/* Gauge Visualization */}
            <div className="flex-1 flex items-center justify-center mb-6">
              <ValveGauge angle={liveValveAngle} />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Toggle Switch */}
              <ToggleSwitch
                enabled={isManual}
                onChange={setIsManual}
                label="Manual Override"
              />

              {/* Manual Control Slider */}
              {isManual && (
                <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={liveValveAngle}
                    onChange={(e) => setValveAngle(Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Closed (0°)</span>
                    <span>Open (90°)</span>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div
                className={`p-3 rounded-lg border ${
                  valveState === 'CLOSED'
                    ? 'bg-red-500/10 border-red-500/30'
                    : valveState === 'OPEN'
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <p
                  className={`text-xs font-semibold ${
                    valveState === 'CLOSED'
                      ? 'text-red-500'
                      : valveState === 'OPEN'
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                  }`}
                >
                  Valve is {valveState} at {liveValveAngle.toFixed(0)}°
                </p>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-cyan-500" />
              <h2 className="text-xl font-semibold text-slate-50">System Events</h2>
            </div>
            <ActivityFeed events={events} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-700 pt-6">
          <p>
            Neptune AI v1.0 | Real-time Water Infrastructure Monitoring |{' '}
            {isHardwareActive ? 'Live Edge Node Mode' : 'Simulation Mode'}
          </p>
        </div>
      </div>
    </div>
  );
}
