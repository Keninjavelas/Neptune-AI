'use client';

import React, { useState, useEffect } from 'react';
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
  Bell,
  AlertCircle,
  CheckCircle2,
  Gauge,
} from 'lucide-react';

/**
 * Neptune AI - Dark Mode Water Leak Detection Dashboard
 * Real-time IoT telemetry visualization with valve control
 */

interface FlowDataPoint {
  timestamp: number;
  flow: number;
}

interface NeptuneAIDashboardProps {
  onlineStatus?: 'online' | 'offline';
  flowRate?: number;
  valveAngle?: number;
  activeAlerts?: number;
  flowData?: FlowDataPoint[];
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
  const offset = circumference - (angle / 360) * circumference;

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
            90°
          </text>
          <text x="60" y="105" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600">
            180°
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
  // Mock state for demonstration
  const [status, setStatus] = useState<'online' | 'offline'>(onlineStatus);
  const [currentFlow, setCurrentFlow] = useState(flowRate);
  const [alerts, setAlerts] = useState(activeAlerts);
  const [angle, setAngle] = useState(valveAngle);
  const [manualOverride, setManualOverride] = useState(false);

  // Generate mock flow data if not provided
  const [flowChartData, setFlowChartData] = useState<FlowDataPoint[]>(
    initialFlowData || generateMockFlowData()
  );

  function generateMockFlowData(): FlowDataPoint[] {
    return Array.from({ length: 20 }, (_, i) => ({
      timestamp: i,
      flow: 4 + Math.sin(i * 0.3) * 1.5 + Math.random() * 0.5,
    }));
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowChartData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTimestamp = prev[prev.length - 1]?.timestamp || 0;
        const newFlow = 4 + Math.sin(lastTimestamp * 0.3) * 1.5 + Math.random() * 0.5;
        newData.push({
          timestamp: lastTimestamp + 1,
          flow: Math.max(0.1, newFlow),
        });
        return newData;
      });

      // Update current flow display
      setCurrentFlow((prev) => {
        const variation = (Math.random() - 0.5) * 0.3;
        return Math.max(0.1, Math.min(7, prev + variation));
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Status color helpers
  const statusColor = status === 'online' ? 'text-emerald-500' : 'text-red-500';
  const statusBgColor = status === 'online' ? 'bg-emerald-500' : 'bg-red-500';
  const alertColor = alerts > 0 ? 'text-amber-500' : 'text-emerald-500';
  const alertIcon = alerts > 0 ? 'AlertCircle' : 'CheckCircle2';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Droplet className="w-8 h-8 text-cyan-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Neptune AI</h1>
          </div>
          <p className="text-slate-400">Real-time Water Leak Detection & Automatic Response</p>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* System Status Card */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">System Status</p>
                <div className="flex items-center gap-3">
                  {/* Pulsing indicator dot */}
                  <div className={`relative w-3 h-3 rounded-full ${statusBgColor} animate-pulse`}>
                    <div className={`absolute inset-0 rounded-full ${statusBgColor} animate-pulse`} />
                  </div>
                  <p className={`text-2xl font-bold ${statusColor}`}>
                    {status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <Zap className={`w-6 h-6 ${statusColor}`} />
            </div>
            <p className="text-xs text-slate-500">
              {status === 'online'
                ? 'All systems operational'
                : 'Awaiting connection...'}
            </p>
          </div>

          {/* Current Flow Card */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Current Flow</p>
                <p className="text-2xl font-bold text-cyan-500">{currentFlow.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">L/min</p>
              </div>
              <Droplet className="w-6 h-6 text-cyan-500" />
            </div>
            <div className="text-xs text-slate-500">Expected: 4.0-5.5 L/min</div>
          </div>

          {/* Active Alerts Card */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Active Alerts</p>
                <p className={`text-2xl font-bold ${alertColor}`}>{alerts}</p>
              </div>
              {alerts > 0 ? (
                <AlertCircle className={`w-6 h-6 ${alertColor}`} />
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
            <h2 className="text-xl font-semibold text-slate-50 mb-6">Water Flow Rate</h2>

            {flowChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={flowChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
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
                    label={{ value: 'L/min', angle: -90, position: 'insideLeft' }}
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
                    y={4}
                    stroke="#475569"
                    strokeDasharray="5 5"
                    label={{ value: 'Normal (4.0)', position: 'right', fill: '#64748b', fontSize: 11 }}
                  />
                  <ReferenceLine
                    y={2}
                    stroke="#dc2626"
                    strokeDasharray="5 5"
                    label={{ value: 'Leak Alert', position: 'right', fill: '#dc2626', fontSize: 11 }}
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
                  {Math.min(...flowChartData.map((d) => d.flow)).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 mb-1">Avg</p>
                <p className="text-cyan-500 font-semibold">
                  {(flowChartData.reduce((a, b) => a + b.flow, 0) / flowChartData.length).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 mb-1">Max</p>
                <p className="text-cyan-500 font-semibold">
                  {Math.max(...flowChartData.map((d) => d.flow)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Valve Control Panel */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-slate-50 mb-6">Valve Control</h2>

            {/* Gauge Visualization */}
            <div className="flex-1 flex items-center justify-center mb-6">
              <ValveGauge angle={angle} />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Toggle Switch */}
              <ToggleSwitch
                enabled={manualOverride}
                onChange={setManualOverride}
                label="Manual Override"
              />

              {/* Manual Control Slider */}
              {manualOverride && (
                <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Closed (0°)</span>
                    <span>Open (180°)</span>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div
                className={`p-3 rounded-lg border ${
                  angle < 60
                    ? 'bg-red-500/10 border-red-500/30'
                    : angle > 120
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <p
                  className={`text-xs font-semibold ${
                    angle < 60
                      ? 'text-red-500'
                      : angle > 120
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                  }`}
                >
                  Valve is{' '}
                  {angle < 60 ? 'Closed' : angle > 120 ? 'Fully Open' : 'Partially Open'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-700 pt-6">
          <p>Neptune AI v1.0 | Real-time Water Infrastructure Monitoring</p>
        </div>
      </div>
    </div>
  );
}
