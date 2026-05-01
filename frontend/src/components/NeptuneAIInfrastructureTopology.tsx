"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Waves, 
  Settings, 
  AlertTriangle, 
  Activity,
  ShieldCheck,
  Building,
  Droplet,
  ArrowRight,
  Database,
  Radio,
  Zap,
  FlaskConical,
  UtilityPole,
  Home,
  Factory,
  TowerControl as WaterTower,
  Wifi,
  CloudLightning
} from "lucide-react";

interface TopologyProps {
  flow: number;
  tankLevel: number;
  tdsValue: number;
  valveAngle: number;
  status: string;
  isManual: boolean;
  alerts: number;
}

// --- Sub-components ---

const ComponentCard = ({ children, title, status, alert = false, className = "", icon: Icon }: any) => (
  <motion.div 
    className={`bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md min-w-[240px] transition-all duration-500 ${
      alert ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "hover:border-slate-700/50"
    } ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${alert ? 'bg-red-500/10 text-red-500' : 'bg-slate-800/80 text-cyan-500/80'}`}>
          <Icon size={18} />
        </div>
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</span>
      </div>
      <div className={`w-2 h-2 rounded-full ${alert ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" : "bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]"}`} />
    </div>
    {children}
    <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
      <span className={`text-[9px] font-black uppercase tracking-widest ${alert ? "text-red-500" : "text-emerald-500/80"}`}>{status}</span>
    </div>
  </motion.div>
);

const SmartCityZone = ({ name, icon: Icon, active, color = "cyan" }: any) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500 ${
      active 
        ? `bg-${color}-500/10 border-${color}-500/40 text-${color}-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]` 
        : 'bg-slate-900/40 border-slate-800 text-slate-700'
    }`}>
      <Icon size={20} />
    </div>
    <span className={`text-[8px] font-bold uppercase tracking-widest ${active ? 'text-slate-400' : 'text-slate-600'}`}>{name}</span>
  </div>
);

// --- Main Topology ---

export default function NeptuneAIInfrastructureTopology({ 
  flow, 
  tankLevel, 
  tdsValue, 
  valveAngle, 
  status,
  isManual,
}: TopologyProps) {
  const isCritical = status === "critical";

  return (
    <div className="relative w-full h-full min-h-[850px] bg-slate-950/20 rounded-[2.5rem] border border-slate-800/40 overflow-hidden flex flex-col shadow-inner">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* --- Top: Controller & AI Logic Layer --- */}
      <div className="h-40 bg-slate-900/30 border-b border-slate-800/40 p-6 backdrop-blur-xl z-20">
        <div className="grid grid-cols-4 gap-4 h-full max-w-[1400px] mx-auto">
          
          {/* ESP32 Controller */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between relative shadow-lg group hover:border-cyan-500/30 transition-all">
            <div className="absolute -top-2 left-4 px-2 py-0.5 bg-cyan-600/80 text-[8px] font-black text-white tracking-widest rounded-md uppercase">Edge_Gateway</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-cyan-500/30 transition-all">
                <Cpu size={20} className="text-cyan-500/60" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wide">ESP32 Core</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">v3.4.2</p>
                </div>
              </div>
            </div>
            <div className="flex gap-0.5 items-end h-3 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-1 bg-cyan-500/20 rounded-t-sm"
                  animate={{ height: [2, Math.random() * 8 + 2, 2] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>

          {/* Relay Actuator Logic */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between relative shadow-lg hover:border-amber-500/30 transition-all">
            <div className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-600/80 text-[8px] font-black text-white tracking-widest rounded-md uppercase">Actuator</div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${isCritical ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-900 border-slate-800'}`}>
                <Zap size={20} className={isCritical ? "text-red-500" : "text-amber-500/60"} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wide">Driver</p>
                <p className={`text-[8px] font-black uppercase mt-0.5 ${isCritical ? 'text-red-500' : 'text-emerald-500'}`}>
                  {isCritical ? "SIG_INTERRUPT" : "SIG_NOMINAL"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-sm ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-emerald-500/30'}`} />
                <div className="w-2 h-2 rounded-sm bg-slate-800" />
              </div>
              <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">CH_01</span>
            </div>
          </div>

          {/* AI Neural Engine */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between relative shadow-lg hover:border-purple-500/30 transition-all">
            <div className="absolute -top-2 left-4 px-2 py-0.5 bg-purple-600/80 text-[8px] font-black text-white tracking-widest rounded-md uppercase">Neural</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                <Database size={20} className="text-purple-500/60" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wide">Inference</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">12ms</p>
              </div>
            </div>
            <div className="flex items-center gap-1 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-2 h-1.5 rounded-sm bg-purple-500/20"
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Data Uplink */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between relative shadow-lg hover:border-emerald-500/30 transition-all">
            <div className="absolute -top-2 left-4 px-2 py-0.5 bg-emerald-600/80 text-[8px] font-black text-white tracking-widest rounded-md uppercase">Telemetry</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
                <Wifi size={20} className="text-emerald-500/60" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wide">Uplink</p>
                <p className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest mt-0.5">SECURE</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[7px] font-mono text-slate-600 uppercase">
              <span>MQTT Link</span>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 rounded-full bg-emerald-500" />
            </div>
          </div>

        </div>
      </div>

      {/* --- Middle: Physical Pipeline Section --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-8 py-12">
        
        {/* Animated Logic Flow Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <DataFlowLine start={{ x: '12%', y: '5%' }} end={{ x: '12%', y: '25%' }} active={true} reverse />
          <DataFlowLine start={{ x: '35%', y: '5%' }} end={{ x: '35%', y: '25%' }} active={true} reverse />
          <DataFlowLine start={{ x: '50%', y: '5%' }} end={{ x: '50%', y: '25%' }} active={true} alert={isCritical} />
          <DataFlowLine start={{ x: '65%', y: '5%' }} end={{ x: '65%', y: '25%' }} active={true} reverse />
          <DataFlowLine start={{ x: '88%', y: '5%' }} end={{ x: '88%', y: '25%' }} active={true} reverse />
        </div>

        {/* The Giant Industrial Pipeline */}
        <div className="relative w-full flex items-center justify-between gap-2">
          
          {/* Segmented Industrial Pipe Background (Refined) */}
          <div className="absolute left-28 right-28 h-20 bg-slate-900 border-y-4 border-slate-800/80 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Liquid Flow Animation */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent w-1/4 blur-2xl opacity-60`}
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: flow > 0 ? 1.5 / (flow/5) : 0, repeat: Infinity, ease: "linear" }}
            />
            {/* Anomaly Pulse */}
            <AnimatePresence>
              {isCritical && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute inset-0 bg-red-600/20 blur-xl"
                />
              )}
            </AnimatePresence>
            {/* Pipe Internal Texture */}
            <div className="absolute inset-0 flex justify-around opacity-[0.08] pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-[2px] h-full bg-slate-400" />
              ))}
            </div>
          </div>

          {/* 1. TANK (Source) */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Reservoir" status="Online" icon={Waves}>
              <div className="relative w-28 h-40 bg-slate-950/80 border-2 border-slate-800/60 rounded-2xl overflow-hidden mb-2 shadow-inner">
                <motion.div 
                  className={`absolute bottom-0 inset-x-0 bg-gradient-to-t ${isCritical && tdsValue > 400 ? 'from-amber-600/80 to-amber-400/40' : 'from-cyan-600/80 to-cyan-400/40'}`}
                  animate={{ height: `${tankLevel}%` }}
                  transition={{ type: "spring", stiffness: 40 }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/5 backdrop-blur-[1px]">
                  <span className="text-4xl font-black text-white/90 drop-shadow-lg">{tankLevel}%</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">CAPACITY</span>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 2. FLOW SENSOR */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Flow Link" status={isCritical && flow > 8 ? "Spike" : "Nominal"} alert={isCritical && flow > 8} icon={Activity}>
              <div className="flex flex-col items-center py-3">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 mb-4 transition-all duration-500 ${isCritical && flow > 8 ? 'border-red-500/60 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
                  <motion.div 
                    animate={{ rotate: flow * 360 }} 
                    transition={{ duration: flow > 0 ? 3 / (flow/2) : 0, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings size={32} className={isCritical && flow > 8 ? 'text-red-500' : 'text-cyan-500/60'} />
                  </motion.div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-black tracking-tight ${isCritical && flow > 8 ? 'text-red-500' : 'text-white/90'}`}>{flow.toFixed(1)}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">L/MIN</div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 3. SMART VALVE (Centerpiece) */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard 
              title="Active Valve" 
              status={valveAngle === 0 ? "Locked" : "Supply"} 
              alert={valveAngle === 0}
              icon={Zap}
              className="scale-[1.05] z-30"
            >
              <div className="flex flex-col items-center py-3">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 filter drop-shadow-xl">
                    <circle cx="64" cy="64" r="58" fill="none" stroke="#1e293b" strokeWidth="6" />
                    <motion.circle
                      cx="64" cy="64" r="58" fill="none" stroke={valveAngle === 0 ? "#ef4444" : "#06b6d4"} strokeWidth="10"
                      strokeDasharray="364"
                      animate={{ strokeDashoffset: 364 - (364 * (valveAngle / 180)) }}
                      className={valveAngle === 0 ? "drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]" : "drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${valveAngle === 0 ? 'text-red-500' : 'text-white/90'}`}>{valveAngle}°</span>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">POSITION</span>
                  </div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 4. TDS SENSOR */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Purity Link" status={tdsValue > 300 ? "Caution" : "Safe"} alert={tdsValue > 300} icon={FlaskConical}>
              <div className="flex flex-col items-center py-3">
                <div className={`relative w-20 h-20 bg-slate-950/60 border-2 rounded-[1.5rem] flex items-center justify-center mb-4 transition-all duration-500 ${tdsValue > 300 ? 'border-amber-500/40 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-slate-800/80'}`}>
                  <FlaskConical size={32} className={tdsValue > 300 ? "text-amber-500" : "text-cyan-500/60"} />
                  <motion.div 
                    className="absolute -top-6 w-2 h-10 bg-slate-700/80 border-x border-slate-600/60 rounded-full"
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-black tracking-tight ${tdsValue > 300 ? "text-amber-500" : "text-white/90"}`}>{tdsValue}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">PPM (TDS)</div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 5. DISTRIBUTION (Output) */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Grid Link" status={flow > 0 ? "Supply" : "Cutoff"} alert={flow === 0} icon={Building}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <SmartCityZone name="Homes" icon={Home} active={flow > 0} />
                <SmartCityZone name="Factory" icon={Factory} active={flow > 0 && tdsValue < 300} color="blue" />
                <SmartCityZone name="Utility" icon={WaterTower} active={flow > 0} color="emerald" />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-800/60 rounded-full overflow-hidden border border-slate-700/40">
                  <motion.div 
                    className={`h-full ${flow > 0 ? 'bg-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.3)]'}`}
                    animate={{ width: flow > 0 ? "100%" : "0%" }}
                  />
                </div>
                <div className="flex justify-between items-center px-0.5">
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${flow > 0 ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                    {flow > 0 ? "GRID_ACTIVE" : "GRID_OFFLINE"}
                  </span>
                </div>
              </div>
            </ComponentCard>
          </div>

        </div>
      </div>

      {/* --- Visual Density Improvements --- */}
      <div className="absolute bottom-6 right-6 flex gap-3 pointer-events-none opacity-50">
        <div className="px-3 py-1.5 bg-slate-900/60 border border-slate-800/60 rounded-full flex items-center gap-2 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_6px_cyan]" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pulsing</span>
        </div>
        <div className="px-3 py-1.5 bg-slate-900/60 border border-slate-800/60 rounded-full flex items-center gap-2 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_emerald]" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Uplink</span>
        </div>
      </div>

    </div>
  );
}

function DataFlowLine({ start, end, active, alert, reverse = false }: any) {
  return (
    <div 
      className="absolute border-l-2 border-dashed transition-colors duration-500"
      style={{ 
        left: start.x, 
        top: start.y, 
        height: '20%',
        borderColor: alert ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.3)'
      }}
    >
      {active && (
        <motion.div 
          className={`w-2 h-2 rounded-full absolute left-[-5px] ${alert ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-cyan-400 shadow-[0_0_15px_cyan]'}`}
          animate={{ top: reverse ? ["100%", "0%"] : ["0%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
