"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export type TelemetryLog = {
  id: string;
  ts: number;
  source: "SYS" | "AI_CORE" | "ALERT";
  message: string;
};

export default function useMockTelemetry(initialFlow = 5.4) {
  const [flow, setFlow] = useState<number>(initialFlow);
  const [valveAngle, setValveAngle] = useState<number>(90);
  const [isCritical, setIsCritical] = useState<boolean>(false);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const pushLog = useCallback((source: TelemetryLog["source"], message: string) => {
    const entry: TelemetryLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      source,
      message,
    };
    setLogs((s) => [entry, ...s].slice(0, 50));
  }, []);

  useEffect(() => {
    pushLog("SYS", "Neptune AI Nexus — Neural Link Established.");
    pushLog("AI_CORE", "Initiating topographical environment scan...");

    const interval = setInterval(() => {
      if (!mounted.current) return;

      // Regular fluctuation
      const noise = (Math.random() - 0.5) * 0.4;
      const drift = (5.4 - flow) * 0.1;
      let nextFlow = +(flow + noise + drift).toFixed(2);
      
      // Anomaly trigger (every ~15-20 seconds statistically)
      if (Math.random() < 0.05 && !isCritical) {
        setIsCritical(true);
        nextFlow = +(nextFlow + Math.random() * 4 + 2).toFixed(2);
        pushLog("ALERT", "CRITICAL: PRESSURE SPIKE DETECTED. POTENTIAL LEAK.");
        pushLog("AI_CORE", "Environmental distortion active. Adjusting neural weights.");
        
        // Auto-recovery after 5 seconds
        setTimeout(() => {
          setIsCritical(false);
          pushLog("SYS", "Anomaly suppressed. Stabilizing flow...");
        }, 5000);
      }

      setFlow(nextFlow);

      // Valve adjustment simulation
      setValveAngle((v) => {
        const adj = isCritical ? -5 : (Math.random() - 0.5) * 2;
        return Math.min(180, Math.max(0, Math.round(v + adj)));
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [flow, isCritical, pushLog]);

  return {
    flow,
    valveAngle,
    isCritical,
    logs,
    pushLog,
    setValveAngle,
  };
}
