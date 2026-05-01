"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useMockTelemetry from "../hooks/useMockTelemetry";
import { AnimatePresence, motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Droplet, Zap, Activity } from "lucide-react";

function MetricCard({ title, value, icon, colorClass }: any) {
  return (
    <div className="col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide">{title}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={String(value)}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.36 }}
              className="flex items-baseline gap-2"
            >
              <p className={`text-2xl font-semibold text-slate-50 ${colorClass}`}>{value}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-slate-400">{icon}</div>
      </div>
    </div>
  );
}

export default function NeptuneAICommandCenter() {
  const { flow, valveAngle, alerts, status, logs, setValveAngle, pushLog } = useMockTelemetry(4.2);
  const [manualOverride, setManualOverride] = useState(false);
  const chartData = useMemo(() => {
    // create a small ring buffer from logs timestamps to simulate series
    const now = Date.now();
    return Array.from({ length: 24 }).map((_, i) => ({
      timestamp: new Date(now - (23 - i) * 2000).toLocaleTimeString().slice(3),
      flow: +(4.0 + Math.sin((i / 24) * Math.PI * 2) * 1.2 + (Math.random() - 0.5) * 0.15).toFixed(2),
    }));
  }, [logs]);

  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen p-8 bg-slate-950 text-slate-50">
      <div className="grid grid-cols-3 gap-8">
        {/* Left - Visual Data (span 2) */}
        <div className="col-span-2 space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              title="System Status"
              value={status === "online" ? "Online" : "Offline"}
              icon={
                <div className="relative w-4 h-4">
                  <span className={`absolute inset-0 rounded-full ${status === "online" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className={`absolute inset-0 rounded-full ${status === "online" ? "animate-pulse" : "opacity-80"}`} />
                </div>
              }
              colorClass={status === "online" ? "text-emerald-400" : "text-red-400"}
            />

            <MetricCard
              title="Current Flow"
              value={`${flow.toFixed(2)} L/min`}
              icon={<Droplet className="w-5 h-5 text-cyan-400" />}
              colorClass="text-cyan-400"
            />

            <MetricCard
              title="Active Alerts"
              value={alerts}
              icon={<Zap className="w-5 h-5 text-amber-400" />}
              colorClass={alerts > 0 ? "text-amber-400" : "text-slate-400"}
            />
          </div>

          {/* Telemetry Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm text-slate-400 mb-2">Water Flow — Live Telemetry</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 6, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#334155" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 8]} />
                  <Tooltip contentStyle={{ background: "#0f1724", border: "1px solid #334155" }} />
                  <Area type="monotone" dataKey="flow" stroke="#06b6d4" strokeWidth={2.5} fill="url(#g1)" isAnimationActive />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Digital Twin Valve HUD */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 flex items-center gap-6">
            <div className="w-64 h-64 flex items-center justify-center relative">
              <motion.svg
                viewBox="0 0 220 220"
                className="w-56 h-56"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g transform="translate(110,110)">
                  <circle r="96" stroke="#334155" strokeWidth="2" fill="none" />
                  <circle r="86" strokeDasharray="6 8" stroke="#475569" strokeWidth="2" fill="none" />
                  <g transform={`rotate(${valveAngle - 90})`}>
                    <path d="M-60 0 A60 60 0 0 1 60 0" stroke="#06b6d4" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#glow)" />
                  </g>
                  <circle r="44" fill="#0f1724" stroke="#0ea5b7" strokeWidth="1" />
                  <text x="0" y="6" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">{valveAngle}°</text>
                </g>
              </motion.svg>
            </div>

            <div className="flex-1">
              <h4 className="text-lg font-semibold">SG90 Valve — Digital Twin</h4>
              <p className="text-sm text-slate-400 mt-2">Angle & status visualization with live feedback loop</p>

              <div className="mt-6 flex items-center gap-4">
                <label className="inline-flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={manualOverride} onChange={(e) => setManualOverride(e.target.checked)} />
                    <div className={`w-14 h-7 rounded-full transition-colors ${manualOverride ? "bg-cyan-500/80 shadow-[inset_0_0_20px_rgba(6,182,212,0.15)]" : "bg-slate-700/60"}`}></div>
                    <span className={`dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform ${manualOverride ? "translate-x-7" : ""}`} />
                  </div>
                  <span className="ml-3 text-sm text-slate-50">Manual Override</span>
                </label>

                <div className="flex-1">
                  <input
                    className="w-full"
                    type="range"
                    min={0}
                    max={180}
                    value={valveAngle}
                    onChange={(e) => { setValveAngle(Number(e.target.value)); pushLog("SYS", `Manual angle set to ${e.target.value}°`); }}
                    disabled={!manualOverride}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - AI Terminal */}
        <div className="col-span-1">
          <div className="h-[80vh] flex flex-col bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-medium">Live System Feed</h3>
              </div>
              <div className="text-xs text-slate-400">ESP32 · AI Core</div>
            </div>

            <div ref={terminalRef} className="flex-1 overflow-auto p-4 font-mono text-sm space-y-2">
              <AnimatePresence initial={false} mode="popLayout">
                {logs.map((l) => (
                  <motion.div
                    key={l.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -6, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="flex items-start gap-3"
                  >
                    <span className={`text-xs ${l.source === "AI_CORE" ? "text-cyan-400" : l.source === "ALERT" ? "text-red-400" : "text-slate-400"}`}>
                      [{l.source}]
                    </span>
                    <div className="flex-1 break-words text-slate-200">{l.message}</div>
                    <div className="text-xs text-slate-500">{new Date(l.ts).toLocaleTimeString()}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-3 border-t border-slate-700/30 flex items-center gap-3">
              <input
                className="flex-1 bg-slate-900/30 border border-slate-700/20 rounded px-3 py-2 text-sm text-slate-200 font-mono"
                placeholder="Send a command to AI core (simulated)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v) {
                      pushLog("AI_CORE", v);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button className="px-3 py-2 bg-cyan-500 text-black rounded text-sm" onClick={() => pushLog("AI_CORE", "Heartbeat ping sent")}>Ping</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
