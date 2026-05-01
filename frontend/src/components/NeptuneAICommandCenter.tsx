"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { 
  Activity, 
  Droplet, 
  AlertTriangle, 
  Terminal as TerminalIcon,
  Settings,
  Cpu,
  ChevronRight,
} from "lucide-react";
import useMockTelemetry from "../hooks/useMockTelemetry";

// --- Sub-components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ title, value, unit = "", icon: Icon, colorClass = "text-cyan-500", showPulse = false }: any) => (
  <GlassCard className="p-5 flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="flex items-baseline gap-2">
        {showPulse && (
          <div className="relative w-2.5 h-2.5 mb-1">
            <div className={`absolute inset-0 rounded-full ${colorClass.replace('text', 'bg')} animate-ping opacity-75`} />
            <div className={`relative rounded-full w-2.5 h-2.5 ${colorClass.replace('text', 'bg')}`} />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-baseline gap-1"
          >
            <span className={`text-3xl font-bold text-slate-50`}>{value}</span>
            {unit && <span className="text-slate-400 text-sm font-medium">{unit}</span>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    <div className={`p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 ${colorClass}`}>
      <Icon size={22} />
    </div>
  </GlassCard>
);

const HUDValve = ({ angle, manual, onManualToggle, onAngleChange }: any) => {
  return (
    <GlassCard className="p-8 flex flex-col md:flex-row items-center gap-10">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Concentric Circles & Rotating HUD */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-60 h-60 rounded-full border border-dashed border-slate-700/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute w-52 h-52 rounded-full border border-slate-800/90 shadow-[0_0_40px_rgba(15,23,42,0.8)]" />
          <div className="absolute w-44 h-44 rounded-full border border-slate-700/20" />
        </div>

        {/* SVG Arc Visualizer */}
        <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-800"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="515"
            animate={{ strokeDashoffset: 515 - (515 * (angle / 180)) }}
            className="text-cyan-500 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-4xl font-mono font-bold text-slate-50 tracking-tighter">{angle}°</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Actuator</span>
        </div>
      </div>

      <div className="flex-1 space-y-8 w-full">
        <div>
          <h3 className="text-xl font-bold text-slate-50 flex items-center gap-3">
            <Settings size={20} className="text-cyan-500" />
            SG90 Digital Twin
          </h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Real-time synchronization with the physical servo actuator. Manual override grants direct control over the flow restriction angle.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-700/50">
            <span className="text-sm font-semibold text-slate-300">Manual Override</span>
            <button
              onClick={() => onManualToggle(!manual)}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                manual 
                  ? "bg-cyan-500 shadow-[inset_0_0_20px_rgba(6,182,212,0.15)]" 
                  : "bg-slate-700 shadow-inner"
              }`}
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                animate={{ x: manual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </button>
          </div>

          <div className={`space-y-3 transition-all duration-500 ${manual ? "opacity-100 scale-100" : "opacity-30 scale-[0.98] pointer-events-none"}`}>
            <div className="flex justify-between text-[10px] text-slate-500 uppercase font-black tracking-widest px-1">
              <span>0° Restricted</span>
              <span>180° Maximum</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={angle}
              onChange={(e) => onAngleChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// --- Main Component ---

export default function NeptuneAICommandCenter() {
  const { flow, valveAngle, alerts, status, logs, setValveAngle, pushLog } = useMockTelemetry();
  const [manualMode, setManualMode] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Simulation: Telemetry Chart
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString().slice(3), flow }].slice(-25);
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [flow]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-10 font-sans selection:bg-cyan-500/30 text-slate-50">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Visual Data (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Top Row: Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="System Status" 
              value={status === "online" ? "Online" : "Offline"} 
              icon={Activity} 
              colorClass={status === "online" ? "text-emerald-500" : "text-red-500"}
              showPulse={status === "online"}
            />
            <MetricCard 
              title="Current Flow" 
              value={flow.toFixed(2)} 
              unit="L/min" 
              icon={Droplet} 
              colorClass="text-cyan-500"
            />
            <MetricCard 
              title="Active Alerts" 
              value={alerts} 
              icon={AlertTriangle} 
              colorClass={alerts > 0 ? "text-amber-500" : "text-slate-400"}
            />
          </div>

          {/* Middle Row: Telemetry Chart */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight">Live Telemetry Feed</h2>
                <p className="text-xs text-slate-400 uppercase tracking-[0.3em] font-semibold">Flow Dynamics · Real-time Analysis</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/50 text-[10px] text-slate-300 uppercase font-black tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" /> Stream Active
                </div>
              </div>
            </div>
            
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    minTickGap={40}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(51, 65, 85, 0.5)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(12px)',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#06b6d4', fontWeight: 700 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="flow" 
                    stroke="#06b6d4" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#cyanGradient)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Bottom Row: Valve HUD */}
          <HUDValve 
            angle={valveAngle} 
            manual={manualMode} 
            onManualToggle={setManualMode}
            onAngleChange={setValveAngle}
          />
        </div>

        {/* Right Column: AI Decision Terminal (Span 1) */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col min-h-[700px] lg:h-[calc(100vh-80px)] sticky top-10">
            {/* Terminal Header */}
            <div className="p-5 border-b border-slate-700/50 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
                </div>
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-[0.3em]">Live System Feed</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-4 bg-cyan-500/40 animate-pulse" />
                <Cpu size={18} className="text-slate-500" />
              </div>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[13px] leading-relaxed scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="space-y-4">
                <AnimatePresence initial={false} mode="popLayout">
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="group flex items-start gap-3"
                    >
                      <span className="text-cyan-500/50 select-none font-black mt-0.5 tracking-tighter shrink-0">{">>>"}</span>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-3">
                          <span className={`font-black text-[11px] tracking-wider ${
                            log.source === "AI_CORE" ? "text-cyan-400" :
                            log.source === "ALERT" ? "text-red-500" :
                            "text-slate-400"
                          }`}>
                            [{log.source}]
                          </span>
                          <span className="text-slate-600 text-[10px] font-medium tracking-tighter">
                            {new Date(log.ts).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-300 group-hover:text-slate-50 transition-colors">
                          {log.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Terminal Input / Command Line */}
            <div className="p-6 bg-slate-900/80 border-t border-slate-700/50">
              <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-700/50 rounded-2xl px-5 py-3 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all group shadow-[inset_0_0_20px_rgba(6,182,212,0.03)]">
                <ChevronRight size={20} className="text-slate-600 group-focus-within:text-cyan-500 transition-colors" />
                <div className="flex-1 flex items-center gap-1">
                  <input 
                    type="text" 
                    placeholder="Enter uplink command..." 
                    className="bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-700 w-full font-mono text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget.value.trim();
                        if (input) {
                          pushLog("SYS", `Uplink command sent: ${input}`);
                          pushLog("AI_CORE", "Command acknowledged. Re-calibrating neural weights...");
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                  <motion.div 
                    className="w-2 h-4 bg-cyan-500/80" 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                </div>
                <TerminalIcon size={18} className="text-slate-600" />
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
