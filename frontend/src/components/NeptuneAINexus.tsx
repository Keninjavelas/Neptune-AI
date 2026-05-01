"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Activity, AlertTriangle, ShieldCheck, Cpu, Terminal as TerminalIcon, Power } from 'lucide-react';
import useMockTelemetry from '../hooks/useMockTelemetry';
import { useScrambleText } from '../hooks/useScrambleText';
import LivingBackground from './LivingBackground';
import HoloGlassCard from './HoloGlassCard';
import MechanicalValveHUD from './MechanicalValveHUD';

// --- Sub-components ---

const MetricValue = ({ value, isCritical }: { value: string | number, isCritical: boolean }) => {
  const scrambled = useScrambleText(value);
  return (
    <span className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)] ${isCritical ? "animate-chromatic" : ""}`}>
      {scrambled}
    </span>
  );
};

const TerminalLog = ({ logs }: { logs: any[] }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 scrollbar-hide">
      <AnimatePresence initial={false}>
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex gap-2"
          >
            <span className={`shrink-0 ${log.source === 'ALERT' ? 'text-red-500' : log.source === 'AI_CORE' ? 'text-cyan-400' : 'text-slate-500'}`}>
              [{log.source}]
            </span>
            <span className="text-slate-300 uppercase tracking-tighter">{log.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page ---

export default function NeptuneAINexus() {
  const { flow, valveAngle, status, logs, setValveAngle, isManual, setIsManual } = useMockTelemetry();
  const isCritical = status === "critical";

  return (
    <div className={`relative min-h-screen w-full overflow-hidden text-slate-50 font-sans ${isCritical ? "animate-shake" : ""}`}>
      <LivingBackground isCritical={isCritical} />
      
      {/* Overlay Distortion Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <main className="relative z-10 max-w-7xl mx-auto p-8 h-screen flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-sm font-black uppercase tracking-[0.5em] text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              Neptune AI Nexus
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              God-Mode Command Interface // v4.0.0
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-black">Link Status</span>
              <span className={`text-xs font-mono font-bold ${isCritical ? "text-red-500" : "text-emerald-500 animate-pulse"}`}>
                {isCritical ? "ENVIRONMENT DISTORTION" : "STABLE // NEURAL LINK ACTIVE"}
              </span>
            </div>
            <ShieldCheck className={isCritical ? "text-red-500 animate-shake" : "text-cyan-500"} size={32} />
          </div>
        </header>

        {/* Top Row Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-1/3">
          <HoloGlassCard isCritical={isCritical} className="p-8 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current Flow</span>
              <Droplet className={isCritical ? "text-red-500" : "text-cyan-400"} size={20} />
            </div>
            <div className="flex items-baseline gap-2">
              <MetricValue value={flow?.toFixed(2) ?? "0.00"} isCritical={isCritical} />
              <span className="text-xl font-black text-slate-600 uppercase">LPM</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${isCritical ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"}`}
                animate={{ width: `${((flow ?? 0) / 10) * 100}%` }}
              />
            </div>
          </HoloGlassCard>

          <HoloGlassCard isCritical={isCritical} className="p-8 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">System Pressure</span>
              <Activity className={isCritical ? "text-red-500" : "text-cyan-400"} size={20} />
            </div>
            <div className="flex items-baseline gap-2">
              <MetricValue value={isCritical ? "HIGH" : "NOMINAL"} isCritical={isCritical} />
            </div>
            <div className="flex gap-1">
              {[...Array(24)].map((_, i) => (
                <motion.div 
                  key={i}
                  className={`flex-1 h-2 rounded-sm ${isCritical ? "bg-red-500/40" : "bg-cyan-500/20"}`}
                  animate={isCritical ? { opacity: [0.2, 1, 0.2] } : {}}
                  transition={{ delay: i * 0.05, repeat: Infinity }}
                />
              ))}
            </div>
          </HoloGlassCard>

          <HoloGlassCard isCritical={isCritical} className="p-8 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Neural Confidence</span>
              <Cpu className={isCritical ? "text-red-500" : "text-cyan-400"} size={20} />
            </div>
            <div className="flex items-baseline gap-2">
              <MetricValue value={isCritical ? 42 : 99} isCritical={isCritical} />
              <span className="text-xl font-black text-slate-600 uppercase">%</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              Processing {isCritical ? "Anomaly Distortion..." : "Real-time Telemetry..."}
            </p>
          </HoloGlassCard>
        </div>

        {/* Middle Row: Valve HUD and Terminal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
          {/* Valve Control */}
          <HoloGlassCard isCritical={isCritical} className="p-8 flex items-center justify-around">
            <MechanicalValveHUD angle={valveAngle} isCritical={isCritical} />
            
            <div className="space-y-8 w-1/3">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Power size={14} className="text-cyan-500" />
                  Smart Actuator
                </h3>
                <p className="text-[10px] text-slate-600 leading-relaxed uppercase font-bold">
                  SG90 Servo synchronization active. Real-time angular correction enabled.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Manual Override</span>
                  <button 
                    onClick={() => {
                      setIsManual(!isManual);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-500 ${isManual ? "bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)]" : "bg-white/5"}`}
                  >
                    <motion.div 
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                      animate={{ x: isManual ? 24 : 0 }}
                    />
                  </button>
                </div>
                
                <input 
                  type="range" min="0" max="180" value={valveAngle}
                  disabled={!isManual}
                  onChange={(e) => setValveAngle(parseInt(e.target.value))}
                  className={`w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${!isManual && "opacity-20 pointer-events-none"}`}
                />
              </div>
            </div>
          </HoloGlassCard>

          {/* AI Core Terminal */}
          <HoloGlassCard isCritical={isCritical} className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon className="text-cyan-500" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Core Event Feed</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-pulse delay-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20 animate-pulse delay-150" />
              </div>
            </div>
            <TerminalLog logs={logs} />
          </HoloGlassCard>
        </div>

      </main>
    </div>
  );
}
