"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export type TelemetryLog = {
  id: string;
  ts: number;
  source: "SYS" | "AI_CORE" | "ALERT";
  message: string;
};

/**
 * Enterprise-Grade Neptune AI Telemetry Hook
 * Optimized for Information Architecture (IA) and high-fidelity monitoring.
 */
export default function useMockTelemetry(initialFlow = 5.4) {
  const [flow, setFlow] = useState<number>(initialFlow);
  const [valveAngle, setValveAngle] = useState<number>(90);
  const [isManual, setIsManual] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<number>(0);
  const [status, setStatus] = useState<"online" | "critical">("online");
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const pushLog = useCallback((source: TelemetryLog["source"], message: string) => {
    const entry: TelemetryLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      source,
      message,
    };
    // Prepend logs and keep buffer small for IA clarity
    setLogs((s) => [entry, ...s].slice(0, 15));
  }, []);

  useEffect(() => {
    // Initial sequence
    pushLog("SYS", "Neptune AI Enterprise Gateway — Link Established.");

    const interval = setInterval(() => {
      if (!mounted.current) return;

      // 1. Simulate Realistic Flow Fluctuations
      const noise = (Math.random() - 0.5) * 0.4;
      const drift = (5.4 - flow) * 0.1;
      let nextFlow = +(flow + noise + drift).toFixed(2);
      
      // 2. Anomaly Logic (Throttled for enterprise usability)
      if (Math.random() < 0.04 && status === "online") {
        setStatus("critical");
        setAlerts(a => a + 1);
        nextFlow = +(nextFlow + Math.random() * 3 + 2).toFixed(2);
        pushLog("ALERT", `Unusual flow variance: ${nextFlow} L/min detected.`);
        
        // Auto-mitigation command simulation
        setTimeout(() => {
          if (!isManual) {
            setValveAngle(45);
            pushLog("AI_CORE", "Autonomous mitigation: Valve restricted to 45°.");
          }
        }, 1500);

        // Auto-recovery after 8 seconds
        setTimeout(() => {
          setStatus("online");
          if (!isManual) {
            setValveAngle(90);
            pushLog("SYS", "Flow stabilized. Autonomous restoration complete.");
          }
        }, 8000);
      }

      setFlow(nextFlow);

      // 3. Gentle valve drift simulation (only if not manual)
      if (!isManual && status === "online") {
        setValveAngle((v) => {
          const adj = (Math.random() - 0.5) * 1.5;
          return Math.min(180, Math.max(0, Math.round(v + adj)));
        });
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [flow, status, isManual, pushLog]);

  return {
    flow,
    valveAngle,
    isManual,
    alerts,
    status,
    logs,
    setIsManual,
    setValveAngle: (a: number) => {
      setValveAngle(a);
      if (isManual) pushLog("SYS", `Manual override: Valve set to ${a}°.`);
    },
    resetAlerts: () => {
      setAlerts(0);
      setStatus("online");
      pushLog("SYS", "Alert state manually acknowledged by operator.");
    }
  };
}
