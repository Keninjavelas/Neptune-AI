"use client";

import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from "react";
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
  Droplet,
  Activity,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Waves,
  Beaker,
  Zap,
  Terminal,
  ShieldAlert,
  BarChart3,
  Cpu as Processor,
  Wifi,
  Radio,
  Power,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/context/TelemetryContext";
import { THRESHOLDS } from "@/lib/constants/thresholds";
import GlobalAlertBanner from "./GlobalAlertBanner";

// --- Reusable Premium Card ---
const PremiumCard = memo(({ children, className = "", alert = false, title = "", icon: Icon }: { children: React.ReactNode, className?: string, alert?: boolean, title?: string, icon?: any }) => (
  <div className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 flex flex-col transition-all duration-500 hover:border-slate-700/50 ${alert ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''} ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${alert ? 'bg-red-500/10 text-red-500' : 'bg-slate-800/80 text-slate-400'}`}>
            {Icon && <Icon size={16} />}
          </div>
          <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="flex gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${alert ? 'bg-red-500 shadow-[0_0_8px_red] animate-pulse' : 'bg-emerald-500/50 shadow-[0_0_8px_emerald]'}`} />
        </div>
      </div>
    )}
    {children}
  </div>
));
PremiumCard.displayName = "PremiumCard";

// --- Metric Card (KPI) ---
const MetricCard = memo(({ label, value, unit = "", subtext = "", statusColor = "text-slate-50", icon: Icon, alert = false, pulsing = false }: any) => {
  if (!Icon) return null;
  return (
    <motion.div 
      whileHover={{ y: -1 }}
      className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 hover:bg-slate-900/60 hover:border-slate-700/50 ${alert ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`p-2 rounded-xl ${alert ? 'bg-red-500/20 text-red-500' : 'bg-slate-800/80 text-slate-500'} border border-slate-700/30`}>
          <Icon size="18" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5 overflow-hidden">
          <h2 className={`text-3xl lg:text-4xl font-black tracking-tight truncate ${statusColor}`}>
            {value}
          </h2>
          {unit && <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{unit}</span>}
        </div>
        <div className="flex items-center gap-2 mt-2">
          {pulsing && (
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_emerald]" />
          )}
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">{subtext}</p>
        </div>
      </div>
    </motion.div>
  );
});
MetricCard.displayName = "MetricCard";

// --- Realtime Telemetry Graph ---
const RealtimeFlowGraph = memo(({ chartData, avgFlow, stability }: any) => (
  <PremiumCard title="Realtime Flow Telemetry" icon={BarChart3} className="h-full">
    <div className="flex-1 w-full min-h-[300px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="cyanGr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.2} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
            itemStyle={{ color: '#06b6d4' }}
          />
          <Area 
            type="monotone" 
            dataKey="flow" 
            stroke="#06b6d4" 
            strokeWidth={3} 
            fill="url(#cyanGr)" 
            animationDuration={500}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-6 pt-6 border-t border-slate-800/60 grid grid-cols-2 gap-6">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Throughput</p>
        <p className="text-2xl font-black text-slate-100">{avgFlow} <span className="text-xs text-slate-600 font-bold">L/M</span></p>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Stability</p>
        <p className="text-2xl font-black text-emerald-400">{stability}%</p>
      </div>
    </div>
  </PremiumCard>
));
RealtimeFlowGraph.displayName = "RealtimeFlowGraph";

// --- Control & Response Panel ---
const ResponsePanel = memo(({ 
  valveState, 
  relayState, 
  buzzerState, 
  isManual, 
  systemState,
  setIsManual 
}: any) => (
  <PremiumCard title="Control & Response" icon={Settings} alert={systemState !== "NORMAL"} className="h-full">
    <div className="flex-1 space-y-4">
      {/* AI Status Badge */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${
        isManual ? 'bg-amber-500/5 border-amber-500/20' : 'bg-cyan-500/5 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isManual ? 'bg-amber-500/20 text-amber-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
            <Processor size={20} className={isManual ? "" : "animate-pulse"} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Defense Mode</p>
            <p className={`text-sm font-black tracking-tight ${isManual ? 'text-amber-400' : 'text-cyan-400'}`}>
              {isManual ? 'MANUAL_OVERRIDE' : 'AUTONOMOUS_ACTIVE'}
            </p>
          </div>
        </div>
        {!isManual && (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Secured</span>
          </div>
        )}
      </div>

      {/* Infrastructure States */}
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl group hover:border-slate-700/50 transition-all">
          <div className="flex items-center gap-3">
            <Zap size={18} className={valveState === "CLOSED" ? "text-red-500" : "text-cyan-400"} />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Valve State</span>
          </div>
          <span className={`text-xs font-black px-3 py-1 rounded-lg border ${
            valveState === "CLOSED" ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
            valveState === "PARTIAL" ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 
            'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
          }`}>
            {valveState}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl group hover:border-slate-700/50 transition-all">
          <div className="flex items-center gap-3">
            <Radio size={18} className={relayState ? "text-red-500 animate-pulse" : "text-slate-500"} />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Relay Protection</span>
          </div>
          <span className={`text-xs font-black uppercase tracking-widest ${relayState ? 'text-red-500' : 'text-slate-600'}`}>
            {relayState ? 'TRIPPED' : 'INACTIVE'}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl group hover:border-slate-700/50 transition-all">
          <div className="flex items-center gap-3">
            {buzzerState ? <Volume2 size={18} className="text-red-500 animate-bounce" /> : <VolumeX size={18} className="text-slate-500" />}
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Audio Alert</span>
          </div>
          <span className={`text-xs font-black uppercase tracking-widest ${buzzerState ? 'text-red-500' : 'text-slate-600'}`}>
            {buzzerState ? 'ACTIVE' : 'SILENT'}
          </span>
        </div>
      </div>

      {/* Manual Override Button */}
      <button
        onClick={() => setIsManual(!isManual)}
        className={`w-full py-4 mt-2 rounded-2xl border font-black text-xs transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden ${
          isManual 
            ? 'bg-red-600 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Power size={16} className={isManual ? 'animate-pulse' : ''} />
        {isManual ? "RELEASE SYSTEM TO AI" : "INITIATE MANUAL OVERRIDE"}
      </button>
    </div>
  </PremiumCard>
));
ResponsePanel.displayName = "ResponsePanel";

// --- Operations Stream (Terminal) ---
const OperationsStream = memo(({ logs }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <PremiumCard title="Infrastructure Operations Stream" icon={Terminal} className="min-h-[200px] max-h-[200px]">
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono scrollbar-hide">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full opacity-20">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Establishing Uplink...</p>
            </div>
          ) : (
            logs.map((log: any) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 text-[11px] leading-relaxed border-b border-slate-800/30 pb-1.5 last:border-0"
              >
                <span className="text-slate-600 font-bold min-w-[65px]">
                  {new Date(log.ts).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={`font-black px-1.5 py-0.5 rounded text-[9px] min-w-[45px] text-center ${
                  log.source === 'ALERT' ? 'bg-red-500/20 text-red-400' : 
                  log.source === 'AI' ? 'bg-purple-500/20 text-purple-400' : 
                  log.source === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-slate-800 text-slate-500'
                }`}>
                  {log.source}
                </span>
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                  {log.message.replace(/^\[.*?\] /, '')}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    </PremiumCard>
  );
});
OperationsStream.displayName = "OperationsStream";

// --- Main Dashboard Redesign ---
export default function NeptuneAIEnterpriseDashboard() {
  const {
    telemetry,
    logs,
    setIsManual,
    setValveAngle
  } = useTelemetry();

  // Enforce single source of truth from telemetry packet
  const {
    flowRate: flow = 0,
    tds: tdsValue = 0,
    riskScore = 0,
    systemState = "NORMAL",
    valveState = "OPEN",
    relayState = false,
    buzzerState = false,
    stability = 100,
    latency = 12,
    tankLevel = 100,
    isManual = false
  } = telemetry ?? {};

  const wqi = 100 - (riskScore * 0.5);

  const [currentTime, setCurrentTime] = useState<string>("--:--:--");
  const [chartData, setChartData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setChartData(prev => [
        ...prev,
        {
          time: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' }),
          flow,
        }
      ].slice(-30));
    }, 1000);
    return () => clearInterval(interval);
  }, [flow, mounted]);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-50 font-sans antialiased p-4 md:p-6 lg:p-8 selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-1000 ${
      systemState === "CRITICAL" ? 'shadow-[inset_0_0_150px_rgba(239,68,68,0.2)] bg-slate-950' : ''
    }`}>

      <GlobalAlertBanner systemState={systemState} />

      {/* --- Ambient Background Layer --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full blur-[150px] animate-pulse transition-colors duration-1000 ${
          systemState === "CRITICAL" ? 'bg-red-500/10' : 'bg-cyan-500/5'
        }`} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">

        {/* --- Header Section --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/40">
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 transition-all duration-700 ${
                systemState === "CRITICAL" ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/40' : 'bg-gradient-to-br from-cyan-500 to-blue-700 shadow-cyan-500/40'
              }`}
            >
              <Waves className="text-white" size={28} />
            </motion.div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <span className="text-white">NEPTUNE</span>
                <span className={`italic transition-colors duration-500 ${systemState === "CRITICAL" ? 'text-red-400' : 'text-cyan-400'}`}>AI</span>
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em]">
                Realtime Smart Water Infrastructure Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl backdrop-blur-2xl shadow-xl">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Node</span>
              <span className="text-xs font-bold text-slate-200 font-mono">ESP32-AQ-01</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-800" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Uplink</span>
              <div className={`text-xs font-bold flex items-center gap-2 ${systemState === "CRITICAL" ? 'text-red-400' : 'text-emerald-400'}`}>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                ONLINE • {latency}ms
              </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-800" />
            <span className="text-xs font-bold text-slate-100 font-mono tabular-nums">{currentTime}</span>
          </div>
        </header>

        {/* --- Top KPI Row --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="System State"
            value={systemState}
            statusColor={systemState === "NORMAL" ? "text-emerald-400" : systemState === "WARNING" ? "text-amber-400" : "text-red-500"}
            icon={ShieldCheck}
            pulsing={systemState === "NORMAL"}
            subtext="Infrastructure Integrity Status"
            alert={systemState !== "NORMAL"}
          />
          <MetricCard
            label="Flow Rate"
            value={flow.toFixed(1)}
            unit="L/M"
            statusColor={flow > THRESHOLDS.FLOW_RATE.MAX_SAFE ? "text-red-400" : "text-cyan-400"}
            icon={Activity}
            subtext="Live Telemetry Updates"
            alert={flow > THRESHOLDS.FLOW_RATE.MAX_SAFE}
          />
          <MetricCard
            label="Water Quality"
            value={tdsValue.toFixed(0)}
            unit="TDS"
            statusColor={tdsValue > THRESHOLDS.TDS.WARNING ? "text-amber-400" : "text-cyan-400"}
            icon={Beaker}
            subtext={tdsValue > THRESHOLDS.TDS.WARNING ? "Caution: High Mineral Count" : "Optimal Purity Levels"}
            alert={tdsValue > THRESHOLDS.TDS.WARNING}
          />
          <MetricCard
            label="AI Risk Score"
            value={riskScore}
            unit="%"
            statusColor={riskScore > 70 ? "text-red-500" : riskScore > 30 ? "text-amber-400" : "text-emerald-500"}
            icon={Zap}
            subtext="Realtime Predictive Analysis"
            alert={riskScore > 70}
          />
        </div>

        {/* --- Main Content Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <RealtimeFlowGraph 
              chartData={chartData} 
              avgFlow={flow.toFixed(1)} 
              stability={stability} 
            />
          </div>
          <div className="lg:col-span-4">
            <ResponsePanel 
              valveState={valveState}
              relayState={relayState}
              buzzerState={buzzerState}
              isManual={isManual}
              systemState={systemState}
              setIsManual={setIsManual}
            />
          </div>
        </div>

        {/* --- Bottom Section --- */}
        <OperationsStream logs={logs} />

      </div>
    </div>
  );
}
