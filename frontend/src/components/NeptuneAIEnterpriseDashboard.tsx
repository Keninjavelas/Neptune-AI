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
  Wifi,
  Factory,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/context/TelemetryContext";
import NeptuneAIInfrastructureTopology from "./NeptuneAIInfrastructureTopology";
import { THRESHOLDS } from "@/lib/constants/thresholds";
import GlobalAlertBanner from "./GlobalAlertBanner";

// --- Sub-components ---

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

const MetricCard = memo(({ label, value, unit = "", subtext = "", statusColor = "text-slate-50", icon: Icon, alert = false, pulsing = false }: any) => {
  if (!Icon) {
    console.warn(`MetricCard: Icon is undefined for ${label}`);
    return null;
  }
  return (
    <motion.div 
      whileHover={{ y: -1 }}
      className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-3 flex flex-col justify-between transition-all duration-500 hover:bg-slate-900/60 hover:border-slate-700/50 ${alert ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg ${alert ? 'bg-red-500/20 text-red-500' : 'bg-slate-800/80 text-slate-500'} border border-slate-700/30`}>
          <Icon size="14" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1 overflow-hidden">
          <h2 className={`text-2xl lg:text-3xl font-black tracking-tight truncate ${statusColor}`}>
            {value}
          </h2>
          {unit && <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{unit}</span>}
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          {pulsing && (
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_6px_emerald]" />
          )}
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-wider truncate">{subtext}</p>
        </div>
      </div>
    </motion.div>
  );
});
MetricCard.displayName = "MetricCard";

const FlowDynamics = memo(({ chartData, stabilityScore }: any) => (
  <PremiumCard title="Flow Dynamics" icon={BarChart3} className="flex-1">
    <div className="flex-1 w-full min-h-[140px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="cyanGr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.2} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 12]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '9px' }}
            itemStyle={{ color: '#06b6d4' }}
          />
          <Area 
            type="monotone" 
            dataKey="flow" 
            stroke="#06b6d4" 
            strokeWidth={2} 
            fill="url(#cyanGr)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-3">
      <div>
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Avg Rate</p>
        <p className="text-lg font-black text-slate-100">5.4 <span className="text-[9px] text-slate-600">L/M</span></p>
      </div>
      <div>
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Stability</p>
        <p className="text-lg font-black text-emerald-400">{stabilityScore}%</p>
      </div>
    </div>
  </PremiumCard>
));
FlowDynamics.displayName = "FlowDynamics";

const OperationsStream = memo(({ logs }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const parseLogMessage = (message: string) => {
    const nodeMatch = message.match(/^\[(.*?)\] (.*)$/);
    if (nodeMatch) {
      return {
        nodeId: nodeMatch[1],
        content: nodeMatch[2]
      };
    }
    return { nodeId: null, content: message };
  };

  return (
    <PremiumCard title="Operations Stream" icon={Terminal} className="flex-1 min-h-[300px]">
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono scrollbar-hide">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
              <Processor className="animate-spin" size={20} />
              <p className="text-[8px] font-bold uppercase tracking-widest">Neural Link...</p>
            </div>
          ) : (
            logs.map((log: any) => {
              const { nodeId, content } = parseLogMessage(log.message);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group flex flex-col gap-1 border-l border-slate-800 pl-2.5 py-0.5 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border ${
                        log.source === 'ALERT' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                        log.source === 'AI' ? 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5' : 
                        log.source === 'WARN' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' :
                        log.source === 'CTRL' ? 'text-purple-400 border-purple-400/20 bg-purple-400/5' :
                        log.source === 'SAFE' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' :
                        'text-slate-500 border-slate-700 bg-slate-800/50'
                      }`}>
                        {log.source}
                      </span>
                      {nodeId && (
                        <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-500/80 uppercase tracking-tighter">
                          {nodeId}
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] text-slate-600 font-bold">{new Date(log.ts).toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight group-hover:text-slate-200 transition-colors">
                    {content}
                  </p>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    </PremiumCard>
  );
});
OperationsStream.displayName = "OperationsStream";

const GridDistribution = memo(({ FactoryIcon, HomeIcon, WavesIcon }: any) => (
  <PremiumCard title="Grid Distribution" icon={Network} className="flex-1">
    <div className="space-y-3">
      {[
        { id: 'Z-01', name: 'Industrial', load: 84, health: 98, icon: FactoryIcon },
        { id: 'Z-02', name: 'Residential', load: 42, health: 100, icon: HomeIcon },
        { id: 'Z-03', name: 'Agri-Tech', load: 12, health: 92, icon: WavesIcon },
      ].map((zone) => (
        <div 
          key={zone.id} 
          className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-cyan-500/30 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-900 rounded-lg text-slate-500 group-hover:text-cyan-400 transition-colors">
                {zone.icon && <zone.icon size={14} />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">{zone.name}</p>
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest font-mono">{zone.id}</p>
              </div>
            </div>
            <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border ${zone.health > 95 ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-amber-400 border-amber-400/20 bg-amber-400/5'}`}>
              {zone.health}%
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[7px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Load Demand</span>
              <span className="text-cyan-400">{zone.load}%</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <motion.div 
                className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]" 
                initial={{ width: 0 }} 
                animate={{ width: `${zone.load}%` }} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </PremiumCard>
));
GridDistribution.displayName = "GridDistribution";

const SystemIntegrity = memo(({ ShieldAlertIcon, ActivityIcon, DatabaseIcon }: any) => (
  <PremiumCard title="System Integrity" icon={ShieldAlert} className="h-auto">
    <div className="space-y-3">
      <div className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-800/60 rounded-lg">
        <div className="flex items-center gap-2">
          {ActivityIcon && <ActivityIcon size={14} className="text-cyan-400" />}
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Heartbeat</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400">NOMINAL</span>
      </div>
      <div className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-800/60 rounded-lg">
        <div className="flex items-center gap-2">
          {DatabaseIcon && <DatabaseIcon size={14} className="text-purple-400" />}
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Synapse</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400">SYNCED</span>
      </div>
    </div>
  </PremiumCard>
));
SystemIntegrity.displayName = "SystemIntegrity";

const ControlProtocol = memo(({ isManual, valveAngle, setIsManual, setValveAngle }: any) => {
  const [localAngle, setLocalAngle] = useState(valveAngle);
  
  // Sync local angle if it changes from external (e.g. AI isolation)
  useEffect(() => {
    setLocalAngle(valveAngle);
  }, [valveAngle]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLocalAngle(val);
    setValveAngle(val); // This is debounced or asynchronous in hook
  };

  return (
    <PremiumCard title="Control Protocol" icon={Settings} alert={isManual} className="h-auto relative overflow-hidden">
      {isManual && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-amber-500/5 pointer-events-none"
        />
      )}
      <div className="space-y-4 relative z-10">
        <div className={`p-3 rounded-xl border transition-all duration-300 text-center ${
          isManual ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-950/60 border-slate-800/60'
        }`}>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Actuator Authority</p>
          <p className={`text-lg font-black tracking-tight ${isManual ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isManual ? 'MANUAL_CONTROL' : 'AI_AUTONOMOUS'}
          </p>
        </div>
        
        <button
          onClick={() => setIsManual(!isManual)}
          className={`w-full py-3 rounded-xl border font-bold text-[11px] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden ${
            isManual 
              ? 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <AlertTriangle size={14} className={isManual ? 'animate-pulse' : ''} />
          {isManual ? "RELEASE CONTROL" : "INITIATE OVERRIDE"}
        </button>

        <AnimatePresence>
          {isManual && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="space-y-3 overflow-hidden pt-1"
            >
              <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Restricted</span>
                <span className="text-amber-400 font-mono">{localAngle}°</span>
                <span>Full Supply</span>
              </div>
              <input 
                type="range" min="0" max="180" value={localAngle}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500 border border-slate-700"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PremiumCard>
  );
});
ControlProtocol.displayName = "ControlProtocol";

// --- Main Dashboard ---

export default function NeptuneAIEnterpriseDashboard() {
  const {
    telemetry,
    logs,
    setIsManual,
    setValveAngle
  } = useTelemetry();

  const {
    flowRate: flow,
    tankLevel,
    tds: tdsValue,
    valveAngle,
    status,
    isManual,
    riskScore,
    stabilityScore,
    alerts,
    anomalyLevel
  } = telemetry;

  const wqi = 100 - (riskScore * 0.5); // Derived WQI

  const [currentTime, setCurrentTime] = useState<string>("--:--:--");
  const [chartData, setChartData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setChartData(prev => [
        ...prev,
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).slice(3),
          flow,
          risk: riskScore
        }
      ].slice(-30));
    }, 2000);
    return () => clearInterval(interval);
  }, [flow, mounted, riskScore]);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-50 font-sans antialiased p-3 md:p-4 lg:p-6 selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-1000 ${
      anomalyLevel === 2 ? 'shadow-[inset_0_0_100px_rgba(239,68,68,0.15)] bg-slate-950' : 
      anomalyLevel === 1 ? 'shadow-[inset_0_0_100px_rgba(245,158,11,0.1)]' : ''
    }`}>

      <GlobalAlertBanner anomalyLevel={anomalyLevel} />

      {/* --- Global Background Layer --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse transition-colors duration-1000 ${
          anomalyLevel === 2 ? 'bg-red-500/10' : 'bg-cyan-500/5'
        }`} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1920px] mx-auto space-y-4 relative z-10">

        {/* --- Header Section --- */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/40">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10 transition-all duration-500 ${
                anomalyLevel === 2 ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30' : 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-500/30'
              }`}
            >
              <Waves className="text-slate-950" size={20} />
            </motion.div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                <span className="text-white uppercase">NEPTUNE</span>
                <span className={`font-light italic transition-colors duration-500 ${anomalyLevel === 2 ? 'text-red-400' : 'text-cyan-400'}`}>AI</span>
              </h1>
              <div className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5 flex items-center gap-2">
                <div className={`w-4 h-[1px] transition-colors duration-500 ${anomalyLevel === 2 ? 'bg-red-500/30' : 'bg-cyan-500/30'}`} />
                Smart Water Infrastructure Control
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 px-4 py-2 bg-slate-900/40 border border-slate-800/60 rounded-xl backdrop-blur-xl">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Node</span>
                <span className="text-[10px] font-bold text-slate-200 font-mono">ESP32-AQ-01</span>
              </div>
              <div className="w-[1px] h-6 bg-slate-800" />
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Network</span>
                <div className={`text-[10px] font-bold flex items-center gap-1.5 transition-colors duration-500 ${anomalyLevel === 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-1 h-1 rounded-full shadow-lg ${anomalyLevel === 2 ? 'bg-red-400 shadow-red-400/50' : 'bg-emerald-400 shadow-emerald-400/50'}`}
                  />
                  {anomalyLevel === 2 ? 'CONGESTED' : 'ACTIVE'}
                </div>
              </div>
              <div className="w-[1px] h-6 bg-slate-800" />
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Global Clock</span>
                <span className="text-[10px] font-bold text-slate-100 font-mono">
                  {currentTime}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* --- Top Metrics Row --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            label="System State"
            value={anomalyLevel === 0 ? "NOMINAL" : anomalyLevel === 1 ? "WARNING" : "CRITICAL"}
            statusColor={anomalyLevel === 0 ? "text-emerald-400" : anomalyLevel === 1 ? "text-amber-400" : "text-red-500"}
            icon={ShieldCheck}
            pulsing={anomalyLevel === 0}
            subtext={anomalyLevel === 0 ? "Integrity Secure" : "Anomaly Detected"}
            alert={anomalyLevel > 0}
          />
          <MetricCard
            label="Current Flow"
            value={flow?.toFixed(1) ?? "0.0"}
            unit={THRESHOLDS.FLOW_RATE.UNIT}
            statusColor={flow > THRESHOLDS.FLOW_RATE.MAX_SAFE || flow < THRESHOLDS.FLOW_RATE.MIN_SAFE ? "text-red-400" : "text-cyan-400"}
            icon={Droplet}
            subtext="Live Throughput"
            alert={flow > THRESHOLDS.FLOW_RATE.MAX_SAFE || flow < THRESHOLDS.FLOW_RATE.MIN_SAFE}
          />
          <MetricCard
            label="Quality Index"
            value={wqi?.toFixed(0) ?? 0}
            unit="WQI"
            statusColor={wqi > 90 ? "text-emerald-400" : wqi > 70 ? "text-amber-400" : "text-red-400"}
            icon={Beaker}
            subtext="TDS Sensor Feedback"
            alert={wqi < 70}
          />
          <MetricCard
            label="Tank Capacity"
            value={tankLevel?.toFixed(0) ?? "0"}
            unit={THRESHOLDS.TANK_LEVEL.UNIT}
            statusColor={tankLevel < THRESHOLDS.TANK_LEVEL.LOW ? "text-red-400" : "text-blue-500"}
            icon={Waves}
            subtext="Reservoir Level"
            alert={tankLevel < THRESHOLDS.TANK_LEVEL.LOW}
          />
          <MetricCard
            label="Active Alerts"
            value={alerts ?? 0}
            statusColor={alerts > 0 ? "text-red-500" : "text-slate-500"}
            icon={ShieldAlert}
            alert={alerts > 0}
            subtext={alerts > 0 ? `${alerts} Unresolved` : "Zero threats"}
          />
          <MetricCard
            label="AI Risk Score"
            value={riskScore ?? 0}
            unit={THRESHOLDS.RISK_SCORE.UNIT}
            statusColor={riskScore > THRESHOLDS.RISK_SCORE.HIGH ? "text-red-500" : riskScore > THRESHOLDS.RISK_SCORE.LOW ? "text-amber-400" : "text-emerald-500"}
            icon={Zap}
            subtext="Neural Confidence"
            alert={riskScore > THRESHOLDS.RISK_SCORE.HIGH}
          />
        </div>

        {/* --- Main Operational Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left Column: Analytics & Intelligence */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <FlowDynamics chartData={chartData} stabilityScore={stabilityScore} />
            <OperationsStream logs={logs} />
          </div>

          {/* Center Column: Infrastructure Digital Twin */}
          <div className="lg:col-span-6 flex flex-col">
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

          {/* Right Column: Control & Distribution */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <ControlProtocol 
              isManual={isManual} 
              valveAngle={valveAngle} 
              setIsManual={setIsManual} 
              setValveAngle={setValveAngle} 
            />
            <GridDistribution FactoryIcon={Factory} HomeIcon={Home} WavesIcon={Waves} />
            <SystemIntegrity ShieldAlertIcon={ShieldAlert} ActivityIcon={Activity} DatabaseIcon={Database} />
          </div>

        </div>
      </div>
    </div>
  );
}
