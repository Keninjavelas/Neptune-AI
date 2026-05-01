"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, Activity, Settings, Zap, FlaskConical, Building, 
  Home, Factory, WaterTower, Cpu, Database, Wifi 
} from "lucide-react";
import { useTelemetry } from "@/context/TelemetryContext";
import { THRESHOLDS } from "@/lib/constants/thresholds";

// --- Sub-components ---

const ComponentCard = ({ children, title, status, alert = false, className = "", icon: Icon }: any) => (
    <motion.div 
    className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 shadow-xl backdrop-blur-md min-w-[180px] transition-all duration-500 snap-center ${
      alert ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-500/5" : "hover:border-slate-700/50"
    } ${className}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${alert ? 'bg-red-500/10 text-red-500' : 'bg-slate-800/80 text-cyan-500/80'}`}>
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{title}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ${alert ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse" : "bg-emerald-500/50 shadow-[0_0_6px_rgba(16,185,129,0.4)]"}`} />
    </div>
    {children}
    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
      <span className={`text-[8px] font-black uppercase tracking-widest ${alert ? "text-red-500" : "text-emerald-500/80"}`}>{status}</span>
    </div>
  </motion.div>
);

const SmartCityZone = ({ name, icon: Icon, active, color = "cyan" }: any) => {
  if (!Icon) {
    console.warn(`SmartCityZone: Icon is undefined for ${name}`);
    return null;
  }
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-500 ${
        active 
          ? `bg-${color}-500/10 border-${color}-500/40 text-${color}-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]` 
          : 'bg-slate-900/40 border-slate-800 text-slate-700'
      }`}>
        <Icon size={16} />
      </div>
      <span className={`text-[7px] font-bold uppercase tracking-widest ${active ? 'text-slate-400' : 'text-slate-600'}`}>{name}</span>
    </div>
  );
};

// --- Main Topology ---

export default function NeptuneAIInfrastructureTopology() {
  const { telemetry } = useTelemetry();
  const {
    flowRate: flow,
    tankLevel,
    tds: tdsValue,
    valveAngle,
    anomalyLevel,
    relayState,
    isManual
  } = telemetry;

  const isCritical = anomalyLevel === 2;

  return (
    <div className={`relative w-full h-full min-h-[600px] bg-slate-950/20 rounded-[1.5rem] border border-slate-800/40 flex flex-col shadow-inner transition-colors duration-1000 ${
      isCritical ? 'border-red-500/20 bg-red-500/5' : ''
    }`}>
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* --- Top: Controller & AI Logic Layer --- */}
      <div className="h-28 bg-slate-900/30 border-b border-slate-800/40 p-4 backdrop-blur-xl z-20">
        <div className="grid grid-cols-4 gap-3 h-full max-w-[1200px] mx-auto">
          
          {/* ESP32 Controller */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between relative shadow-lg group hover:border-cyan-500/30 transition-all">
            <div className="absolute -top-1.5 left-3 px-1.5 py-0.5 bg-cyan-600/80 text-[7px] font-black text-white tracking-widest rounded-md uppercase">Edge_Gateway</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-cyan-500/30 transition-all">
                <Cpu size={16} className="text-cyan-500/60" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-white uppercase tracking-wide">ESP32 Core</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1 h-1 rounded-full animate-pulse ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">v3.4.2</p>
                </div>
              </div>
            </div>
            <div className="flex gap-0.5 items-end h-2 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className={`w-1 rounded-t-sm transition-colors duration-500 ${isCritical ? 'bg-red-500/40' : 'bg-cyan-500/20'}`}
                  animate={{ height: [2, Math.random() * 6 + 2, 2] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>

          {/* Relay Actuator Logic */}
          <div className={`bg-slate-950/60 border rounded-xl p-3 flex flex-col justify-between relative shadow-lg transition-all ${relayState ? 'border-red-500 bg-red-500/5' : 'border-slate-800/80 hover:border-amber-500/30'}`}>
            <div className={`absolute -top-1.5 left-3 px-1.5 py-0.5 text-[7px] font-black text-white tracking-widest rounded-md uppercase transition-colors ${relayState ? 'bg-red-600' : 'bg-amber-600/80'}`}>Actuator</div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500 ${relayState ? 'bg-red-500/20 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-slate-900 border-slate-800'}`}>
                <Zap size={16} className={relayState ? "text-red-500 animate-pulse" : "text-amber-500/60"} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-white uppercase tracking-wide">Relay State</p>
                <p className={`text-[7px] font-black uppercase mt-0.5 ${relayState ? 'text-red-500' : 'text-emerald-500'}`}>
                  {relayState ? "TRIPPED" : "NOMINAL"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-sm ${relayState ? 'bg-red-500 animate-pulse' : 'bg-emerald-500/30'}`} />
                <div className="w-1.5 h-1.5 rounded-sm bg-slate-800" />
              </div>
              <span className="text-[6px] font-bold text-slate-600 uppercase tracking-widest">CH_01</span>
            </div>
          </div>

          {/* AI Neural Engine */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between relative shadow-lg hover:border-purple-500/30 transition-all">
            <div className="absolute -top-1.5 left-3 px-1.5 py-0.5 bg-purple-600/80 text-[7px] font-black text-white tracking-widest rounded-md uppercase">Neural</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
                <Database size={16} className="text-purple-500/60" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-white uppercase tracking-wide">Inference</p>
                <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">12ms</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-1.5 h-1 rounded-sm bg-purple-500/20"
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Data Uplink */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between relative shadow-lg hover:border-emerald-500/30 transition-all">
            <div className="absolute -top-1.5 left-3 px-1.5 py-0.5 bg-emerald-600/80 text-[7px] font-black text-white tracking-widest rounded-md uppercase">Telemetry</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
                <Wifi size={16} className="text-emerald-500/60" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-white uppercase tracking-wide">Uplink</p>
                <p className="text-[7px] font-bold text-emerald-500/80 uppercase tracking-widest mt-0.5">SECURE</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[6px] font-mono text-slate-600 uppercase">
              <span>MQTT Link</span>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 rounded-full bg-emerald-500" />
            </div>
          </div>

        </div>
      </div>

      {/* --- Middle: Physical Pipeline Section --- */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-4 py-12">
        
        {/* Animated Logic Flow Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 hidden lg:block">
          <DataFlowLine start={{ x: '12%', y: '5%' }} end={{ x: '12%', y: '25%' }} active={true} reverse />
          <DataFlowLine start={{ x: '35%', y: '5%' }} end={{ x: '35%', y: '25%' }} active={true} reverse />
          <DataFlowLine start={{ x: '50%', y: '5%' }} end={{ x: '50%', y: '25%' }} active={true} alert={isCritical} />
          <DataFlowLine start={{ x: '65%', y: '5%' }} end={{ x: '65%', y: '25%' }} active={true} reverse />
          <DataFlowLine start={{ x: '88%', y: '5%' }} end={{ x: '88%', y: '25%' }} active={true} reverse />
        </div>

        {/* The Giant Industrial Pipeline */}
        <div className="relative w-full flex overflow-x-auto overflow-y-hidden pb-6 snap-x snap-mandatory gap-6 px-4 scrollbar-hide">
          
          {/* Segmented Industrial Pipe Background (Refined) */}
          <div className={`absolute left-20 right-20 h-14 bg-slate-900 border-y-2 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-1000 hidden md:block ${
            isCritical ? 'border-red-500/50' : 'border-slate-800/80'
          }`}>
            {/* Liquid Flow Animation */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent w-1/4 blur-xl opacity-60 ${
                isCritical ? 'via-red-400/40' : 'via-cyan-400/20'
              }`}
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
                  className="absolute inset-0 bg-red-600/20 blur-lg"
                />
              )}
            </AnimatePresence>
          </div>

          {/* 1. TANK (Source) */}
          <div className="relative z-20 flex flex-col items-center w-[280px] min-w-[280px] flex-shrink-0 snap-center">
            <ComponentCard title="Reservoir" status="Online" icon={Waves} alert={tankLevel < THRESHOLDS.TANK_LEVEL.LOW}>
              <div className="relative w-20 h-28 bg-slate-950/80 border border-slate-800/60 rounded-xl overflow-hidden mb-1 shadow-inner">
                <motion.div 
                  className={`absolute bottom-0 inset-x-0 bg-gradient-to-t ${tdsValue > THRESHOLDS.TDS.WARNING ? 'from-amber-600/80 to-amber-400/40' : 'from-cyan-600/80 to-cyan-400/40'}`}
                  animate={{ height: `${tankLevel}%` }}
                  transition={{ type: "spring", stiffness: 40 }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/5 backdrop-blur-[1px]">
                  <span className="text-2xl font-black text-white/90 drop-shadow-lg">{tankLevel.toFixed(0)}%</span>
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">CAPACITY</span>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 2. FLOW SENSOR */}
          <div className="relative z-20 flex flex-col items-center w-[280px] min-w-[280px] flex-shrink-0 snap-center">
            <ComponentCard title="Flow Link" status={isCritical ? "Anomaly" : "Nominal"} alert={isCritical} icon={Activity}>
              <div className="flex flex-col items-center py-2">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-500 ${isCritical ? 'border-red-500/60 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
                  <motion.div 
                    animate={{ rotate: flow * 360 }} 
                    transition={{ duration: flow > 0 ? 3 / (flow/2) : 0, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings size={24} className={isCritical ? 'text-red-500' : 'text-cyan-500/60'} />
                  </motion.div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-black tracking-tight ${isCritical ? 'text-red-500' : 'text-white/90'}`}>{flow.toFixed(1)}</div>
                  <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{THRESHOLDS.FLOW_RATE.UNIT}</div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 3. SMART VALVE (Centerpiece) */}
          <div className="relative z-20 flex flex-col items-center w-[280px] min-w-[280px] flex-shrink-0 snap-center">
            <ComponentCard 
              title="Active Valve" 
              status={valveAngle === 0 ? "Locked" : "Supply"} 
              alert={valveAngle === 0}
              icon={Zap}
              className="scale-[1.05] z-30"
            >
              <div className="flex flex-col items-center py-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: valveAngle }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0"
                  >
                    <svg className="w-full h-full -rotate-90 filter drop-shadow-xl">
                      <circle cx="48" cy="48" r="44" fill="none" stroke="#1e293b" strokeWidth="4" />
                      <motion.circle
                        cx="48" cy="48" r="44" fill="none" stroke={valveAngle === 0 ? "#ef4444" : "#06b6d4"} strokeWidth="6"
                        strokeDasharray="276"
                        animate={{ strokeDashoffset: 276 - (276 * (valveAngle / 180)) }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={valveAngle === 0 ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"}
                      />
                    </svg>
                  </motion.div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-black ${valveAngle === 0 ? 'text-red-500' : 'text-white/90'}`}>{valveAngle.toFixed(0)}°</span>
                    <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">POSITION</span>
                  </div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 4. TDS SENSOR */}
          <div className="relative z-20 flex flex-col items-center w-[280px] min-w-[280px] flex-shrink-0 snap-center">
            <ComponentCard title="Purity Link" status={tdsValue > THRESHOLDS.TDS.WARNING ? "Caution" : "Safe"} alert={tdsValue > THRESHOLDS.TDS.WARNING} icon={FlaskConical}>
              <div className="flex flex-col items-center py-2">
                <div className={`relative w-14 h-14 bg-slate-950/60 border rounded-xl flex items-center justify-center mb-2 transition-all duration-500 ${tdsValue > THRESHOLDS.TDS.WARNING ? 'border-amber-500/40 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-800/80'}`}>
                  <FlaskConical size={24} className={tdsValue > THRESHOLDS.TDS.WARNING ? "text-amber-500" : "text-cyan-500/60"} />
                  <motion.div 
                    className="absolute -top-4 w-1.5 h-6 bg-slate-700/80 border-x border-slate-600/60 rounded-full"
                    animate={{ y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                </div>
                <div className="text-center">
                  <div className={`text-xl font-black tracking-tight ${tdsValue > THRESHOLDS.TDS.WARNING ? "text-amber-500" : "text-white/90"}`}>{tdsValue}</div>
                  <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{THRESHOLDS.TDS.UNIT} (TDS)</div>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* 5. DISTRIBUTION (Output) */}
          <div className="relative z-20 flex flex-col items-center w-[280px] min-w-[280px] flex-shrink-0 snap-center">
            <ComponentCard title="Grid Link" status={flow > 0 ? "Supply" : "Cutoff"} alert={flow === 0} icon={Building}>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <SmartCityZone name="Homes" icon={Home} active={flow > 0} />
                <SmartCityZone name="Factory" icon={Factory} active={flow > 0 && tdsValue < THRESHOLDS.TDS.WARNING} color="blue" />
                <SmartCityZone name="Utility" icon={WaterTower} active={flow > 0} color="emerald" />
              </div>
              <div className="space-y-1.5">
                <div className="h-1 w-full bg-slate-800/60 rounded-full overflow-hidden border border-slate-700/40">
                  <motion.div 
                    className={`h-full ${flow > 0 ? 'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]'}`}
                    animate={{ width: flow > 0 ? "100%" : "0%" }}
                  />
                </div>
                <div className="flex justify-between items-center px-0.5">
                  <span className={`text-[7px] font-bold uppercase tracking-widest ${flow > 0 ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                    {flow > 0 ? "GRID_ACTIVE" : "GRID_OFFLINE"}
                  </span>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* Spacer for horizontal scroll breathing room */}
          <div className="min-w-[32px] h-1 md:hidden" aria-hidden="true" />

        </div>
      </div>

      {/* --- Visual Density Improvements --- */}
      <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none opacity-50">
        <div className="px-2 py-1 bg-slate-900/60 border border-slate-800/60 rounded-full flex items-center gap-1.5 backdrop-blur-md">
          <div className={`w-1 h-1 rounded-full shadow-sm ${isCritical ? 'bg-red-500 shadow-red-500/50' : 'bg-cyan-500 shadow-cyan-500/50'}`} />
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Pulsing</span>
        </div>
        <div className="px-2 py-1 bg-slate-900/60 border border-slate-800/60 rounded-full flex items-center gap-1.5 backdrop-blur-md">
          <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_emerald]" />
          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Uplink</span>
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
