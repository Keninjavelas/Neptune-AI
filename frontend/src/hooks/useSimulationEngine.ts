"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  TelemetryPacket, 
  TelemetryLog, 
  LogSource, 
  ValveState, 
  AnomalyLevel 
} from "../types/telemetry";

interface SimulationEngineProps {
  nodeId?: string;
  updateInterval?: number;
  anomalyProbability?: number;
}

export function useSimulationEngine({ 
  nodeId = "default-node", 
  updateInterval = 1000,
  anomalyProbability = 0.85 
}: SimulationEngineProps = {}) {
  // --- Centralized Telemetry State ---
  const [telemetry, setTelemetry] = useState<TelemetryPacket>({
    flowRate: 5.4,
    tds: 120,
    riskScore: 5,
    systemState: "NORMAL",
    valveAngle: 90,
    valveState: "OPEN",
    anomalyLevel: 0,
    telemetryStatus: "stable",
    relayState: false,
    systemHealth: 99.4,
    tankLevel: 85,
    stabilityScore: 99.4,
    alerts: 0,
    isManual: false,
    lastUpdated: Date.now(),
  });

  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const anomalyTimer = useRef<NodeJS.Timeout | null>(null);

  const pushLog = useCallback((source: LogSource, message: string) => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        source,
        message: `[${nodeId}] ${message}`,
      },
      ...prev,
    ].slice(0, 50));
  }, [nodeId]);

  // --- Simulation Logic ---

  const updateTelemetry = useCallback(() => {
    setTelemetry((prev) => {
      // 1. Calculate Flow Dynamics
      let noise = (Math.random() - 0.5) * 0.2;
      let targetFlow = 5.4;
      
      if (prev.anomalyLevel === 2) targetFlow = prev.flowRate > 10 ? 12.5 : 0.2;
      else if (prev.anomalyLevel === 1) targetFlow = 4.2;
      
      // Valve restriction effect
      const valveEffect = prev.valveAngle / 90;
      targetFlow *= valveEffect;

      const newFlow = Math.max(0, prev.flowRate + (targetFlow - prev.flowRate) * 0.1 + noise);

      // 2. Calculate Water Quality (TDS)
      let tdsNoise = (Math.random() - 0.5) * 2;
      let targetTds = prev.anomalyLevel === 2 ? 450 : 120;
      const newTds = Math.max(50, prev.tds + (targetTds - prev.tds) * 0.05 + tdsNoise);

      // 3. Risk Score Correlation
      let baseRisk = 5;
      if (newTds > 300) baseRisk += 60;
      if (newFlow > 10) baseRisk += 40;
      if (prev.tankLevel < 20) baseRisk += 30;
      const newRisk = Math.min(100, Math.max(2, prev.riskScore + (baseRisk - prev.riskScore) * 0.1));

      // 4. Valve State Determination
      let vState: ValveState = "OPEN";
      if (prev.valveAngle === 0) vState = "CLOSED";
      else if (prev.valveAngle < 80) vState = "PARTIAL";

      // 5. System Health & Stability
      const newHealth = Math.max(0, 100 - (newRisk * 0.5) - (prev.anomalyLevel * 20));
      
      return {
        ...prev,
        flowRate: +newFlow.toFixed(2),
        tds: +newTds.toFixed(0),
        riskScore: +newRisk.toFixed(0),
        valveState: vState,
        systemHealth: +newHealth.toFixed(1),
        stabilityScore: +(newHealth * 0.9 + (Math.random() * 10)).toFixed(1),
        tankLevel: Math.max(0, prev.tankLevel - (newFlow / 500)), // Slow depletion
        lastUpdated: Date.now(),
        relayState: prev.anomalyLevel === 2, // Relay trips on critical
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(updateTelemetry, updateInterval);
    return () => clearInterval(interval);
  }, [updateTelemetry, updateInterval]);

  // --- Anomaly Injection System ---

  const triggerAnomaly = useCallback((type?: string) => {
    setTelemetry(prev => ({ 
      ...prev, 
      anomalyLevel: 2, 
      systemState: "CRITICAL",
      alerts: prev.alerts + 1 
    }));
    
    const anomalyType = type || (Math.random() > 0.5 ? "CONTAMINATION" : "LEAK");
    
    if (anomalyType === "CONTAMINATION") {
      pushLog("ALERT", "CRITICAL: High TDS detected in primary reservoir.");
      pushLog("AI", "Chemical signature analysis: Heavy metals detected. Recalculating risk...");
    } else {
      pushLog("ALERT", "CRITICAL: Major pressure drop in Sector 7. Probable pipe burst.");
      pushLog("AI", "Flow variance exceeds 400% threshold. Initiating emergency response.");
    }

    // Auto-Mitigation if not manual
    setTimeout(() => {
      setTelemetry(prev => {
        if (!prev.isManual) {
          pushLog("CTRL", "AI Autonomous Action: Closing primary solenoid valve.");
          return { ...prev, valveAngle: 0 };
        }
        return prev;
      });
    }, 2000);

    // Auto-Recovery after 15 seconds
    setTimeout(() => {
      setTelemetry(prev => {
        pushLog("SAFE", "System integrity stabilized. Resuming nominal distribution.");
        return { ...prev, anomalyLevel: 0, systemState: "NORMAL", valveAngle: 90 };
      });
    }, 15000);

  }, [pushLog]);

  // Random Anomaly Cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      if (Math.random() > anomalyProbability) triggerAnomaly();
    }, 20000);
    return () => clearInterval(cycle);
  }, [triggerAnomaly, anomalyProbability]);

  const setIsManual = (val: boolean) => {
    setTelemetry(prev => {
      pushLog("CTRL", `Authority Shift: ${val ? "MANUAL_CONTROL_ENABLED" : "AI_AUTONOMOUS_RESTORED"}`);
      return { ...prev, isManual: val };
    });
  };

  const setValveAngle = (angle: number) => {
    setTelemetry(prev => {
      if (prev.isManual) {
        pushLog("CTRL", `Manual Override: Actuator set to ${angle}°.`);
      }
      return { ...prev, valveAngle: angle };
    });
  };

  const resetSystem = () => {
    setTelemetry(prev => ({
      ...prev,
      anomalyLevel: 0,
      alerts: 0,
      valveAngle: 90,
      tds: 120,
    }));
    pushLog("INFO", "Manual System Reset: Clearing all buffers and alerts.");
  };

  return {
    telemetry,
    logs,
    setIsManual,
    setValveAngle,
    triggerAnomaly,
    resetSystem
  };
}
