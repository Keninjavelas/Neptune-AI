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
 * Optimized for Information Architecture (IA) and physical prototype simulation.
 */
export default function useMockTelemetry(initialFlow = 5.4) {
  // Sensor States
  const [flow, setFlow] = useState<number>(initialFlow);
  const [tankLevel, setTankLevel] = useState<number>(85); // %
  const [tdsValue, setTdsValue] = useState<number>(120); // ppm
  const [valveAngle, setValveAngle] = useState<number>(90);
  
  // System States
  const [isManual, setIsManual] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<number>(0);
  const [status, setStatus] = useState<"online" | "critical">("online");
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [riskScore, setRiskScore] = useState<number>(5);
  const [wqi, setWqi] = useState<number>(98);
  
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
    setLogs((s) => [entry, ...s].slice(0, 15));
  }, []);

  useEffect(() => {
    pushLog("SYS", "Neptune AI Enterprise Gateway — Link Established.");

    const interval = setInterval(() => {
      if (!mounted.current) return;

      // 1. Simulate Realistic Flow & Level Fluctuations
      const flowNoise = (Math.random() - 0.5) * 0.4;
      const flowDrift = (5.4 - flow) * 0.1;
      let nextFlow = +(flow + flowNoise + flowDrift).toFixed(2);
      
      // Level drops slowly as water flows
      setTankLevel(l => Math.max(0, +(l - (nextFlow / 100)).toFixed(1)));
      
      // TDS fluctuates slightly
      setTdsValue(t => Math.max(50, +(t + (Math.random() - 0.5) * 2).toFixed(0)));

      // 2. Anomaly Logic (Leak or Contamination)
      if (Math.random() < 0.04 && status === "online") {
        const isContamination = Math.random() > 0.5;
        setStatus("critical");
        setAlerts(a => a + 1);
        
        if (isContamination) {
          setTdsValue(450);
          pushLog("ALERT", "CRITICAL: Contamination detected (TDS > 400ppm).");
          pushLog("AI_CORE", "AI Analysis: Immediate shutoff required to protect output.");
        } else {
          nextFlow = +(nextFlow + 3.5).toFixed(2);
          pushLog("ALERT", `CRITICAL: Abnormal flow variance detected (${nextFlow} L/min).`);
          pushLog("AI_CORE", "AI Analysis: Probable leak signature identified.");
        }
        
        // Auto-mitigation
        setTimeout(() => {
          if (!isManual) {
            setValveAngle(0);
            pushLog("SYS", "Autonomous command: Solenoid valve closed.");
          }
        }, 1500);

        // Auto-recovery simulation
        setTimeout(() => {
          setStatus("online");
          if (!isManual) {
            setValveAngle(90);
            pushLog("SYS", "Flow stabilized. Restoring nominal supply.");
          }
        }, 10000);
      }

      setFlow(nextFlow);

      // 3. Valve drift (only if not manual and system healthy)
      if (!isManual && status === "online" && valveAngle > 0) {
        setValveAngle((v) => {
          const adj = (Math.random() - 0.5) * 1;
          return Math.min(180, Math.max(0, Math.round(v + adj)));
        });
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [flow, status, isManual, valveAngle, pushLog]);

  return {
    flow,
    tankLevel,
    tdsValue,
    valveAngle,
    isManual,
    alerts,
    status,
    logs,
    riskScore,
    wqi,
    setIsManual,
    setValveAngle: (a: number) => {
      setValveAngle(a);
      if (isManual) pushLog("SYS", `Manual override: Valve set to ${a}°.`);
    },
    resetAlerts: () => {
      setAlerts(0);
      setStatus("online");
      setTdsValue(120);
      pushLog("SYS", "System state reset by operator.");
    }
  };
}
