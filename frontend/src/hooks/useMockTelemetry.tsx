"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export type TelemetryLog = {
  id: string;
  ts: number;
  source: "SYS" | "AI_CORE" | "ALERT";
  message: string;
};

/**
 * Custom hook to simulate real-time IoT telemetry from an ESP32.
 * Fluctuates flow rate, triggers anomalies, and manages a live log feed.
 */
export default function useMockTelemetry(initialFlow = 4.2) {
  const [flow, setFlow] = useState<number>(initialFlow);
  const [valveAngle, setValveAngle] = useState<number>(90);
  const [alerts, setAlerts] = useState<number>(0);
  const [status, setStatus] = useState<"online" | "offline">("online");
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
    setLogs((s) => [...s, entry].slice(-100));
  }, []);

  useEffect(() => {
    // Startup sequence
    pushLog("SYS", "Neptune AI Command Center v2.5.0 initializing...");
    pushLog("SYS", "ESP32 Uplink established via WebSocket (Secure)");
    pushLog("AI_CORE", "Neural monitoring core engaged — processing baseline flow");

    const interval = setInterval(() => {
      if (!mounted.current) return;

      // 1. Randomly fluctuate flow rate every 2 seconds
      const noise = (Math.random() - 0.5) * 0.4;
      const drift = (4.2 - flow) * 0.1;
      let nextFlow = +(flow + noise + drift).toFixed(2);
      if (nextFlow < 0) nextFlow = 0;
      setFlow(nextFlow);

      // 2. Occasionally trigger an anomaly (8% chance)
      if (Math.random() < 0.08) {
        const drop = +(Math.random() * 2 + 0.5).toFixed(2);
        const anomalyFlow = Math.max(0.1, +(nextFlow - drop).toFixed(2));
        setFlow(anomalyFlow);
        setAlerts((a) => a + 1);
        
        pushLog("ALERT", `Critical flow variance: ${anomalyFlow} L/min detected`);
        pushLog("AI_CORE", `Anomaly classifier: Probable leak signature identified.`);
        
        // 3. Update valve angle automatically on anomaly
        const mitigationAngle = Math.max(15, Math.floor(Math.random() * 45));
        setValveAngle(mitigationAngle);
        pushLog("AI_CORE", `Proactive mitigation: Valve angle restricted to ${mitigationAngle}°`);
      }

      // 4. Small random valve drift (simulation of physical vibration/micro-adjustments)
      setValveAngle((v) => {
        const adj = Math.floor((Math.random() - 0.5) * 2);
        return Math.min(180, Math.max(0, v + adj));
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [flow, pushLog]);

  const clearAlerts = () => {
    setAlerts(0);
    pushLog("SYS", "Alert buffer cleared by operator");
  };

  return {
    flow,
    valveAngle,
    alerts,
    status,
    logs,
    pushLog,
    setValveAngle,
    setStatus,
    clearAlerts
  };
}
