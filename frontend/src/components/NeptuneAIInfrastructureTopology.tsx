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
    className={`bg-slate-900/90 border-2 rounded-2xl p-6 shadow-2xl backdrop-blur-md min-w-[260px] transition-all duration-500 ${
      alert ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-pulse" : "border-slate-800"
    } ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{title}</span>
      </div>
      <div className={`w-2.5 h-2.5 rounded-full ${alert ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"}`} />
    </div>
    {children}
    <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational State</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${alert ? "text-red-500" : "text-emerald-500"}`}>{status}</span>
    </div>
  </motion.div>
);

const SmartCityZone = ({ name, icon: Icon, active, color = "cyan" }: any) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${
      active 
        ? `bg-${color}-500/10 border-${color}-500/40 text-${color}-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]` 
        : 'bg-slate-900 border-slate-800 text-slate-700'
    }`}>
      <Icon size={24} />
      {active && (
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-slate-300' : 'text-slate-600'}`}>{name}</span>
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
    <div className="relative w-full h-full min-h-[950px] bg-slate-950/40 rounded-[2.5rem] border-2 border-slate-800/50 overflow-hidden flex flex-col shadow-inner">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* --- Top: Controller & AI Logic Layer (Moved UP) --- */}
      <div className="h-48 bg-slate-900/40 border-b border-slate-800/50 p-8 backdrop-blur-xl z-20">
        <div className="grid grid-cols-4 gap-6 h-full max-w-[1600px] mx-auto">
          
          {/* ESP32 Controller */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl group hover:border-cyan-500/30 transition-all">
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-cyan-500 text-[9px] font-black text-slate-950 tracking-[0.2em] rounded-full uppercase">Edge_Gateway</div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border-2 border-slate-800 group-hover:border-cyan-500/30 transition-all">
                <Cpu size={24} className="text-cyan-500/60" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">ESP32 Core</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">v3.4.2-STABLE</p>
                </div>
              </div>
            </div>
            <div className="flex gap-1 items-end h-4">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-1 bg-cyan-500/30 rounded-full"
                  animate={{ height: [4, Math.random() * 12 + 4, 4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>

          {/* Relay Actuator Logic */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl hover:border-amber-500/30 transition-all">
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-500 text-[9px] font-black text-slate-950 tracking-[0.2em] rounded-full uppercase">Actuator_Logic</div>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${isCritical ? 'bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-slate-900 border-slate-800'}`}>
                <Zap size={24} className={isCritical ? "text-red-500" : "text-amber-500/60"} />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Solenoid Driver</p>
                <p className={`text-[9px] font-black uppercase mt-0.5 ${isCritical ? 'text-red-500' : 'text-emerald-500'}`}>
                  {isCritical ? "SIG_INTERRUPT" : "SIG_NOMINAL"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-emerald-500/20'}`} />
                <div className="w-3 h-3 rounded-sm bg-slate-800" />
              </div>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-mono">RELAY_CH_01</span>
            </div>
          </div>

          {/* AI Neural Engine */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl hover:border-purple-500/30 transition-all">
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-purple-500 text-[9px] font-black text-slate-950 tracking-[0.2em] rounded-full uppercase">Neural_Inference</div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border-2 border-slate-800">
                <Database size={24} className="text-purple-500/60" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">TensorFlow Lite</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Latency: 12ms</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <motion.div 
                    className="w-2 h-2 rounded-[2px] bg-purple-500/40"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  />
                  <div className="w-2 h-2 rounded-[2px] bg-slate-800" />
                </div>
              ))}
            </div>
          </div>

          {/* Data Uplink */}
          <div className="bg-slate-950/80 border-2 border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl hover:border-emerald-500/30 transition-all">
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-emerald-500 text-[9px] font-black text-slate-950 tracking-[0.2em] rounded-full uppercase">Uplink_Secure</div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border-2 border-slate-800">
                <Wifi size={24} className="text-emerald-500/60" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Telemetry Link</p>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5 animate-pulse">MQTT_ENCRYPTED</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
              <span>RX: 1.2KB/s</span>
              <span>TX: 0.8KB/s</span>
            </div>
          </div>

        </div>
      </div>

      {/* --- Middle: Physical Pipeline Section --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-8 py-16">
        
        {/* Animated Logic Flow Lines (Controller to Components) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <DataFlowLine start={{ x: '12%', y: '10%' }} end={{ x: '12%', y: '30%' }} active={true} reverse />
          <DataFlowLine start={{ x: '35%', y: '10%' }} end={{ x: '35%', y: '30%' }} active={true} reverse />
          <DataFlowLine start={{ x: '50%', y: '10%' }} end={{ x: '50%', y: '30%' }} active={true} alert={isCritical} />
          <DataFlowLine start={{ x: '65%', y: '10%' }} end={{ x: '65%', y: '30%' }} active={true} reverse />
          <DataFlowLine start={{ x: '88%', y: '10%' }} end={{ x: '88%', y: '30%' }} active={true} reverse />
        </div>

        {/* The Giant Industrial Pipeline */}
        <div className="relative w-full flex items-center justify-between gap-4">
          
          {/* Segmented Industrial Pipe Background (THICKER) */}
          <div className="absolute left-32 right-32 h-28 bg-slate-900 border-y-[6px] border-slate-800 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Liquid Flow Animation */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent w-1/3 blur-3xl opacity-70`}
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: flow > 0 ? 1.2 / (flow/5) : 0, repeat: Infinity, ease: "linear" }}
            />
            {/* Anomaly Pulse */}
            <AnimatePresence>
              {isCritical && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="absolute inset-0 bg-red-600/30 blur-2xl"
                />
              )}
            </AnimatePresence>
            {/* Pipe Internal Texture */}
            <div className="absolute inset-0 flex justify-around opacity-[0.15] pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-[4px] h-full bg-slate-400" />
              ))}
            </div>
          </div>

          {/* 1. TANK (Source) */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Source Reservoir" status="Online" icon={Waves}>
              <div className="relative w-32 h-48 bg-slate-950 border-4 border-slate-800 rounded-2xl overflow-hidden mb-3 shadow-inner">
                <motion.div 
                  className={`absolute bottom-0 inset-x-0 bg-gradient-to-t ${isCritical && tdsValue > 400 ? 'from-amber-600 to-amber-400' : 'from-cyan-600 to-cyan-400'}`}
                  animate={{ height: `${tankLevel}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/10 backdrop-blur-[2px]">
                  <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{tankLevel}%</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">CAPACITY</span>
                </div>
                {/* Surface Ripple */}
                <motion.div 
                  className="absolute bottom-[tankLevel%] left-0 right-0 h-2 bg-white/30 blur-md"
                  animate={{ y: [0, -4, 0], scaleX: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
            </ComponentCard>
          </div>

          {/* 2. FLOW SENSOR */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Flow Analyzer" status={isCritical && flow > 8 ? "Alert: High" : "Nominal"} alert={isCritical && flow > 8} icon={Activity}>
              <div className="flex flex-col items-center py-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-[6px] mb-6 transition-all duration-500 ${isCritical && flow > 8 ? 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-cyan-500/40 bg-cyan-500/5'}`}>
                  <motion.div 
                    animate={{ rotate: flow * 360 }} 
                    transition={{ duration: flow > 0 ? 2 / (flow/2) : 0, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings size={44} className={isCritical && flow > 8 ? 'text-red-500' : 'text-cyan-400'} />
                  </motion.div>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-black tracking-tighter ${isCritical && flow > 8 ? 'text-red-500' : 'text-white'}`}>{flow.toFixed(1)}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">LITERS / MIN</div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 3. SMART VALVE (Centerpiece) */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard 
              title="Autonomous Valve" 
              status={valveAngle === 0 ? "Line Locked" : "Supply Open"} 
              alert={valveAngle === 0}
              icon={Zap}
              className="scale-[1.15] -translate-y-4"
            >
              <div className="flex flex-col items-center py-4">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    <circle cx="72" cy="72" r="64" fill="none" stroke="#1e293b" strokeWidth="10" />
                    <motion.circle
                      cx="72" cy="72" r="64" fill="none" stroke={valveAngle === 0 ? "#ef4444" : "#06b6d4"} strokeWidth="14"
                      strokeDasharray="402"
                      animate={{ strokeDashoffset: 402 - (402 * (valveAngle / 180)) }}
                      className={valveAngle === 0 ? "drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" : "drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${valveAngle === 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{valveAngle}°</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">POSITION</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <div className={`px-5 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${isManual ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                    {isManual ? "MANUAL_MODE" : "AI_AUTONOMOUS"}
                  </div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 4. TDS SENSOR */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Purity Scanner" status={tdsValue > 300 ? "Alert: Quality" : "Pure"} alert={tdsValue > 300} icon={FlaskConical}>
              <div className="flex flex-col items-center py-4">
                <div className={`relative w-24 h-24 bg-slate-950 border-[6px] rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 ${tdsValue > 300 ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'border-slate-800'}`}>
                  <div className="absolute inset-0 bg-cyan-500/5 animate-pulse rounded-3xl" />
                  <FlaskConical size={40} className={tdsValue > 300 ? "text-amber-500" : "text-cyan-400"} />
                  {/* Probe Animation */}
                  <motion.div 
                    className="absolute -top-8 w-3 h-12 bg-slate-700 border-x-2 border-slate-600 rounded-full"
                    animate={{ y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-black tracking-tighter ${tdsValue > 300 ? "text-amber-500" : "text-white"}`}>{tdsValue}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">TOTAL SOLIDS (PPM)</div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 5. DISTRIBUTION (Output) */}
          <div className="relative z-20 flex flex-col items-center">
            <ComponentCard title="Smart City Grid" status={flow > 0 ? "Supply Active" : "Interrupted"} alert={flow === 0} icon={Building}>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <SmartCityZone name="Homes" icon={Home} active={flow > 0} />
                <SmartCityZone name="Industry" icon={Factory} active={flow > 0 && tdsValue < 300} color="blue" />
                <SmartCityZone name="Utility" icon={WaterTower} active={flow > 0} color="emerald" />
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <motion.div 
                    className={`h-full ${flow > 0 ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}
                    animate={{ width: flow > 0 ? "100%" : "0%" }}
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${flow > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {flow > 0 ? "GRID_BALANCED" : "GRID_OFFLINE"}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${flow > 0 ? 'bg-emerald-500' : 'bg-red-500'} opacity-${30 + (i * 30)}`} />
                    ))}
                  </div>
                </div>
              </div>
            </ComponentCard>
          </div>

        </div>
      </div>

      {/* --- Visual Density Improvements (Status Indicators) --- */}
      <div className="absolute bottom-8 right-8 flex gap-4 pointer-events-none">
        <div className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full flex items-center gap-2 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Flow Pulsing</span>
        </div>
        <div className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full flex items-center gap-2 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_emerald]" />
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Network Live</span>
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
