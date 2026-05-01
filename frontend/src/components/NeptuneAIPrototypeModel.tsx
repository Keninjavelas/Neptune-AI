"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Waves, 
  Settings, 
  AlertTriangle, 
  Activity,
  ShieldCheck,
  Building,
  Droplet
} from "lucide-react";

interface PrototypeModelProps {
  flow: number;
  tankLevel: number;
  tdsValue: number;
  valveAngle: number;
  status: string;
  isManual: boolean;
}

const Label = ({ text, className = "" }: { text: string; className?: string }) => (
  <div className={`bg-slate-950/80 border border-slate-700 px-2 py-1 rounded text-[8px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap pointer-events-none shadow-sm ${className}`}>
    {text}
  </div>
);

export default function NeptuneAIPrototypeModel({ 
  flow, 
  tankLevel, 
  tdsValue, 
  valveAngle, 
  status,
  isManual 
}: PrototypeModelProps) {
  const isCritical = status === "critical";

  return (
    <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Base Platform */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a,0%,#020617_100%)] opacity-50" />
      <div className="absolute inset-x-8 bottom-8 top-16 bg-slate-900/40 rounded-xl border border-white/5 shadow-inner" />
      
      {/* 1. Water Source Area (Left) */}
      <div className="absolute left-16 top-32 w-32 h-48">
        <Label text="Tank Level Monitoring" className="absolute -top-6 left-0" />
        <div className="relative w-full h-full bg-cyan-500/5 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
          <motion.div 
            className={`absolute bottom-0 inset-x-0 bg-gradient-to-t ${isCritical && tdsValue > 400 ? 'from-amber-500/40 to-amber-400/20' : 'from-cyan-500/40 to-cyan-400/20'}`}
            initial={false}
            animate={{ height: `${tankLevel}%` }}
          />
        </div>
      </div>

      {/* 2. Piping Pipeline (Center) */}
      <div className="absolute left-48 top-64 right-64 h-4">
        <div className="relative w-full h-full bg-slate-700 border-y border-slate-600 rounded-full">
          {/* Flow Animation */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent w-20 rounded-full"
            animate={{ x: ["0%", "400%"] }}
            transition={{ duration: flow > 0 ? 3 / (flow/5) : 0, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Flow Sensor */}
          <div className="absolute left-12 -top-4 w-10 h-12 flex flex-col items-center">
            <Label text="Flow Sensor" className="-top-6 absolute" />
            <div className="w-8 h-8 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center">
              <motion.div animate={{ rotate: flow * 60 }} transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}>
                <Activity size={14} className="text-cyan-500" />
              </motion.div>
            </div>
          </div>

          {/* Solenoid Valve */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-16 flex flex-col items-center">
            <Label text="Shutoff Valve" className="-top-6 absolute" />
            <div className={`w-10 h-10 rounded-lg border-2 ${valveAngle === 0 ? 'bg-red-500/20 border-red-500' : 'bg-slate-800 border-slate-600'}`}>
              <motion.div className="w-full h-full flex items-center justify-center" animate={{ rotate: valveAngle }}>
                <Settings size={20} className={valveAngle === 0 ? 'text-red-500' : 'text-slate-400'} />
              </motion.div>
            </div>
          </div>

          {/* TDS Sensor */}
          <div className="absolute right-12 -top-8 w-16 h-12 flex flex-col items-center">
            <Label text="Quality Sensor" className="-top-6 absolute" />
            <div className="w-12 h-8 bg-slate-800 border border-slate-600 rounded-t-lg flex items-center justify-center">
              <div className="text-[10px] font-mono text-cyan-400">{tdsValue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Electronics Section (Bottom) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80 h-32 bg-slate-900/60 border border-white/5 rounded-xl p-4 backdrop-blur-md">
        <Label text="ESP32 Controller" className="absolute -top-3 left-4" />
        <div className="flex gap-6 h-full items-center">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 relative overflow-hidden">
            <Cpu size={24} className="text-slate-500 absolute top-2 right-2 opacity-50" />
          </div>
          <div className="w-24 flex flex-col gap-2 h-full">
            <div className={`flex-1 rounded-lg border flex items-center justify-center gap-2 ${isCritical ? 'bg-red-500/20 border-red-500' : 'bg-slate-800 border-slate-700'}`}>
              <ShieldCheck size={16} className={isCritical ? 'text-red-500' : 'text-slate-500'} />
              <span className="text-[10px] font-black text-slate-400 uppercase">Relay</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Distribution Network (Right) */}
      <div className="absolute right-12 top-24 w-40 h-64 flex flex-col items-center">
        <Label text="Smart City" className="absolute -top-6 right-0" />
        <div className="w-full h-full relative">
          <div className="absolute bottom-0 w-full h-32 flex justify-around items-end px-2">
            <Building className="text-slate-700" size={48} />
          </div>
        </div>
      </div>

      {/* Overlay Title Board */}
      <div className="absolute inset-x-0 top-0 h-16 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Cpu className="text-slate-950" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter text-slate-50 uppercase">NEPTUNE AI</h2>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">Smart Infrastructure Prototype</p>
          </div>
        </div>
      </div>
    </div>
  );
}
