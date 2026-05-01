"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export type TelemetryLog = {
  id: string;
  ts: number;
  source: "INFO" | "AI" | "WARN" | "CTRL" | "ALERT" | "SAFE";
  message: string;
};

/**
 * Enterprise-Grade Neptune AI Telemetry Engine
 * Optimized for infrastructure monitoring simulation.
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
  const [stabilityScore, setStabilityScore] = useState<number>(99.4);
  
  const mounted = useRef(true);
  const anomalyTimer = useRef<NodeJS.Timeout | null>(null);

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
    setLogs((s) => [entry, ...s].slice(0, 20));
  }, []);

  // Main Simulation Loop
  useEffect(() => {
    if (logs.length === 0) {
      pushLog("INFO", "Neptune AI Infrastructure Gateway — Secure Link Established.");
      pushLog("AI", "Neural Engine initialized. Monitoring telemetry patterns...");
    }

    const interval = setInterval(() => {
      if (!mounted.current) return;

      // 1. Flow Dynamics (4.8 - 6.2 L/min normal)
      setFlow(prevFlow => {
        let noise = (Math.random() - 0.5) * 0.3;
        let drift = (5.4 - prevFlow) * 0.05;
        
        // Manual override or AI restriction effects
        if (valveAngle < 45) drift = (2.1 - prevFlow) * 0.1;
        if (valveAngle === 0) drift = -prevFlow * 0.5;

        const nextFlow = Math.max(0, +(prevFlow + noise + drift).toFixed(2));
        return nextFlow;
      });

      // 2. Tank Capacity (Refill cycles)
      setTankLevel(prev => {
        const discharge = flow / 150;
        let next = prev - discharge;
        if (next < 55) {
          pushLog("INFO", `Low reservoir threshold. Initiating Sector 4 refill cycle.`);
          return 95; // Simulated instant or fast refill for demo
        }
        return +next.toFixed(1);
      });

      // 3. TDS / Water Quality
      setTdsValue(prev => {
        const noise = (Math.random() - 0.5) * 2;
        const target = status === "critical" && prev > 300 ? 450 : 120;
        const drift = (target - prev) * 0.1;
        return Math.max(50, +(prev + noise + drift).toFixed(0));
      });

      // 4. Stability Score
      setStabilityScore(prev => {
        const target = status === "critical" ? 65 : 99.4;
        const drift = (target - prev) * 0.1;
        const noise = (Math.random() - 0.5) * 0.5;
        return +Math.min(100, Math.max(0, prev + drift + noise)).toFixed(1);
      });

      // 5. AI Risk Score (Correlated)
      setRiskScore(prev => {
        let target = 5;
        if (status === "critical") target = 85;
        else if (tdsValue > 180 || flow > 8 || tankLevel < 60) target = 35;
        
        const drift = (target - prev) * 0.15;
        return +Math.min(100, Math.max(2, prev + drift)).toFixed(0);
      });

      // 6. Anomaly Trigger (Rare events)
      if (Math.random() < 0.02 && status === "online") {
        const eventType = Math.random();
        setStatus("critical");
        setAlerts(a => a + 1);

        if (eventType < 0.3) {
          // Contamination Event
          setTdsValue(480);
          pushLog("ALERT", "CRITICAL: Chemical variance detected in Main Feed Line.");
          pushLog("AI", "Recalculating risk... Contamination signature confirmed.");
          pushLog("AI", "Action Recommendation: Immediate solenoid isolation.");
        } else if (eventType < 0.6) {
          // Leak Event
          setFlow(12.4);
          pushLog("ALERT", "CRITICAL: High-velocity pressure drop detected in Sector 2.");
          pushLog("AI", "Risk Score spiked to 89%. Probable structural breach identified.");
        } else {
          // Instability Event
          setStabilityScore(42);
          pushLog("WARN", "WARNING: Distribution grid frequency instability detected.");
          pushLog("AI", "Neural Confidence dropping. Adjusting actuator harmonics.");
        }

        // Autonomous Mitigation (if not manual)
        if (!isManual) {
          anomalyTimer.current = setTimeout(() => {
            setValveAngle(0);
            pushLog("CTRL", "AI Autonomous Command: Valve isolated to 0°.");
            pushLog("SAFE", "Hazard contained. Monitoring stabilization progress...");
            
            // Auto-recovery
            setTimeout(() => {
              setStatus("online");
              setValveAngle(90);
              pushLog("SAFE", "Infrastructure integrity restored. Resuming nominal flow.");
              pushLog("INFO", "Recalibrating sensors for Sector 2...");
            }, 8000);
          }, 2000);
        }
      }

    }, 2000);

    return () => {
      clearInterval(interval);
      if (anomalyTimer.current) clearTimeout(anomalyTimer.current);
    };
  }, [flow, status, isManual, valveAngle, pushLog, tankLevel, tdsValue, logs.length]);

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
    stabilityScore,
    setIsManual: (val: boolean) => {
      setIsManual(val);
      pushLog("CTRL", `Authority Shift: ${val ? "MANUAL_OVERRIDE_ENABLED" : "AI_AUTONOMOUS_RESTORED"}`);
    },
    setValveAngle: (a: number) => {
      setValveAngle(a);
      if (isManual) pushLog("CTRL", `Manual Actuator Command: Position set to ${a}°.`);
    },
    resetAlerts: () => {
      setAlerts(0);
      setStatus("online");
      setTdsValue(120);
      pushLog("SAFE", "Operator manual reset: Clearing all active alerts.");
    }
  };
}
