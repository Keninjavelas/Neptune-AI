"use client";

import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  Cpu,
  Waves,
  BarChart3,
  Clock,
  Radio,
  Power,
} from "lucide-react";
import useMockTelemetry from "../hooks/useMockTelemetry";

// --- Sub-components ---

const GlassPanel = ({ children, className = "", title = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-slate-900/60 backdrop-blur-2xl border border-slate-700/40 rounded-3xl overflow-hidden shadow-2xl ${className}`}
  >
    {title && (
      <div className="px-6 py-4 border-b border-slate-700/30 bg-slate-800/20 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
      </div>
    )}
    {children}
  </motion.div>
);

const MetricCard = ({ label, value, unit, icon: Icon, color, trend }: any) => (
  <GlassPanel className="p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{label}</p>
        <div className="flex items-baseline gap-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-3xl font-black ${color}`}
            >
              {value}
            </motion.span>
          </AnimatePresence>
          {unit && <span className="text-sm font-bold text-slate-500 uppercase">{unit}</span>}
        </div>
      </div>
      <div className={`p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-2">
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color.replace("text", "bg")}`}
            initial={{ width: 0 }}
            animate={{ width: `${trend}%` }}
          />
        </div>
      </div>
    )}
  </GlassPanel>
);

const ZoneCard = ({ zone }: any) => (
  <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/20 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        zone.status === "nominal" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
      }`}>
        <Radio size={20} className={zone.status === "warning" ? "animate-pulse" : ""} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-200">{zone.name}</p>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Region {zone.id}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-slate-100">{zone.flowRate} L/min</p>
      <p className="text-[10px] font-bold text-slate-400">{zone.qualityScore}% Quality</p>
    </div>
  </div>
);

// --- Main Dashboard ---

export default function NeptuneAICommandCenter() {
  const {
    flow, tdsValue, tankLevel, valveAngle, isManual,
    wqi, riskScore, alerts, status, logs,
    setValveAngle, setIsManual, resetAlerts
  } = useMockTelemetry();

  const [time, setTime] = useState(new Date());
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString().slice(3), flow, quality: wqi }
      ].slice(-30));
    }, 2000);
    return () => clearInterval(interval);
  }, [flow, wqi]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-10 selection:bg-cyan-500/30 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] left-[20%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
      </div>

      <div className="max-w-[1700px] mx-auto space-y-8 relative z-10">
        
        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <Waves className="text-slate-950" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-50 flex items-center gap-3">
                Neptune <span className="text-cyan-500 font-light italic">AI</span>
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">Realtime Water Intelligence Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <GlassPanel className="px-5 py-2.5 flex items-center gap-4">
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local Time</p>
                <p className="text-sm font-black font-mono text-slate-200">{time.toLocaleTimeString()}</p>
              </div>
              <Clock size={18} className="text-slate-600" />
            </GlassPanel>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Monitoring Active
              </div>
              <button onClick={resetAlerts} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700 transition-colors text-slate-400">
                <Power size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* --- Top Metrics --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <MetricCard label="System Status" value={status === "online" ? "Active" : "Alert"} icon={ShieldCheck} color={status === "online" ? "text-emerald-400" : "text-amber-400"} />
          <MetricCard label="Flow Rate" value={flow?.toFixed(1) ?? "0.0"} unit="LPM" icon={Activity} color="text-cyan-400" trend={(flow ?? 0) * 10} />
          <MetricCard label="Quality Index" value={wqi ?? 0} unit="WQI" icon={Droplet} color={(wqi ?? 0) > 90 ? "text-cyan-400" : "text-amber-400"} trend={wqi} />
          <MetricCard label="Tank Capacity" value={tankLevel?.toFixed(0) ?? "0"} unit="%" icon={Waves} color="text-blue-400" trend={tankLevel} />
          <MetricCard label="Active Alerts" value={alerts ?? 0} icon={AlertTriangle} color={(alerts ?? 0) > 0 ? "text-red-400" : "text-slate-400"} />
          <MetricCard label="AI Risk Score" value={riskScore ?? 0} unit="%" icon={Zap} color={(riskScore ?? 0) < 20 ? "text-emerald-400" : "text-amber-400"} trend={riskScore} />
        </div>

        {/* --- Main Dashboard Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Main Chart (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <GlassPanel title="Realtime Infrastructure Telemetry" className="h-[500px] p-6">
              <div className="h-full w-full">
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', fontSize: '12px' }}
                      itemStyle={{ fontWeight: 800 }}
                    />
                    <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Critical', fill: '#ef4444', fontSize: 10 }} />
                    <Area type="monotone" dataKey="flow" stroke="#06b6d4" strokeWidth={3} fill="url(#colorFlow)" animationDuration={1000} />
                    <Area type="monotone" dataKey="quality" stroke="#3b82f6" strokeWidth={2} fill="url(#colorQuality)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quality Panel */}
              <GlassPanel title="Water Quality Analytics" className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TDS (Purity)</p>
                      <p className="text-2xl font-black text-slate-100">{tdsValue} <span className="text-xs text-slate-500 uppercase">ppm</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI WQI</p>
                      <p className="text-2xl font-black text-slate-100">{wqi} <span className="text-xs text-slate-500 uppercase">index</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-cyan-500/5 border border-cyan-500/10">
                    <ShieldCheck size={40} className="text-cyan-400 mb-2" />
                    <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Purity Status</p>
                    <p className="text-lg font-black text-slate-100">Optimal</p>
                  </div>
                </div>
              </GlassPanel>

              {/* Smart Valve Controller */}
              <GlassPanel title="Smart Valve Controller" className="p-8">
                <div className="flex items-center gap-8">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="56" cy="56" r="50" fill="none" stroke="#1e293b" strokeWidth="6" />
                      <motion.circle
                        cx="56" cy="56" r="50" fill="none" stroke="#06b6d4" strokeWidth="8"
                        strokeDasharray="314"
                        animate={{ strokeDashoffset: 314 - (314 * (valveAngle / 100)) }}
                        className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-slate-100">{valveAngle}%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Manual Mode</span>
                      <button 
                        onClick={() => setIsManual(!isManual)}
                        className={`w-10 h-5 rounded-full transition-colors ${isManual ? "bg-cyan-500" : "bg-slate-700"}`}
                      >
                        <motion.div 
                          className="w-3.5 h-3.5 bg-white rounded-full mx-1"
                          animate={{ x: isManual ? 20 : 0 }}
                        />
                      </button>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={valveAngle}
                      onChange={(e) => setValveAngle(parseInt(e.target.value))}
                      disabled={!isManual}
                      className="w-full accent-cyan-500 opacity-50 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </GlassPanel>
            </div>
          </div>

          {/* Right: Feed (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <GlassPanel title="AI Intelligence Feed" className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed scrollbar-hide">
                <AnimatePresence initial={false}>
                  {logs.map(log => (
                    <motion.div
                      key={log.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="mb-3 flex items-start gap-3 group"
                    >
                      <span className="text-slate-600 shrink-0 select-none">{">"}</span>
                      <div>
                        <span className={`font-bold tracking-widest uppercase ${
                          log.source === "AI" ? "text-cyan-400" : log.source === "ALERT" ? "text-red-400" : "text-slate-400"
                        }`}>
                          [{log.source}]
                        </span>
                        <p className="text-slate-300 mt-1 group-hover:text-slate-100 transition-colors">{log.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="p-4 bg-slate-800/20 border-t border-slate-700/30 flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-cyan-500/40 animate-pulse" />
                  <div className="w-1 h-3 bg-cyan-500/60 animate-pulse delay-75" />
                  <div className="w-1 h-3 bg-cyan-500/80 animate-pulse delay-150" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link Active</p>
              </div>
            </GlassPanel>

            <GlassPanel title="Automation Pipeline" className="p-6">
              <div className="space-y-6">
                {[
                  { step: "SENSE", label: "Multi-Sensor Array", active: true },
                  { step: "ANALYZE", label: "Neural Inference", active: true },
                  { step: "ACT", label: "Autonomous Valve", active: alerts > 0 },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs ${
                      item.active ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-slate-800 text-slate-700"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${item.active ? "text-cyan-500" : "text-slate-600"}`}>{item.step}</p>
                      <p className={`text-sm font-bold ${item.active ? "text-slate-200" : "text-slate-600"}`}>{item.label}</p>
                    </div>
                    {i < 2 && <div className="ml-auto w-[1px] h-4 bg-slate-800" />}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>

        </div>
      </div>
    </div>
  );
}
