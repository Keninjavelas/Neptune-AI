"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  Droplet,
  Activity,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Clock,
  ChevronRight,
  Database,
} from "lucide-react";
import useMockTelemetry from "../hooks/useMockTelemetry";

// --- Sub-components ---

const EnterpriseCard = ({ children, className = "", alert = false, title = "" }: { children: React.ReactNode, className?: string, alert?: boolean, title?: string }) => (
  <div className={`bg-slate-900 border ${alert ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-slate-800'} rounded-xl shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ label, value, unit = "", subtext = "", statusColor = "text-slate-50", icon: Icon, alert = false, pulsing = false }: any) => (
  <EnterpriseCard alert={alert} className="flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={`p-2 rounded-lg bg-slate-800/50 border border-slate-700/30 ${statusColor}`}>
        <Icon size={18} />
      </div>
    </div>
    <div>
      <div className="flex items-center gap-3">
        {pulsing && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
        <h2 className={`text-5xl font-semibold tracking-tight ${statusColor}`}>
          {value}
          {unit && <span className="text-xl font-medium text-slate-500 ml-1">{unit}</span>}
        </h2>
      </div>
      {subtext && <p className="text-xs text-slate-500 mt-2 font-medium">{subtext}</p>}
    </div>
  </EnterpriseCard>
);

// --- Main Dashboard ---

export default function NeptuneAIEnterpriseDashboard() {
  const { 
    flow, 
    valveAngle, 
    alerts, 
    status, 
    logs, 
    isManual,
    setIsManual,
    setValveAngle 
  } = useMockTelemetry();

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);

  // Update timestamp & chart
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      setChartData(prev => [
        ...prev, 
        { time: new Date().toLocaleTimeString().slice(3), flow }
      ].slice(-25));
    }, 2000);
    return () => clearInterval(interval);
  }, [flow, mounted]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans antialiased p-6 md:p-8 lg:p-12 selection:bg-cyan-500/30">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- Global Header --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <span className="text-cyan-500">Neptune AI</span>
              <span className="text-slate-700 font-light">|</span>
              <span className="text-slate-300">Telemetry Dashboard</span>
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock size={14} />
              <span className="text-xs font-medium">
                Last Updated: {mounted && lastUpdated ? lastUpdated.toLocaleTimeString() : "--:--:--"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Database size={12} className="text-cyan-500" />
              Node: ESP32-AQ-01
            </div>
          </div>
        </header>

        {/* --- Vital Metrics (Top Row) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            label="System State" 
            value={status === "online" ? "ONLINE" : "ALERT"} 
            statusColor={status === "online" ? "text-emerald-500" : "text-red-500"} 
            icon={ShieldCheck} 
            pulsing={status === "online"}
            subtext="Primary Uplink Stable"
          />
          <MetricCard 
            label="Current Flow Rate" 
            value={flow?.toFixed(1) ?? "0.0"} 
            unit="L/min" 
            statusColor="text-slate-50" 
            icon={Droplet} 
            subtext="Normal Range (4.0 - 6.0)"
          />
          <MetricCard 
            label="Active Anomalies" 
            value={alerts} 
            statusColor={alerts > 0 ? "text-red-500" : "text-slate-50"} 
            icon={AlertTriangle} 
            alert={alerts > 0}
            subtext={alerts > 0 ? "Intervention Required" : "No active leaks detected"}
          />
        </div>

        {/* --- Main Dashboard Body --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Flow Trend */}
          <div className="lg:col-span-8">
            <EnterpriseCard className="h-[450px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold">Flow Dynamics</h3>
                  <p className="text-xs text-slate-500 font-medium">Real-time volumetric analysis over last 50s</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" /> Live Stream
                </div>
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#06b6d4', fontWeight: 600 }}
                    />
                    <ReferenceLine y={7.5} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'right', value: 'Leak Limit', fill: '#ef4444', fontSize: 10, fontWeight: 600 }} />
                    <Area 
                      type="monotone" 
                      dataKey="flow" 
                      stroke="#06b6d4" 
                      strokeWidth={3} 
                      fill="url(#cyanGrad)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </EnterpriseCard>
          </div>

          {/* Right Column - Hardware Control */}
          <div className="lg:col-span-4">
            <EnterpriseCard className="h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings size={20} className="text-slate-500" />
                    Valve Control
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Primary SG90 Servo Actuator Status</p>
                </div>

                {/* Simple Gauge Visualization */}
                <div className="relative py-8 flex items-center justify-center">
                  <svg className="w-48 h-24 overflow-visible" viewBox="0 0 100 50">
                    <path d="M10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                    <path 
                      d="M10 45 A 40 40 0 0 1 90 45" 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray="125.6"
                      strokeDashoffset={125.6 - (125.6 * (valveAngle / 180))}
                      className="transition-all duration-700 ease-out"
                    />
                    <circle cx="50" cy="45" r="2" fill="#fff" />
                  </svg>
                  <div className="absolute bottom-6 flex flex-col items-center">
                    <span className="text-3xl font-bold">{valveAngle}°</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Position</span>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-sm font-semibold text-slate-200">
                    {valveAngle === 90 ? "FULLY OPEN" : valveAngle === 0 ? "FULLY CLOSED" : "RESTRICTED FLOW"}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-tighter">Current State: {isManual ? "MANUAL" : "AUTO"}</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <button
                  onClick={() => setIsManual(!isManual)}
                  className={`w-full py-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-3 ${
                    isManual 
                      ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <AlertTriangle size={18} />
                  {isManual ? "EXIT MANUAL OVERRIDE" : "EMERGENCY MANUAL OVERRIDE"}
                </button>
                {isManual && (
                  <div className="space-y-3 p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                      <span>Closed</span>
                      <span>Open</span>
                    </div>
                    <input 
                      type="range" min="0" max="180" value={valveAngle}
                      onChange={(e) => setValveAngle(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                )}
              </div>
            </EnterpriseCard>
          </div>
        </div>

        {/* --- System Event Log (Bottom Row) --- */}
        <EnterpriseCard title="System Event Log">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database size={20} className="text-slate-500" />
              Infrastructure Event Log
            </h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filtered: Critical Events Only</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Event Type</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-600 italic">No priority events in buffer...</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{new Date(log.ts).toLocaleTimeString()}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          log.source === 'ALERT' ? 'text-red-500 border-red-500/30 bg-red-500/5' : 
                          log.source === 'AI_CORE' ? 'text-cyan-500 border-cyan-500/30 bg-cyan-500/5' : 
                          'text-slate-400 border-slate-700 bg-slate-800'
                        }`}>
                          {log.source}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300 font-medium">{log.message}</td>
                      <td className="px-4 py-4 text-right">
                        <ChevronRight size={14} className="inline text-slate-700 group-hover:text-cyan-500 transition-colors" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="text-[10px] font-bold text-slate-500 hover:text-cyan-500 transition-colors uppercase tracking-[0.2em] border border-slate-800 px-4 py-2 rounded-lg hover:border-cyan-500/30">
              View Full System Log
            </button>
          </div>
        </EnterpriseCard>

        {/* --- Dashboard Footer --- */}
        <footer className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 text-slate-600 gap-4">
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-cyan-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">System Status: Nominal</span>
          </div>
          <div className="text-[10px] font-medium uppercase tracking-widest">
            © 2024 Neptune AI • Secure Telemetry Uplink v2.4.0
          </div>
        </footer>

      </div>
    </div>
  );
}
