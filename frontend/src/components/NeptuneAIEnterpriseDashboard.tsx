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
  Waves,
  Beaker,
  Radio,
  Cpu,
  Zap,
  LayoutGrid,
  Terminal,
  ShieldAlert,
  ArrowUpRight,
  BarChart3,
  Network,
  Cpu as Processor,
  Wifi
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useMockTelemetry from "../hooks/useMockTelemetry";
import NeptuneAIInfrastructureTopology from "./NeptuneAIInfrastructureTopology";

// --- Sub-components ---

const PremiumCard = ({ children, className = "", alert = false, title = "", icon: Icon }: { children: React.ReactNode, className?: string, alert?: boolean, title?: string, icon?: any }) => (
  <div className={`bg-slate-900/50 backdrop-blur-xl border-2 ${alert ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-slate-800/80'} rounded-[2rem] p-8 flex flex-col transition-all duration-500 hover:border-slate-700 ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${alert ? 'bg-red-500/10 text-red-500' : 'bg-slate-800/50 text-slate-400'}`}>
            {Icon && <Icon size={24} />}
          </div>
          <h3 className="text-base font-black text-slate-200 uppercase tracking-[0.25em]">{title}</h3>
        </div>
        <div className="flex gap-1.5">
          <div className={`w-2 h-2 rounded-full ${alert ? 'bg-red-500 shadow-[0_0_10px_red] animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`} />
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>
      </div>
    )}
    {children}
  </div>
);

const MetricCard = ({ label, value, unit = "", subtext = "", statusColor = "text-slate-50", icon: Icon, alert = false, pulsing = false }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-slate-900/60 backdrop-blur-xl border-2 ${alert ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-slate-800/80'} rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-500 hover:bg-slate-900/80 hover:border-slate-600`}
  >
    <div className="flex items-center justify-between mb-6">
      <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">{label}</span>
      <div className={`p-3.5 rounded-2xl ${alert ? 'bg-red-500 text-slate-950 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800 text-slate-400'} border border-slate-700/50`}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <h2 className={`text-6xl font-black tracking-tighter ${statusColor} drop-shadow-sm`}>
          {value}
        </h2>
        {unit && <span className="text-2xl font-black text-slate-500 uppercase tracking-tighter">{unit}</span>}
      </div>
      <div className="flex items-center gap-3 mt-4">
        {pulsing && (
          <div className="flex gap-1">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_emerald]" />
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_emerald]" />
          </div>
        )}
        <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">{subtext}</p>
      </div>
    </div>
  </motion.div>
);

// --- Main Dashboard ---

export default function NeptuneAIEnterpriseDashboard() {
  const { 
    flow, 
    tankLevel,
    tdsValue,
    valveAngle, 
    alerts, 
    status, 
    logs, 
    isManual,
    wqi,
    riskScore,
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

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      setChartData(prev => [
        ...prev, 
        { time: new Date().toLocaleTimeString().slice(3), flow, risk: riskScore }
      ].slice(-30));
    }, 2000);
    return () => clearInterval(interval);
  }, [flow, mounted, riskScore]);

  const isCritical = status === "critical";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans antialiased p-6 md:p-12 lg:p-16 selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- Global Background Layer --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="max-w-[2000px] mx-auto space-y-16 relative z-10">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 pb-8 border-b-2 border-slate-800/40">
          <div className="flex items-center gap-8">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.8 }}
              className="w-20 h-18 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.5)] border-2 border-white/20"
            >
              <Waves className="text-slate-950" size={40} />
            </motion.div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter flex items-center gap-5">
                <span className="text-white uppercase drop-shadow-xl">NEPTUNE</span>
                <span className="text-cyan-400 font-light italic">AI</span>
              </h1>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.5em] mt-2 flex items-center gap-3">
                <div className="w-8 h-[2px] bg-cyan-500/40" />
                Realtime Smart Water Infrastructure Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4 px-8 py-4 bg-slate-900/40 border-2 border-slate-800/60 rounded-[2rem] backdrop-blur-xl">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Node</span>
                <span className="text-sm font-black text-slate-200 font-mono">ESP32-AQ-01</span>
              </div>
              <div className="w-[2px] h-10 bg-slate-800" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Status</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_emerald] animate-pulse" />
                  ACTIVE_UPLINK
                </span>
              </div>
              <div className="w-[2px] h-10 bg-slate-800" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uptime</span>
                <span className="text-sm font-black text-slate-300">99.98%</span>
              </div>
            </div>

            <div className="flex items-center gap-5 px-8 py-4 bg-slate-900/40 border-2 border-slate-800/60 rounded-[2rem] backdrop-blur-xl">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Clock</span>
                <span className="text-sm font-black text-slate-200 font-mono tracking-tighter">
                  {mounted && lastUpdated ? lastUpdated.toLocaleTimeString() : "--:--:--"}
                </span>
              </div>
              <div className="p-2.5 bg-slate-800/50 rounded-xl text-slate-400">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* --- Top Metrics Row --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          <MetricCard 
            label="System State" 
            value={status === "online" ? "NOMINAL" : "CRITICAL"} 
            statusColor={status === "online" ? "text-emerald-400" : "text-red-500"} 
            icon={ShieldCheck} 
            pulsing={status === "online"}
            subtext="Operational Integrity Secure"
          />
          <MetricCard 
            label="Current Flow" 
            value={flow?.toFixed(1) ?? "0.0"} 
            unit="L/M" 
            statusColor="text-cyan-400" 
            icon={Droplet} 
            subtext="Real-time Throughput"
          />
          <MetricCard 
            label="Quality Index" 
            value={wqi ?? 0} 
            unit="WQI" 
            statusColor={wqi > 90 ? "text-emerald-400" : "text-amber-400"} 
            icon={Beaker} 
            subtext="TDS Sensor Feedback"
          />
          <MetricCard 
            label="Tank Capacity" 
            value={tankLevel?.toFixed(0) ?? "0"} 
            unit="%" 
            statusColor="text-blue-500" 
            icon={Waves} 
            subtext="Ultrasonic Level Link"
          />
          <MetricCard 
            label="Active Anomalies" 
            value={alerts ?? 0} 
            statusColor={alerts > 0 ? "text-red-500" : "text-slate-500"} 
            icon={ShieldAlert} 
            alert={alerts > 0}
            subtext={alerts > 0 ? "Intervention Required" : "Zero active threats"}
          />
          <MetricCard 
            label="AI Risk Score" 
            value={riskScore ?? 0} 
            unit="%" 
            statusColor={riskScore > 30 ? "text-red-500" : "text-emerald-500"} 
            icon={Zap} 
            subtext="Neural Confidence Score"
          />
        </div>

        {/* --- Main Operational Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Intelligence & Analytics */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <PremiumCard title="Flow Dynamics" icon={BarChart3} className="flex-1 min-h-[450px]">
              <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cyanGr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 12]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #1e293b', borderRadius: '16px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="flow" 
                      stroke="#06b6d4" 
                      strokeWidth={5} 
                      fill="url(#cyanGr)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 pt-8 border-t-2 border-slate-800/50 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Average Rate</p>
                  <p className="text-2xl font-black text-slate-100 mt-1">5.42 <span className="text-xs text-slate-600">L/M</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signal Health</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">99.4%</p>
                </div>
              </div>
            </PremiumCard>

            <PremiumCard title="AI Operations Feed" icon={Terminal} className="flex-1 min-h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-6 pr-4 font-mono scrollbar-hide">
                <AnimatePresence initial={false}>
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                      <Processor className="animate-spin" size={32} />
                      <p className="text-xs font-black uppercase tracking-widest">Establishing Neural Link...</p>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="group flex flex-col gap-2.5 border-l-2 border-slate-800 pl-4 py-1 hover:border-cyan-500 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border-2 ${
                            log.source === 'ALERT' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                            log.source === 'AI_CORE' ? 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5' : 
                            'text-slate-500 border-slate-700 bg-slate-800/50'
                          }`}>
                            {log.source}
                          </span>
                          <span className="text-[10px] text-slate-600 font-black">{new Date(log.ts).toLocaleTimeString([], { hour12: false })}</span>
                        </div>
                        <p className="text-[13px] text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                          {log.message}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </PremiumCard>
          </div>

          {/* Center Column: Infrastructure Digital Twin */}
          <div className="lg:col-span-6 flex flex-col gap-10">
            <NeptuneAIInfrastructureTopology 
              flow={flow}
              tankLevel={tankLevel}
              tdsValue={tdsValue}
              valveAngle={valveAngle}
              status={status}
              isManual={isManual}
              alerts={alerts}
            />
          </div>

          {/* Right Column: Control & Grid Distribution */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <PremiumCard title="Override Protocol" icon={Settings} alert={isManual} className="h-auto">
              <div className="space-y-8">
                <div className="p-6 bg-slate-950/80 rounded-[1.5rem] border-2 border-slate-800/60 text-center shadow-inner">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Actuator Authority</p>
                  <p className={`text-3xl font-black tracking-tight ${isManual ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                    {isManual ? 'MANUAL_CONTROL' : 'AI_AUTONOMOUS'}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsManual(!isManual)}
                  className={`w-full py-6 rounded-[1.5rem] border-2 font-black text-base transition-all duration-500 flex items-center justify-center gap-5 group relative overflow-hidden ${
                    isManual 
                      ? 'bg-red-600 border-red-400 text-white shadow-[0_0_50px_rgba(239,68,68,0.4)]' 
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-500'
                  }`}
                >
                  <AlertTriangle size={24} className={isManual ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                  {isManual ? "RELEASE AUTHORITY" : "INITIATE OVERRIDE"}
                </button>

                <AnimatePresence>
                  {isManual && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-6 overflow-hidden pt-4"
                    >
                      <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Restricted</span>
                        <span className="text-amber-400">{valveAngle}°</span>
                        <span>Full Supply</span>
                      </div>
                      <div className="relative group">
                        <input 
                          type="range" min="0" max="180" value={valveAngle}
                          onChange={(e) => setValveAngle(parseInt(e.target.value))}
                          className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500 border border-slate-700"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PremiumCard>

            <PremiumCard title="Grid Distribution" icon={Network} className="flex-1 min-h-[500px]">
              <div className="space-y-6">
                {[
                  { id: 'Z-01', name: 'Industrial Zone', load: 84, health: 98, icon: Factory },
                  { id: 'Z-02', name: 'Residential Hub', load: 42, health: 100, icon: Home },
                  { id: 'Z-03', name: 'Agri-Tech Grid', load: 12, health: 92, icon: Waves },
                ].map((zone) => (
                  <motion.div 
                    key={zone.id} 
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-slate-950/60 border-2 border-slate-800/80 rounded-[1.5rem] hover:border-cyan-500/40 transition-all group shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-900 rounded-xl text-slate-400 group-hover:text-cyan-400 transition-colors">
                          <zone.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-100 uppercase tracking-wider">{zone.name}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">{zone.id}</p>
                        </div>
                      </div>
                      <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg border-2 ${zone.health > 95 ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-amber-400 border-amber-400/20 bg-amber-400/5'}`}>
                        {zone.health}% HP
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Load Demand</span>
                        <span className="text-cyan-400">{zone.load}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                          initial={{ width: 0 }} 
                          animate={{ width: `${zone.load}%` }} 
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mt-10 p-5 rounded-[1.5rem] bg-cyan-500/5 border-2 border-cyan-500/20 flex items-center justify-center gap-4"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]" />
                <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em]">Infrastructure Stabilized</span>
              </motion.div>
            </PremiumCard>
          </div>

        </div>
      </div>
    </div>
  );
}
